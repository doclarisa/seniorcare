import "dotenv/config";
import { prisma } from "../lib/prisma";

// One-off: flip a small, representative sample of Cook County Listings to
// PUBLISHED so the real (non-preview-mode) facility/landing page logic can
// be reviewed end-to-end before deciding whether to publish the rest.
const SLUGS = [
  "montgomery-place-chicago", // cross-source CCRC (IDPH+CMS): assisted-living + memory-care + nursing-homes
  "wellshire-morton-grove-morton-grove", // IDPH-only assisted-living
  "beth-anne-place-chicago", // HFS supportive-living, has a real website
  "addolorata-villa-wheeling-2",
  "ahva-care-of-stickney-stickney",
  "alden-des-plaines-rehab-hc-des-plaines",
  "alden-estates-of-barrington-barrington",
  "alden-estates-of-evanston-evanston",
];

async function main() {
  const result = await prisma.listing.updateMany({
    where: { slug: { in: SLUGS } },
    data: { status: "PUBLISHED" },
  });
  console.log(`Published ${result.count} of ${SLUGS.length} requested listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
