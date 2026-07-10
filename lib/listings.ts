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

// Proper-cased county names as stored in Facility.county / Listing.county
// (naive slug capitalization would render "DuPage" as "Dupage" and
// "McHenry" as "Mchenry").
export const COUNTY_NAMES: Record<string, string> = {
  "cook-county": "Cook",
  "dupage-county": "DuPage",
  "lake-county": "Lake",
  "will-county": "Will",
  "kane-county": "Kane",
  "mchenry-county": "McHenry",
  "kendall-county": "Kendall",
};

export const COUNTY_SLUGS = Object.keys(COUNTY_NAMES);

export function countyNameFromSlug(countySlug: string): string | null {
  return COUNTY_NAMES[countySlug] ?? null;
}

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

export async function countListingsByCareTypeAndCounty(
  careType: string,
  countyProperName: string,
): Promise<number> {
  return prisma.listing.count({
    where: { status: "PUBLISHED", categories: { has: careType }, county: countyProperName },
  });
}
