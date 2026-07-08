import fs from "node:fs";
import path from "node:path";
import { slugify } from "../lib/slug";

export const SOURCE_PATH = path.join(
  process.cwd(),
  "research/assisted-living-directory/assets/chicagoland-base-directory.md",
);

const COUNTY_MAP: Record<string, string> = {
  "COOK COUNTY": "Cook",
  "DUPAGE COUNTY": "DuPage",
  "WILL COUNTY": "Will",
  "LAKE COUNTY": "Lake",
  "KANE COUNTY": "Kane",
};

export interface ParsedReview {
  platform: string;
  score: number | null;
  count: number | null;
  note: string;
}

export interface ParsedFacility {
  name: string;
  slug: string;
  address: string | null;
  city: string;
  zip: string | null;
  county: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  careLevels: string[];
  roomTypes: string[];
  amenities: string[];
  license: string | null;
  licenseVerified: boolean;
  capacity: number | null;
  capacityNote: string | null;
  priceMin: number | null;
  priceNote: string | null;
  priceEstimate: boolean;
  medicaidAccepted: boolean;
  operator: string | null;
  yearOpened: number | null;
  summary: string | null;
  flags: string | null;
  qualityTier: string | null;
  reviews: ParsedReview[];
}

function splitTopLevel(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts.filter(Boolean);
}

function parseAddress(raw: string | undefined): { city: string; zip: string | null } {
  if (!raw) return { city: "", zip: null };
  // Zip must immediately follow "IL" (possibly with a hyphenated +4) to avoid
  // matching a 5-digit street number elsewhere in the line.
  const zipMatch = raw.match(/\bIL\s+(\d{5})\b/);
  const cityMatches = [...raw.matchAll(/([A-Za-z][A-Za-z .'\-]*?)\s*,\s*IL\b/g)];
  const city = cityMatches.length ? cityMatches[cityMatches.length - 1][1].trim() : "";
  return { city, zip: zipMatch ? zipMatch[1] : null };
}

function parseCapacity(raw: string | undefined): { capacity: number | null; note: string | null } {
  if (!raw) return { capacity: null, note: null };
  const m = raw.match(/(\d+)/);
  return { capacity: m ? parseInt(m[1], 10) : null, note: raw };
}

function parsePrice(raw: string | undefined): { priceMin: number | null; note: string | null; estimate: boolean } {
  if (!raw) return { priceMin: null, note: null, estimate: true };
  // CCRCs often list a large one-time entrance fee alongside a much smaller
  // recurring monthly fee (e.g. "entrance fee from ~$243,800 ... monthly from
  // ~$3,435"). Prefer the figure tagged "monthly" so we never surface an
  // entrance fee as if it were the monthly rate.
  const monthlyMatch = raw.match(/monthly[^$]*\$([\d,]+)/i);
  const m = monthlyMatch ?? raw.match(/\$([\d,]+)/);
  const priceMin = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
  const estimate = !/facility-stated/i.test(raw);
  return { priceMin, note: raw, estimate };
}

const KNOWN_PLATFORMS = [
  "A Place for Mom",
  "Caring.com",
  "U.S. News",
  "Yelp",
  "Google",
  "Seniorly",
  "BBB",
  "AHCA/NCAL",
  "Great Place to Work",
  "Fortune",
];

function parseReviews(raw: string | undefined): ParsedReview[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((seg) => {
      const known = KNOWN_PLATFORMS.find((p) => seg.toLowerCase().startsWith(p.toLowerCase()));
      if (!seg.includes("/")) {
        const m = seg.match(/^([A-Za-z .&']+?)\s+(\d(?:\.\d+)?)\s*\((\d+)\s*reviews?\)/i);
        if (m) {
          return {
            platform: known ?? m[1].trim(),
            score: parseFloat(m[2]),
            count: parseInt(m[3], 10),
            note: seg,
          };
        }
      }
      if (known) return { platform: known, score: null, count: null, note: seg };
      const platformGuess = seg.split(/\s+\d|\s+"|\(/)[0].trim();
      return { platform: platformGuess || seg, score: null, count: null, note: seg };
    });
}

function parseQualitySummary(
  raw: string | undefined,
  note: string | undefined,
): { summary: string | null; flags: string | null; qualityTier: string | null } {
  if (!raw) return { summary: note ?? null, flags: null, qualityTier: null };
  const plain = raw.replace(/\*\*/g, "");

  let qualityTier: string | null = null;
  if (/Tier\s*1/i.test(plain)) {
    qualityTier = /with flag/i.test(plain) ? "Tier 1 (with flag)" : "Tier 1";
  } else if (/Tier\s*2/i.test(plain)) {
    qualityTier = "Tier 2";
  } else if (/Affordable\/?\s*Medicaid tier/i.test(plain)) {
    qualityTier = "Affordable/Medicaid";
  }

  let flags: string | null = null;
  const flagIdx = plain.search(/FLAG/i);
  let summary = plain;
  if (flagIdx !== -1) {
    const flagMatch = plain.slice(flagIdx).match(/FLAG(?:\s+for)?:?\s*(.*)/i);
    if (flagMatch) {
      let f = flagMatch[1];
      f = f.replace(/\s*Tier\s*\d(\s*\(with flag\))?\.?\s*$/i, "");
      f = f.replace(/\s*Affordable\/?\s*Medicaid tier\.?\s*$/i, "");
      flags = f.trim() || null;
    }
    summary = plain.slice(0, flagIdx).trim();
  }

  summary = summary
    .replace(/\s*Tier\s*\d(\s*\(with flag\))?\.?\s*$/i, "")
    .replace(/\s*Affordable\/?\s*Medicaid tier\.?\s*$/i, "")
    .trim();

  if (note) summary = summary ? `${summary} Note: ${note}` : `Note: ${note}`;

  return { summary: summary || null, flags, qualityTier };
}

export function parseFacilities(): ParsedFacility[] {
  const raw = fs.readFileSync(SOURCE_PATH, "utf-8");
  const lines = raw.split("\n");

  let currentCounty = "";
  const blocks: { county: string; lines: string[] }[] = [];
  let current: { county: string; lines: string[] } | null = null;

  for (const line of lines) {
    const countyHeaderMatch = line.match(/^##\s+(.+)$/);
    if (countyHeaderMatch) {
      const heading = countyHeaderMatch[1].toUpperCase();
      const key = Object.keys(COUNTY_MAP).find((k) => heading.startsWith(k));
      currentCounty = key ? COUNTY_MAP[key] : "";
      continue;
    }
    const facilityHeaderMatch = line.match(/^###\s*\d+\.\s*(.+)$/);
    if (facilityHeaderMatch) {
      if (current) blocks.push(current);
      current = { county: currentCounty, lines: [line] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) blocks.push(current);

  const seenSlugs = new Set<string>();

  return blocks
    .filter((b) => b.county)
    .map((block) => {
      const headerMatch = block.lines[0].match(/^###\s*\d+\.\s*(.+)$/)!;
      const name = headerMatch[1].trim();

      const fields: Record<string, string> = {};
      for (const line of block.lines.slice(1)) {
        const m = line.trim().match(/^-\s*([^:]+):\s*(.+)$/);
        if (m) fields[m[1].trim().toLowerCase()] = m[2].trim();
      }

      let slug = slugify(name);
      if (seenSlugs.has(slug)) {
        const { city } = parseAddress(fields["address"]);
        slug = slugify(`${name}-${city}`);
      }
      seenSlugs.add(slug);

      const addressRaw = fields["address"] ?? null;
      const { city, zip } = parseAddress(fields["address"]);
      const { capacity, note: capacityNote } = parseCapacity(
        fields["capacity"] ?? fields["licensed capacity"],
      );
      const { priceMin, note: priceNote, estimate: priceEstimate } = parsePrice(fields["price"]);
      const reviews = parseReviews(fields["reviews"]);
      const { summary, flags, qualityTier } = parseQualitySummary(
        fields["quality summary"],
        fields["note"],
      );

      const licenseRaw = fields["license"] ?? null;
      const licenseVerified = !!licenseRaw && /#/.test(licenseRaw) && !/\(verify\)/i.test(licenseRaw);

      let yearOpened: number | null = null;
      if (fields["opened"]) {
        const m = fields["opened"].match(/(\d{4})/);
        yearOpened = m ? parseInt(m[1], 10) : null;
      }

      return {
        name,
        slug,
        address: addressRaw,
        city,
        zip,
        county: block.county,
        phone: fields["phone"] ?? null,
        website: fields["website"] ?? null,
        email: fields["email"] ?? null,
        careLevels: splitTopLevel(fields["care levels"] ?? ""),
        roomTypes: splitTopLevel(fields["room types"] ?? ""),
        amenities: splitTopLevel(fields["amenities"] ?? ""),
        license: licenseRaw,
        licenseVerified,
        capacity,
        capacityNote,
        priceMin,
        priceNote,
        priceEstimate,
        medicaidAccepted: /yes/i.test(fields["medicaid/slp"] ?? ""),
        operator: fields["operator"] ?? null,
        yearOpened,
        summary,
        flags,
        qualityTier,
        reviews,
      } satisfies ParsedFacility;
    });
}
