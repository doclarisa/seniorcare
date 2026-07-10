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

const FILES = ["dupage", "lake", "will", "kane", "mchenry", "kendall"];

async function main() {
  let created = 0;
  let updated = 0;

  for (const fileSlug of FILES) {
    const listings: MergedListing[] = JSON.parse(
      fs.readFileSync(`data/processed/${fileSlug}-listings.json`, "utf-8"),
    );
    console.log(`Upserting ${listings.length} listings for ${fileSlug}...`);

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
          // status deliberately untouched on re-import
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
          status: "PUBLISHED",
          enriched: l.enriched as any,
        },
      });

      if (existing) updated++;
      else created++;
    }
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
