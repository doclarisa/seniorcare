import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "data", "raw", "idph");
const CHECKPOINT_FILE = path.join(OUT_DIR, "assisted-living-il.checkpoint.jsonl");
const FINAL_FILE = path.join(OUT_DIR, "assisted-living-il.json");
const LOG_FILE = path.join(OUT_DIR, "crawl.log");
const DELAY_MS = 500;

fs.mkdirSync(OUT_DIR, { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + "\n");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- text parsing helpers -------------------------------------------------

function linesOf(text) {
  return text.split("\n").map((l) => l.trim());
}

// Find the label, then return the next non-blank line, UNLESS that next
// non-blank line is itself one of the other known labels (meaning the field
// is legitimately empty in the UI, e.g. "Number of Floating Units" with no
// value before the next label starts).
function valueAfterLabel(lines, label, allLabels, opts = {}) {
  const idx = lines.findIndex((l) => l === label);
  if (idx === -1) return { found: false, value: null };
  for (let i = idx + 1; i < lines.length && i < idx + 6; i++) {
    const l = lines[i];
    if (l === "") continue;
    if (opts.skipLines && opts.skipLines.includes(l)) continue;
    if (allLabels.includes(l)) return { found: true, value: null };
    return { found: true, value: l };
  }
  return { found: true, value: null };
}

const FACILITY_INFO_LABELS = [
  "Facility Status",
  "Facility Type",
  "LLCS Region",
  "Administrator Name",
  "Facility Phone Number",
  "Facility Address",
  "Facility County",
  "Facility ID",
  "Licensee ID",
  "Number of Permanent Units (Not Floating)",
  "Number of Floating Units",
  "Number of Alzheimer's Units",
  "Number of Independent Units",
  "Approved Services",
  "Alzheimer's Special Care Program",
];

function parseFacilityInfo(bodyText) {
  const lines = linesOf(bodyText);

  const status = valueAfterLabel(lines, "Facility Status", FACILITY_INFO_LABELS);
  const facilityType = valueAfterLabel(lines, "Facility Type", FACILITY_INFO_LABELS);
  const region = valueAfterLabel(lines, "LLCS Region", FACILITY_INFO_LABELS);
  const administratorName = valueAfterLabel(lines, "Administrator Name", FACILITY_INFO_LABELS, {
    skipLines: ["Administrator Name Help Info"],
  });
  const phone = valueAfterLabel(lines, "Facility Phone Number", FACILITY_INFO_LABELS);
  const county = valueAfterLabel(lines, "Facility County", FACILITY_INFO_LABELS);
  const facilityId = valueAfterLabel(lines, "Facility ID", FACILITY_INFO_LABELS);
  const licenseeId = valueAfterLabel(lines, "Licensee ID", FACILITY_INFO_LABELS);
  const permanentUnits = valueAfterLabel(
    lines,
    "Number of Permanent Units (Not Floating)",
    FACILITY_INFO_LABELS,
  );
  const floatingUnits = valueAfterLabel(lines, "Number of Floating Units", FACILITY_INFO_LABELS);
  const alzheimersUnits = valueAfterLabel(lines, "Number of Alzheimer's Units", FACILITY_INFO_LABELS);
  const independentUnits = valueAfterLabel(lines, "Number of Independent Units", FACILITY_INFO_LABELS);
  const alzheimersProgram = valueAfterLabel(
    lines,
    "Alzheimer's Special Care Program",
    FACILITY_INFO_LABELS,
  );

  // Facility Address renders as two lines: street, then "City, State Zip"
  const addrIdx = lines.findIndex((l) => l === "Facility Address");
  let street = null;
  let cityStateZip = null;
  if (addrIdx !== -1) {
    const rest = lines.slice(addrIdx + 1, addrIdx + 6).filter((l) => l !== "");
    street = rest[0] ?? null;
    cityStateZip = rest[1] ?? null;
  }

  return {
    status,
    facilityType,
    region,
    administratorName,
    phone,
    county,
    facilityId,
    licenseeId,
    permanentUnits,
    floatingUnits,
    alzheimersUnits,
    independentUnits,
    alzheimersProgram,
    street,
    cityStateZip,
  };
}

function parseSurveys(bodyText) {
  const lines = linesOf(bodyText);
  const startIdx = lines.findIndex((l) => l === "Selected Stages");
  const endIdx = lines.findIndex((l) => l === "Back to top▲");
  if (startIdx === -1 || endIdx === -1) return [];
  const scoped = lines.slice(startIdx, endIdx);

  // split into blocks starting at each "Survey ID #"
  const blockStarts = [];
  scoped.forEach((l, i) => {
    if (l === "Survey ID #") blockStarts.push(i);
  });

  const surveys = [];
  for (let b = 0; b < blockStarts.length; b++) {
    const start = blockStarts[b];
    const end = b + 1 < blockStarts.length ? blockStarts[b + 1] : scoped.length;
    const block = scoped.slice(start, end).filter((l) => l !== "");

    let surveyId = null;
    let exitDate = null;
    let surveyType = null;
    const documents = [];

    for (let i = 0; i < block.length; i++) {
      const l = block[i];
      if (l === "Survey ID #" && i + 1 < block.length && block[i + 1] !== "Survey Exit Date") {
        surveyId = block[i + 1];
      }
      if (l === "Survey Exit Date" && i + 1 < block.length) {
        exitDate = block[i + 1];
      }
      if (l === "Survey Type" && i + 1 < block.length && !block[i + 1].startsWith("View ")) {
        surveyType = block[i + 1];
      }
      if (l.startsWith("View 2567")) documents.push(l);
    }

    surveys.push({ surveyId, exitDate, surveyType, documents });
  }
  return surveys;
}

// --- checkpoint helpers ----------------------------------------------------

function loadCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_FILE)) return new Map();
  const map = new Map();
  const lines = fs.readFileSync(CHECKPOINT_FILE, "utf8").split("\n").filter(Boolean);
  for (const line of lines) {
    try {
      const rec = JSON.parse(line);
      if (rec.salesforceId) map.set(rec.salesforceId, rec);
    } catch {
      // skip corrupt line
    }
  }
  return map;
}

function appendCheckpoint(record) {
  fs.appendFileSync(CHECKPOINT_FILE, JSON.stringify(record) + "\n");
}

// --- main crawl --------------------------------------------------------

async function main() {
  const done = loadCheckpoint();
  log(`Resuming with ${done.size} facilities already checkpointed.`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext().then((c) => c.newPage());

  log("Navigating to facility lookup...");
  await page.goto("https://llcs.dph.illinois.gov/s/facility-lookup", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(1500);

  await page.locator("button").nth(1).click();
  await page.waitForTimeout(800);
  await page.getByText("Assisted Living/Shared Housing Establishment", { exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.waitForTimeout(4000);
  await page.waitForLoadState("networkidle").catch(() => {});

  // confirm total count matches expectation
  const bodyText0 = await page.locator("body").innerText();
  const totalMatch = bodyText0.match(/Viewing \d+-\d+ of (\d+)/);
  if (!totalMatch) {
    throw new Error("STOP: could not find 'Viewing X-Y of N' pagination text on search results. Cannot verify total count.");
  }
  const total = parseInt(totalMatch[1], 10);
  log(`Search returned ${total} total facilities.`);

  // NOTE: we deliberately do NOT fast-forward by position (done.size / 10).
  // The search-results ordering in this Salesforce app is not stable across
  // page loads/sessions, so "page 55" on one run can show different
  // facilities than "page 55" on another. Fast-forwarding on that assumption
  // caused the crawl to permanently skip ~73 facilities that happened to
  // land on earlier pages in this session while already-scraped facilities
  // reappeared on the later pages we jumped to. Always walk from page 1;
  // the done-set skip check below makes re-visiting already-checkpointed
  // rows cheap.

  let processedThisRun = 0;
  let pageNum = 0;

  while (true) {
    const bodyTextPage = await page.locator("body").innerText();
    const rangeMatch = bodyTextPage.match(/Viewing (\d+)-(\d+) of (\d+)/);
    if (!rangeMatch) {
      throw new Error(`STOP: lost pagination context at page ${pageNum}. Cannot verify position.`);
    }
    log(`Page ${pageNum + 1}: viewing ${rangeMatch[1]}-${rangeMatch[2]} of ${rangeMatch[3]}`);

    const rowCount = await page
      .locator('button:has-text("View Details"), a:has-text("View Details")')
      .count();

    for (let i = 0; i < rowCount; i++) {
      const rows = page.locator('button:has-text("View Details"), a:has-text("View Details")');
      await rows.nth(i).click();
      await page.waitForTimeout(2500);
      await page.waitForLoadState("networkidle").catch(() => {});

      const nameEl = page.locator("h1, .slds-page-header__title").first();
      let name = (await nameEl.textContent().catch(() => null))?.trim();
      if (!name) {
        // Could be a slow render rather than a genuine parse failure — give
        // it one more chance with a longer wait before treating it as fatal.
        log(`  name not found on first read at page ${pageNum + 1}, row ${i}; retrying with longer wait...`);
        await page.waitForTimeout(5000);
        await page.waitForLoadState("networkidle").catch(() => {});
        name = (await nameEl.textContent().catch(() => null))?.trim();
      }
      if (!name) {
        throw new Error(`STOP: could not read facility name at page ${pageNum + 1}, row ${i}. Aborting rather than guessing.`);
      }

      let facilityInfoText = await page.locator("body").innerText();
      let info = parseFacilityInfo(facilityInfoText);

      // A Facility ID/Status is never legitimately blank for a real record —
      // unlike optional fields (e.g. Floating Units), so require a non-null
      // .value here, not just .found. A label can be "found" while its value
      // is null because the page rendered section headers before the field
      // values populated (a timing issue, not a genuinely empty field); that
      // previously slipped through and let section-header text like
      // "Facility Information" get written into facilityId.
      if (!info.status.found || !info.status.value || !info.facilityId.found || !info.facilityId.value) {
        log(`  status/facilityId not found on first read for "${name}"; retrying with longer wait...`);
        await page.waitForTimeout(5000);
        await page.waitForLoadState("networkidle").catch(() => {});
        facilityInfoText = await page.locator("body").innerText();
        info = parseFacilityInfo(facilityInfoText);
      }

      if (!info.status.found || !info.status.value || !info.facilityId.found || !info.facilityId.value) {
        throw new Error(
          `STOP: could not parse required fields (status/facilityId) for "${name}" at page ${pageNum + 1}, row ${i}. Aborting rather than guessing.`,
        );
      }

      // Surveys tab
      await page.getByText("Surveys", { exact: true }).click();
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle").catch(() => {});
      const surveysText = await page.locator("body").innerText();
      const surveys = parseSurveys(surveysText);

      // Salesforce record Id isn't visible in the UI text; use Facility ID
      // (the human-readable IDPH id) as our stable key instead, per the
      // user's instruction.
      const record = {
        salesforceId: info.facilityId.value, // stable key for checkpointing
        name,
        facilityId: info.facilityId.value,
        licenseeId: info.licenseeId.value,
        status: info.status.value,
        facilityType: info.facilityType.value,
        region: info.region.value,
        administratorName: info.administratorName.value,
        phone: info.phone.value,
        street: info.street,
        cityStateZip: info.cityStateZip,
        county: info.county.value,
        permanentUnits: info.permanentUnits.value,
        floatingUnits: info.floatingUnits.value,
        alzheimersUnits: info.alzheimersUnits.value,
        independentUnits: info.independentUnits.value,
        alzheimersSpecialCareProgram: info.alzheimersProgram.value,
        surveys,
        scrapedAt: new Date().toISOString(),
      };

      if (!done.has(record.salesforceId)) {
        appendCheckpoint(record);
        done.set(record.salesforceId, record);
        processedThisRun++;
        log(`  [${done.size}/${total}] ${name} (${record.facilityId}, ${record.status})`);
      } else {
        log(`  [skip, already checkpointed] ${name} (${record.facilityId})`);
      }

      // back to results
      await page.getByRole("link", { name: "Search Results" }).click();
      await page.waitForTimeout(1500);
      await page.waitForLoadState("networkidle").catch(() => {});

      await sleep(DELAY_MS);
    }

    // advance to next page, or stop if we've covered everything
    if (done.size >= total) {
      log("All facilities checkpointed. Done.");
      break;
    }

    const nextPage = page.getByText("Next Page", { exact: true });
    const nextCount = await nextPage.count();
    const nextEnabled = nextCount > 0 && (await nextPage.locator("xpath=ancestor::button[1]").isEnabled().catch(() => false));
    if (nextCount === 0 || !nextEnabled) {
      log(
        `Reached the last page but only ${done.size}/${total} done (${total - done.size} facilities never appeared under any page position this pass). Stopping this pass rather than retry-looping on a disabled control; a repeat run will re-walk from page 1 and pick up anything still missing.`,
      );
      break;
    }
    await nextPage.click();
    await page.waitForTimeout(1500);
    await page.waitForLoadState("networkidle").catch(() => {});
    pageNum++;
  }

  await browser.close();
  log(`Pass complete. Processed ${processedThisRun} new facilities this pass. Total checkpointed: ${done.size}/${total}.`);

  if (done.size < total) {
    return { complete: false, doneSize: done.size, total };
  }

  // finalize — only write the final deliverable once every facility has
  // actually been checkpointed, never on a partial pass.
  const all = [...done.values()];
  fs.writeFileSync(FINAL_FILE, JSON.stringify(all, null, 2));
  log(`Wrote ${all.length} raw records to ${FINAL_FILE}`);
  return { complete: true, doneSize: done.size, total };
}

async function run() {
  const MAX_RETRIES = 30;
  const MAX_FULL_PASSES = 6;
  let fullPasses = 0;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await main();
      if (result.complete) return; // success
      fullPasses++;
      log(`Full pass ${fullPasses}/${MAX_FULL_PASSES} finished incomplete (${result.doneSize}/${result.total}). Starting another pass from page 1.`);
      if (fullPasses >= MAX_FULL_PASSES) {
        log(
          `STOP: after ${fullPasses} full passes, still only ${result.doneSize}/${result.total} facilities checkpointed. ` +
            `The remaining ${result.total - result.doneSize} facilities never appeared under any page position across repeated passes — ` +
            `this looks like a genuine gap (not just result-ordering drift) and needs manual review rather than more automated retries.`,
        );
        process.exit(1);
      }
      // Not a transient error, so don't count this against MAX_RETRIES.
      attempt--;
      continue;
    } catch (err) {
      const isHardStop = err.message?.startsWith("STOP:");
      if (isHardStop) {
        log(`HARD STOP (not retrying): ${err.message}`);
        console.error(err);
        process.exit(1);
      }
      log(`Transient failure on attempt ${attempt}/${MAX_RETRIES}: ${err.message}. Restarting browser and resuming from checkpoint.`);
      if (attempt === MAX_RETRIES) {
        log("FATAL: exhausted retries.");
        console.error(err);
        process.exit(1);
      }
      await sleep(3000);
    }
  }
}

run();
