import "dotenv/config";
import { prisma } from "../lib/prisma";
import { parseFacilities } from "./parse-facilities";

async function main() {
  const facilities = parseFacilities();
  console.log(`Parsed ${facilities.length} facilities from source.`);

  for (const f of facilities) {
    const { reviews, ...content } = f;

    const facility = await prisma.facility.upsert({
      where: { slug: f.slug },
      update: {
        name: content.name,
        address: content.address,
        city: content.city,
        zip: content.zip,
        county: content.county,
        phone: content.phone,
        website: content.website,
        email: content.email,
        careLevels: content.careLevels,
        license: content.license,
        licenseVerified: content.licenseVerified,
        capacity: content.capacity,
        capacityNote: content.capacityNote,
        priceMin: content.priceMin,
        priceNote: content.priceNote,
        priceEstimate: content.priceEstimate,
        medicaidAccepted: content.medicaidAccepted,
        roomTypes: content.roomTypes,
        amenities: content.amenities,
        operator: content.operator,
        yearOpened: content.yearOpened,
        summary: content.summary,
        flags: content.flags,
        qualityTier: content.qualityTier,
        // tier, verified, status, photos deliberately untouched on re-import
      },
      create: {
        name: content.name,
        slug: content.slug,
        address: content.address,
        city: content.city,
        zip: content.zip,
        county: content.county,
        phone: content.phone,
        website: content.website,
        email: content.email,
        careLevels: content.careLevels,
        license: content.license,
        licenseVerified: content.licenseVerified,
        capacity: content.capacity,
        capacityNote: content.capacityNote,
        priceMin: content.priceMin,
        priceNote: content.priceNote,
        priceEstimate: content.priceEstimate,
        medicaidAccepted: content.medicaidAccepted,
        roomTypes: content.roomTypes,
        amenities: content.amenities,
        operator: content.operator,
        yearOpened: content.yearOpened,
        summary: content.summary,
        flags: content.flags,
        qualityTier: content.qualityTier,
      },
    });

    await prisma.review.deleteMany({ where: { facilityId: facility.id } });
    if (reviews.length) {
      await prisma.review.createMany({
        data: reviews.map((r) => ({
          facilityId: facility.id,
          platform: r.platform,
          score: r.score,
          count: r.count,
          note: r.note,
        })),
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
