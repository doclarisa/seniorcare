import { prisma } from "@/lib/prisma";
import type { Listing } from "@/lib/generated/prisma/client";

export const CARE_TYPE_LABELS: Record<string, string> = {
  "assisted-living": "Assisted Living",
  "memory-care": "Memory Care",
  "supportive-living": "Supportive Living",
  "nursing-homes": "Nursing Home",
  "independent-living": "Independent Living",
  "continuing-care": "Continuing Care",
};

export const COUNTY_SLUGS = [
  "cook-county",
  "dupage-county",
  "lake-county",
  "will-county",
  "kane-county",
  "mchenry-county",
  "kendall-county",
];

// Threshold rule (taxonomy §3): don't generate a {care-type} x {geo} page
// below this many real listings -- avoids thin/doorway pages.
export const MIN_LISTINGS_FOR_LANDING_PAGE = 3;

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return prisma.listing.findUnique({ where: { slug, status: "PUBLISHED" } });
}

export async function listListingsByCareTypeAndCounty(
  careType: string,
  countySlug: string,
): Promise<Listing[]> {
  const county = countySlug.replace(/-county$/i, "");
  return prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      categories: { has: careType },
      county: { equals: county, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
  });
}
