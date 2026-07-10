import "dotenv/config";
import { prisma } from "../lib/prisma";

// One-off: these Listing records were confirmed (by exact address match,
// then manually reviewed to rule out false positives from a looser fuzzy
// name/zip pass) to represent the same physical building as an existing,
// already-published hand-curated Facility record. Per the import plan's
// "one building, one page" rule, the richer curated Facility page stays
// canonical and the Listing duplicate is unpublished rather than showing
// two pages for one building. Reversible: flips status back to PENDING,
// doesn't delete data.
const DUPLICATE_SLUGS = [
  "sunrise-of-lincoln-park-chicago",
  "terraces-at-the-clare-chicago",
  "terraces-at-the-clare-chicago-2",
  "clarendale-six-corners-chicago",
  "artis-senior-living-of-lakeview-chicago",
  "heritage-woods-of-chicago-chicago",
  "pearl-of-montclare-the-chicago",
  "smith-crossing-orland-park",
  "sheridan-at-park-ridge-park-ridge",
  "moraine-court-bridgeview",
  "churchview-supportive-living-chicago",
  "brighton-gardens-of-wheaton-wheaton",
  "sunrise-of-naperville-north-naperville",
  "arbor-terrace-naperville-naperville",
  "heritage-woods-of-plainfield-plainfield",
  "storypoint-libertyville-libertyville",
  "brookdale-hawthorn-lakes-al-vernon-hills",
  "belmont-village-buffalo-grove-buffalo-grove",
  "greenfields-of-geneva-geneva",
  "bickford-cottage-st-charles-st-charles",
  "sunrise-of-park-ridge-park-ridge",
  "brighton-gardens-of-st-charles-st-charles",
];

async function main() {
  const result = await prisma.listing.updateMany({
    where: { slug: { in: DUPLICATE_SLUGS } },
    data: { status: "PENDING" },
  });
  console.log(`Unpublished ${result.count} of ${DUPLICATE_SLUGS.length} duplicate listings.`);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
