import fs from "node:fs";
import path from "node:path";

// Parses the CMS Provider Data Catalog "Nursing Homes — Provider Information"
// CSV (downloaded directly from data.cms.gov, not summarized/re-derived) and
// filters to a given state/county. Source: dataset 4pq5-n9py.

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function parseCsv(text) {
  const lines = text.split(/\r\n|\n/).filter((l) => l.length > 0);
  const header = parseCsvLine(lines[0]);
  return lines.slice(1).map((l) => {
    const fields = parseCsvLine(l);
    return Object.fromEntries(header.map((h, i) => [h, fields[i] ?? ""]));
  });
}

const FIELD_MAP = {
  ccn: "CMS Certification Number (CCN)",
  name: "Provider Name",
  address: "Provider Address",
  city: "City/Town",
  state: "State",
  zip: "ZIP Code",
  phone: "Telephone Number",
  county: "County/Parish",
  ownershipType: "Ownership Type",
  certifiedBeds: "Number of Certified Beds",
  avgResidentsPerDay: "Average Number of Residents per Day",
  isCcrc: "Continuing Care Retirement Community",
  specialFocusStatus: "Special Focus Status",
  abuseIcon: "Abuse Icon",
  overallRating: "Overall Rating",
  healthInspectionRating: "Health Inspection Rating",
  qmRating: "QM Rating",
  staffingRating: "Staffing Rating",
  reportedTotalNurseStaffingHrsPerResidentDay: "Reported Total Nurse Staffing Hours per Resident per Day",
  totalNumberHealthDeficiencies_cycle1: "Rating Cycle 1 Total Number of Health Deficiencies",
  numberOfFines: "Number of Fines",
  totalFinesDollars: "Total Amount of Fines in Dollars",
  numberOfPaymentDenials: "Number of Payment Denials",
  totalNumberOfPenalties: "Total Number of Penalties",
  latitude: "Latitude",
  longitude: "Longitude",
  processingDate: "Processing Date",
};

// CMS spells some county names differently than IDPH/the taxonomy docs do
// (e.g. "Du Page" and "Mc Henry" with a space, vs "DuPage"/"McHenry"
// everywhere else) -- normalize by stripping whitespace before comparing so
// a naive exact-string match doesn't silently return zero rows for those
// counties.
function normalizeCountyName(name) {
  return (name || "").replace(/\s+/g, "").toLowerCase();
}

export function parseCmsProviderInfo(csvPath, { state, county }) {
  const text = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(text);
  const filtered = rows.filter(
    (r) =>
      r["State"] === state &&
      (!county || normalizeCountyName(r["County/Parish"]) === normalizeCountyName(county)),
  );
  return filtered.map((r) => {
    const out = {};
    for (const [key, col] of Object.entries(FIELD_MAP)) out[key] = r[col] || null;
    return out;
  });
}

const isMain =
  path.resolve(process.argv[1] ?? "") ===
  path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (isMain) {
  const [inputPath, outputPath, state = "IL", county = "Cook"] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    console.error("Usage: node scripts/parse-cms.mjs <input.csv> <output.json> [state] [county]");
    process.exit(1);
  }
  const records = parseCmsProviderInfo(path.resolve(inputPath), { state, county });
  fs.writeFileSync(path.resolve(outputPath), JSON.stringify(records, null, 2));
  console.log(`Parsed ${records.length} records (${state}${county ? "/" + county : ""}) -> ${outputPath}`);
}
