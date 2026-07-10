import fs from "node:fs";
import path from "node:path";
import { addressKey } from "./normalize-address.mjs";
import { geocodeAddress, loadCache, saveCache } from "./census-geocode.mjs";
import { summarizeIdphSurveys, summarizeCms, combineSummaries } from "./inspection-summary.mjs";
import { slugify } from "../lib/slug.ts";

const TODAY = new Date().toISOString().slice(0, 10);

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

// --- 1. load + normalize each source into a common "source row" shape ----

function loadIdphRows() {
  const all = readJson("data/raw/idph/assisted-living-il.json");
  const cookActive = all.filter(
    (r) => (r.county || "").trim().toLowerCase() === "cook" && r.status === "Active",
  );
  return cookActive.map((r) => {
    const m = r.cityStateZip.match(/^(.+),\s*Illinois\s+(\d{5})$/);
    const city = m ? m[1].trim() : null;
    const zip = m ? m[2] : null;
    const hasMemoryCare = r.alzheimersSpecialCareProgram === "Yes" || !!r.alzheimersUnits;
    return {
      source: "IDPH",
      name: r.name,
      street: r.street,
      city,
      zip,
      county: "Cook",
      phone: r.phone,
      website: null,
      categories: hasMemoryCare ? ["assisted-living", "memory-care"] : ["assisted-living"],
      raw: r,
    };
  });
}

function splitHfsAddress(rawAddress) {
  if (!rawAddress) return { street: null, city: null };
  // rawAddress is "[optional sub-name, ]Street, City, IL Zip" -- formatting
  // is inconsistent (see parse-hfs.mjs), so anchor on the first segment
  // that looks like a real street (starts with a number) rather than
  // assuming the street is always the first comma-separated piece. This is
  // what catches "Friedman Place, Maplewood Housing for the Visually
  // Impaired, 5527 North Maplewood, ..." -- the first segment is a
  // descriptive sub-name, not the address.
  const segments = rawAddress.split(",").map((s) => s.trim());
  const streetIdx = segments.findIndex((s) => /^\d/.test(s));
  if (streetIdx === -1) return { street: segments[0] ?? null, city: null };
  const street = segments[streetIdx];
  const cityCandidate = segments[streetIdx + 1];
  const city = cityCandidate && !/^IL\b/.test(cityCandidate) ? cityCandidate : null;
  return { street, city };
}

function loadHfsRows() {
  const rows = readJson("data/raw/hfs/cook.json");
  return rows.map((r) => {
    const { street, city } = splitHfsAddress(r.rawAddress);
    return {
      source: "HFS",
      name: r.name,
      street,
      city,
      zip: r.zip,
      county: "Cook",
      phone: r.phone,
      website: r.website,
      categories: r.dementiaCare ? ["supportive-living", "memory-care"] : ["supportive-living"],
      raw: r,
    };
  });
}

function loadCmsRows() {
  const rows = readJson("data/raw/cms/cook.json");
  return rows.map((r) => ({
    source: "CMS",
    name: r.name,
    street: r.address,
    city: r.city ? r.city.charAt(0) + r.city.slice(1).toLowerCase() : null,
    zip: r.zip,
    county: "Cook",
    phone: r.phone,
    website: null,
    categories: ["nursing-homes"],
    lat: r.latitude ? Number(r.latitude) : null,
    lng: r.longitude ? Number(r.longitude) : null,
    raw: r,
  }));
}

// --- 2. group by addressKey ------------------------------------------------

// IDPH tags some names with a redundant license-type suffix distinguishing
// their Assisted Living license from a same-campus skilled-nursing license
// under the same parent org (e.g. "SMITH VILLAGE (Assisted Living)"). Once
// merged into one cross-source Listing, the categories array already
// conveys that, so the suffix is just noise. Only strip this exact,
// well-understood pattern -- NOT other parenthetical suffixes like "(THE)"
// or "(MC)"/"(AL)", which sometimes distinguish genuinely separate,
// differently-addressed buildings on the same campus (e.g. Moorings of
// Arlington Heights has two distinct street addresses for its AL vs MC
// buildings) and must not be altered.
function stripLicenseTypeSuffix(name) {
  return name.replace(/\s*\((Assisted Living|Assisted Lvg)\)\s*$/i, "").trim();
}

function bestName(rows) {
  // Prefer a name that isn't ALL CAPS (reads better on a family-facing
  // site); otherwise take the first source's name. Never alter the string
  // itself beyond the narrow license-suffix strip above -- only choose
  // among the literal source values.
  const mixedCase = rows.find((r) => r.name !== r.name.toUpperCase());
  const name = (mixedCase ?? rows[0]).name;
  return stripLicenseTypeSuffix(name);
}

function firstBy(rows, sources, field) {
  for (const src of sources) {
    const row = rows.find((r) => r.source === src && r[field]);
    if (row) return row[field];
  }
  return null;
}

async function main() {
  const rows = [...loadIdphRows(), ...loadHfsRows(), ...loadCmsRows()];
  console.log(`Loaded ${rows.length} source rows (IDPH ${loadIdphRows().length}, HFS ${loadHfsRows().length}, CMS ${loadCmsRows().length})`);

  const groups = new Map();
  for (const row of rows) {
    const key = addressKey(row.street, row.zip);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  console.log(`${groups.size} distinct physical addresses after dedup (from ${rows.length} source rows).`);

  const geocodeCache = loadCache();
  const listings = [];
  const usedSlugs = new Set();

  let i = 0;
  for (const [key, groupRows] of groups) {
    i++;
    const name = bestName(groupRows);
    const street = firstBy(groupRows, ["IDPH", "CMS", "HFS"], "street");
    const city = firstBy(groupRows, ["IDPH", "CMS", "HFS"], "city");
    const zip = firstBy(groupRows, ["IDPH", "CMS", "HFS"], "zip");
    const phone = firstBy(groupRows, ["IDPH", "HFS", "CMS"], "phone");
    const website = firstBy(groupRows, ["HFS"], "website");
    const categories = [...new Set(groupRows.flatMap((r) => r.categories))];

    const idphRow = groupRows.find((r) => r.source === "IDPH");
    const hfsRow = groupRows.find((r) => r.source === "HFS");
    const cmsRow = groupRows.find((r) => r.source === "CMS");
    const dataSources = [...new Set(groupRows.map((r) => r.source))];

    // geocode: prefer CMS's government-supplied coordinates; else ask Census
    let lat = cmsRow?.lat ?? null;
    let lng = cmsRow?.lng ?? null;
    if (lat == null || lng == null) {
      const fullAddress = `${street}, ${city ?? ""}, IL ${zip ?? ""}`.replace(/\s+/g, " ").trim();
      process.stdout.write(`  [${i}/${groups.size}] geocoding "${fullAddress}"... `);
      const geo = await geocodeAddress(fullAddress, { cache: geocodeCache, delayMs: 300 });
      console.log(geo ? `${geo.lat}, ${geo.lng}` : "NO MATCH");
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      }
    }

    const inspectionSummary = combineSummaries([
      idphRow ? summarizeIdphSurveys(idphRow.raw.surveys) : null,
      cmsRow ? summarizeCms(cmsRow.raw) : null,
    ]);

    const enriched = {
      ...(idphRow && {
        licenseNumber: idphRow.raw.facilityId,
        licenseStatus: idphRow.raw.status,
        units:
          [idphRow.raw.permanentUnits, idphRow.raw.floatingUnits, idphRow.raw.independentUnits]
            .filter(Boolean)
            .map(Number)
            .reduce((a, b) => a + b, 0) || null,
        hasAlzheimersUnit: idphRow.raw.alzheimersSpecialCareProgram === "Yes",
        alzheimersUnits: idphRow.raw.alzheimersUnits ? Number(idphRow.raw.alzheimersUnits) : null,
      }),
      ...(hfsRow && {
        supportiveLiving: true,
        medicaidAccepted: true,
        operator: null,
        populationServed: hfsRow.raw.populationServedNote ?? (hfsRow.raw.dementiaCare ? "65+" : null),
      }),
      ...(cmsRow && {
        ccn: cmsRow.raw.ccn,
        certifiedBeds: cmsRow.raw.certifiedBeds ? Number(cmsRow.raw.certifiedBeds) : null,
        ratings: {
          overall: cmsRow.raw.overallRating ? Number(cmsRow.raw.overallRating) : null,
          healthInspection: cmsRow.raw.healthInspectionRating ? Number(cmsRow.raw.healthInspectionRating) : null,
          staffing: cmsRow.raw.staffingRating ? Number(cmsRow.raw.staffingRating) : null,
          quality: cmsRow.raw.qmRating ? Number(cmsRow.raw.qmRating) : null,
        },
        deficiencyCount: cmsRow.raw.totalNumberHealthDeficiencies_cycle1
          ? Number(cmsRow.raw.totalNumberHealthDeficiencies_cycle1)
          : null,
        ownershipType: cmsRow.raw.ownershipType,
        isCcrc: cmsRow.raw.isCcrc === "Y",
      }),
      inspectionSummary,
      dataSources,
      lastVerified: TODAY,
    };

    let slug = slugify(`${name}-${city ?? ""}`);
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = slugify(`${name}-${city ?? ""}-${n}`);
      n++;
    }
    usedSlugs.add(slug);

    listings.push({
      name,
      slug,
      address: street,
      addressKey: key,
      city,
      county: "Cook",
      region: null,
      zip,
      lat,
      lng,
      phone,
      website,
      email: null,
      categories,
      status: "PENDING",
      enriched,
      _sources: dataSources,
      _sourceRowCount: groupRows.length,
    });
  }

  saveCache(geocodeCache);

  fs.mkdirSync("data/processed", { recursive: true });
  fs.writeFileSync("data/processed/cook-county-listings.json", JSON.stringify(listings, null, 2));

  const noGeo = listings.filter((l) => l.lat == null);
  const byCategory = {};
  listings.forEach((l) => l.categories.forEach((c) => (byCategory[c] = (byCategory[c] || 0) + 1)));

  console.log(`\nWrote ${listings.length} merged Cook County listings -> data/processed/cook-county-listings.json`);
  console.log(`Category counts:`, byCategory);
  console.log(`Listings missing lat/lng (geocode failed): ${noGeo.length}`);
  if (noGeo.length) noGeo.forEach((l) => console.log(`  - ${l.name} (${l.address}, ${l.city} ${l.zip})`));
}

main();
