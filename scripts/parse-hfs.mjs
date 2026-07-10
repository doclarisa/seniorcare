import fs from "node:fs";
import path from "node:path";

// Parses a raw HFS Supportive Living Program county page (already downloaded
// via curl, NOT re-derived by an LLM summarizer) into structured records.
//
// HFS uses at least THREE different page templates across the seven
// counties -- verified by inspecting each county's raw HTML individually
// rather than assuming one applies to all:
//
// Template A ("list"), Cook:
//   <ul><li>Name, Street, City, IL Zip, Phone<br />
//   <strong>**Dementia care setting...</strong></li>...</ul>
//
// Template B ("heading"), DuPage/Lake/Will/McHenry/Kendall:
//   <h3 class="cmp-title__text"> Name</h3>
//   <div class="text ..."><p [attrs]>Street<br />City, IL Zip<br />Phone<br />
//   Web site: <a href="...">...</a><br /><strong>**Dementia...</strong></p></div>
//   (Kendall wraps multiple <p class="ms-rteElement-P"> tags in a
//   <blockquote> instead of one <p> with <br />-separated lines -- same
//   template, different inner markup, handled by scoping to "next <h3>"
//   rather than "next </p>".)
//
// Template C ("paragraphs"), Kane:
//   <p>Name<br />Street<br />City, IL Zip<br />Phone<br />...</p>
//   with no per-facility heading at all; a trailing note-only <p> (e.g. a
//   population-served flag) belongs to the immediately preceding facility.
//
// Formatting inside a block is sometimes inconsistent (e.g. missing comma
// between street and city, zip without a literal "IL" on some Kane rows),
// so extraction is conservative: a field that can't be found confidently is
// left null rather than guessed.

const PHONE_RE = /\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/;
const ZIP_RE = /\b(\d{5})\b/;

function extractCommon(blockHtml) {
  const websiteMatch = blockHtml.match(/<a href="([^"]+)"/);
  const website = websiteMatch ? websiteMatch[1] : null;
  const dementiaCare = /Dementia care setting/i.test(blockHtml);
  const popNoteMatch = blockHtml.match(/<strong>\s*(\*Serves[^<]*)<\/strong>/i);
  const populationServedNote = popNoteMatch ? popNoteMatch[1].trim() : null;
  return { website, dementiaCare, populationServedNote };
}

function linesOf(blockHtml) {
  return blockHtml
    .split(/<br\s*\/?>|<\/p>\s*<p[^>]*>/gi)
    .map((l) => l.replace(/<[^>]+>/g, "").replace(/&#34;/g, '"').replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function addressFromLines(lines, name) {
  const filtered = lines.filter((l, i) => !(i === 0 && l.toLowerCase() === (name ?? "").toLowerCase()));
  const streetIdx = filtered.findIndex((l) => /^\d/.test(l));
  const street = streetIdx !== -1 ? filtered[streetIdx] : null;

  // City/zip line: prefer one with "IL", but some Kane rows omit the state
  // abbreviation entirely (e.g. "Aurora 60504") -- fall back to the line
  // right after the street line if it ends in a 5-digit zip.
  let zip = null;
  let city = null;
  const cityZipLine =
    filtered.find((l) => /,?\s*IL\b/i.test(l) && ZIP_RE.test(l)) ??
    (streetIdx !== -1 ? filtered[streetIdx + 1] : undefined);
  if (cityZipLine) {
    const m = cityZipLine.match(ZIP_RE);
    if (m) zip = m[1];
    // strip a trailing ", IL 60542" / " IL 60542" / " 60542" to isolate the
    // city name; only trust this when something is left over (avoids
    // returning "" as if it were a real, verified city name).
    const cityMatch = cityZipLine.match(/^(.*?),?\s*(?:IL)?\s*\d{5}\s*$/i);
    const candidate = cityMatch?.[1]?.trim();
    if (candidate) city = candidate;
  }

  const phoneLine = filtered.find((l) => PHONE_RE.test(l));
  const phone = phoneLine ? phoneLine.match(PHONE_RE)[0] : null;

  return { street, city, zip, phone };
}

// --- Template A: <ul><li>...</li></ul> ------------------------------------

function parseListTemplate(listHtml) {
  const liBlocks = listHtml.match(/<li>[\s\S]*?<\/li>/gi) || [];
  return liBlocks.map((li) => {
    const { website, dementiaCare, populationServedNote } = extractCommon(li);
    const plain = li.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const phoneMatch = plain.match(PHONE_RE);
    const phone = phoneMatch ? phoneMatch[0] : null;
    const beforePhone = phone ? plain.slice(0, plain.indexOf(phone)).trim() : plain;
    const firstComma = beforePhone.indexOf(",");
    const name = firstComma !== -1 ? beforePhone.slice(0, firstComma).trim() : beforePhone.trim();
    let rawAddress = firstComma !== -1 ? beforePhone.slice(firstComma + 1).trim() : null;
    if (rawAddress) rawAddress = rawAddress.replace(/,\s*$/, "").trim();
    const zipMatch = plain.match(/\bIL,?\s+(\d{5})\b/);
    const zip = zipMatch ? zipMatch[1] : null;
    return { name, rawAddress, zip, phone, dementiaCare, populationServedNote, website };
  });
}

// --- Template B: per-facility <h3 class="cmp-title__text"> + body --------

function parseHeadingTemplate(html, listStart) {
  const scoped = html.slice(listStart);
  const stopIdx = scoped.search(/cmp-agency-footer|Back to top/i);
  const bounded = stopIdx !== -1 ? scoped.slice(0, stopIdx) : scoped;

  const headingRe = /<h3 class="cmp-title__text">\s*([^<]+?)\s*<\/h3>/g;
  const headings = [];
  let m;
  while ((m = headingRe.exec(bounded))) {
    headings.push({ name: m[1].trim(), start: m.index, bodyStart: headingRe.lastIndex });
  }

  return headings.map((h, i) => {
    const bodyEnd = i + 1 < headings.length ? headings[i + 1].start : bounded.length;
    const body = bounded.slice(h.bodyStart, bodyEnd);
    const { website, dementiaCare, populationServedNote } = extractCommon(body);
    const { street, city, zip, phone } = addressFromLines(linesOf(body), h.name);
    return { name: h.name, rawAddress: street, city, zip, phone, dementiaCare, populationServedNote, website };
  });
}

// --- Template C: bare <p> blocks, no per-facility heading -----------------

function parseParagraphTemplate(html, listStart) {
  const scoped = html.slice(listStart);
  const stopIdx = scoped.search(/cmp-agency-footer|Back to top/i);
  const bounded = stopIdx !== -1 ? scoped.slice(0, stopIdx) : scoped;

  const pBlocks = bounded.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  const records = [];
  for (const p of pBlocks) {
    const lines = linesOf(p);
    if (lines.length === 0) continue;

    const hasAddressLine = lines.some((l) => /^\d/.test(l));
    const hasPhone = lines.some((l) => PHONE_RE.test(l));

    if (!hasAddressLine || !hasPhone) {
      // Not a standalone facility block -- if it's a note (dementia flag /
      // population-served flag) and we already have a facility, attach it
      // to the most recently seen one rather than dropping it.
      if (records.length > 0) {
        const { dementiaCare, populationServedNote } = extractCommon(p);
        if (dementiaCare) records[records.length - 1].dementiaCare = true;
        if (populationServedNote && !records[records.length - 1].populationServedNote) {
          records[records.length - 1].populationServedNote = populationServedNote;
        }
      }
      continue;
    }

    const name = lines[0];
    const { website, dementiaCare, populationServedNote } = extractCommon(p);
    const { street, city, zip, phone } = addressFromLines(lines.slice(1), null);
    records.push({ name, rawAddress: street, city, zip, phone, dementiaCare, populationServedNote, website });
  }
  return records;
}

function parseHfsHtml(html) {
  const listStart = html.indexOf("Operational Supportive Living Facility");
  if (listStart === -1) {
    throw new Error(
      "Could not locate the 'Operational Supportive Living Facility' heading in the page — layout may have changed. Aborting rather than guessing.",
    );
  }

  const nearbyChunk = html.slice(listStart, listStart + 500);
  if (/<ul>/.test(nearbyChunk)) {
    const ulStart = html.indexOf("<ul>", listStart);
    const ulEnd = html.indexOf("</ul>", ulStart);
    if (ulStart === -1 || ulEnd === -1) {
      throw new Error("Detected list template but could not find a matching </ul>. Aborting rather than guessing.");
    }
    const records = parseListTemplate(html.slice(ulStart, ulEnd));
    if (records.length === 0) throw new Error("List template matched zero facilities. Aborting rather than guessing.");
    return records;
  }

  if (/<h3 class="cmp-title__text">/.test(html.slice(listStart, listStart + 3000))) {
    const records = parseHeadingTemplate(html, listStart);
    if (records.length === 0) throw new Error("Heading template matched zero facilities. Aborting rather than guessing.");
    return records;
  }

  const records = parseParagraphTemplate(html, listStart);
  if (records.length === 0) {
    throw new Error(
      "None of the known HFS page templates (list / heading / paragraph) matched any facilities on this page. Layout may have changed -- aborting rather than guessing.",
    );
  }
  return records;
}

export function parseHfsCountyFile(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf-8");
  return parseHfsHtml(html);
}

const isMain = path.resolve(process.argv[1] ?? "") === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (isMain) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) {
    console.error("Usage: node scripts/parse-hfs.mjs <input.html> <output.json>");
    process.exit(1);
  }
  const records = parseHfsCountyFile(path.resolve(inputPath));
  fs.writeFileSync(path.resolve(outputPath), JSON.stringify(records, null, 2));
  console.log(`Parsed ${records.length} records -> ${outputPath}`);
}
