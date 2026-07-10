import "dotenv/config";
import fs from "node:fs";
import { prisma } from "../lib/prisma";

interface MergedListing {
  name: string;
  slug: string;
  address: string;
  addressKey: string;
  city: string | null;
  county: string;
  region: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  categories: string[];
  status: "PENDING" | "PUBLISHED";
  enriched: Record<string, unknown>;
}

async function main() {
  const listings: MergedListing[] = JSON.parse(
    fs.readFileSync("data/processed/cook-county-listings.json", "utf-8"),
  );
  console.log(`Upserting ${listings.length} Cook County listings...`);

  let created = 0;
  let updated = 0;

  for (const l of listings) {
    const existing = await prisma.listing.findUnique({ where: { slug: l.slug } });

    await prisma.listing.upsert({
      where: { slug: l.slug },
      update: {
        name: l.name,
        address: l.address,
        addressKey: l.addressKey,
        city: l.city ?? "",
        county: l.county,
        region: l.region,
        zip: l.zip,
        lat: l.lat,
        lng: l.lng,
        phone: l.phone,
        website: l.website,
        email: l.email,
        categories: l.categories,
        enriched: l.enriched as any,
        // status deliberately untouched on re-import -- never wipe a
        // manual PUBLISHED flip back to PENDING on a later pipeline run.
      },
      create: {
        name: l.name,
        slug: l.slug,
        address: l.address,
        addressKey: l.addressKey,
        city: l.city ?? "",
        county: l.county,
        region: l.region,
        zip: l.zip,
        lat: l.lat,
        lng: l.lng,
        phone: l.phone,
        website: l.website,
        email: l.email,
        categories: l.categories,
        status: "PENDING",
        enriched: l.enriched as any,
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(`Done. Created ${created}, updated ${updated}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
