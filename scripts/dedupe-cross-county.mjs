import fs from "node:fs";

// Per-county builds dedup source rows by addressKey *within* that county,
// but a physical building can get filed under different counties by
// different agencies -- e.g. Orland Park genuinely straddles Cook/Will, and
// Smith Crossing's CMS row was tagged Cook while its IDPH row was tagged
// Will for the identical address. addressKey is globally unique in the
// Listing table (one row per physical building, full stop), so a collision
// across county files must be merged before upsert, not just within one.
//
// Canonical county on a collision: whichever county file was processed
// first in FILES order wins (kept in place, not moved) -- minimizes
// disruption to already-published listings rather than picking a "more
// correct" county, since neither source is more authoritative than the
// other about which side of a border a building sits on.

const FILES = ["cook", "dupage", "lake", "will", "kane", "mchenry", "kendall"];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function main() {
  const byFile = new Map();
  for (const f of FILES) {
    byFile.set(f, readJson(`data/processed/${f}-listings.json`));
  }

  const seenByAddressKey = new Map(); // addressKey -> { file, listing }
  let mergeCount = 0;

  for (const f of FILES) {
    const listings = byFile.get(f);
    const kept = [];
    for (const listing of listings) {
      const existing = seenByAddressKey.get(listing.addressKey);
      if (!existing) {
        seenByAddressKey.set(listing.addressKey, { file: f, listing });
        kept.push(listing);
        continue;
      }

      // Collision: merge this listing into the first-seen one in place,
      // drop this duplicate from its own file.
      mergeCount++;
      const canonical = existing.listing;
      console.log(
        `Merging "${listing.name}" (${listing.county}, ${f}) into "${canonical.name}" (${canonical.county}, ${existing.file}) -- same addressKey "${listing.addressKey}"`,
      );
      canonical.categories = [...new Set([...canonical.categories, ...listing.categories])];
      canonical.enriched = { ...listing.enriched, ...canonical.enriched };
      canonical.enriched.dataSources = [
        ...new Set([...(canonical.enriched.dataSources ?? []), ...(listing.enriched.dataSources ?? [])]),
      ];
      canonical.phone = canonical.phone ?? listing.phone;
      canonical.website = canonical.website ?? listing.website;
      // listing itself is dropped (not pushed to `kept`)
    }
    byFile.set(f, kept);
  }

  for (const f of FILES) {
    fs.writeFileSync(`data/processed/${f}-listings.json`, JSON.stringify(byFile.get(f), null, 2));
  }

  console.log(`Done. ${mergeCount} cross-county collision(s) merged.`);
}

main();
