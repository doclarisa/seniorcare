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

// Maps the free-text CARE_LEVEL_FILTERS values (lib/facility-options.ts,
// used against the old Facility.careLevels string array) to the fixed
// Listing.categories vocabulary. "independent living" and "respite" have no
// government-fed source and so no Listing equivalent -- searching for
// either only returns Facility results, which is accurate rather than a
// gap to paper over.
export const CARE_LEVEL_TO_CATEGORY: Record<string, string> = {
  "assisted living": "assisted-living",
  "memory care": "memory-care",
  supportive: "supportive-living",
  "skilled nursing": "nursing-homes",
};

export interface ListingSearchFilters {
  county?: string; // proper-cased, e.g. "Cook"
  careLevel?: string; // a CARE_LEVEL_FILTERS value
  medicaidOnly?: boolean;
  priceBand?: string; // see note below -- Listings have no price data
}

export async function searchListings(filters: ListingSearchFilters = {}): Promise<Listing[]> {
  // Listings carry no price data (none of IDPH/HFS/CMS report it), so a
  // price-band filter can't be honestly applied to them -- exclude all
  // Listings rather than guess, mirroring how Facilities without a
  // priceMin are already excluded by the same filter.
  if (filters.priceBand) return [];
  if (filters.careLevel && !CARE_LEVEL_TO_CATEGORY[filters.careLevel]) return [];

  return prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      ...(filters.county && { county: filters.county }),
      ...(filters.careLevel && { categories: { has: CARE_LEVEL_TO_CATEGORY[filters.careLevel] } }),
      ...(filters.medicaidOnly && { categories: { has: "supportive-living" } }),
    },
    orderBy: { name: "asc" },
  });
}

// --- City / suburb pages ----------------------------------------------------
//
// Unlike the 7 counties (a fixed, known list), city names are whatever
// IDPH/HFS/CMS/the hand-curated dataset happen to contain -- there's no
// enum to validate against, so city pages are resolved by slugifying every
// distinct city in the data and matching against that, rather than a
// hardcoded list. Chicago itself is just the city with the most listings;
// it gets no special routing here (Chicago *neighborhood* pages are a
// separate, not-yet-built feature -- see the routing note in
// chicago-senior-care-taxonomy.md §4 -- because none of the three
// government sources record which neighborhood a Chicago address is in,
// only "Chicago").

export function citySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

async function distinctPublishedCities(): Promise<string[]> {
  const [listingCities, facilityCities] = await Promise.all([
    prisma.listing.findMany({ where: { status: "PUBLISHED" }, select: { city: true }, distinct: ["city"] }),
    prisma.facility.findMany({ where: { status: "PUBLISHED" }, select: { city: true }, distinct: ["city"] }),
  ]);
  const set = new Set<string>();
  for (const { city } of [...listingCities, ...facilityCities]) {
    if (city) set.add(city);
  }
  return [...set];
}

export async function cityNameFromSlug(slug: string): Promise<string | null> {
  const cities = await distinctPublishedCities();
  return cities.find((c) => citySlug(c) === slug) ?? null;
}

export async function listListingsByCareTypeAndCity(careType: string, city: string): Promise<Listing[]> {
  return prisma.listing.findMany({
    where: { status: "PUBLISHED", categories: { has: careType }, city: { equals: city, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
}

export async function countListingsByCareTypeAndCity(careType: string, city: string): Promise<number> {
  return prisma.listing.count({
    where: { status: "PUBLISHED", categories: { has: careType }, city: { equals: city, mode: "insensitive" } },
  });
}

// For a given care type, every city (from either source) with at least
// MIN_LISTINGS_FOR_LANDING_PAGE combined Facility+Listing entries -- i.e.
// exactly the set of city pages that won't 404 under the threshold rule.
export async function listCitiesWithCareType(
  careType: string,
): Promise<{ city: string; slug: string; count: number }[]> {
  const cities = await distinctPublishedCities();
  const counts = await Promise.all(
    cities.map(async (city) => {
      const listingCount = await countListingsByCareTypeAndCity(careType, city);
      let facilityCount = 0;
      if (careType === "assisted-living") {
        facilityCount = await prisma.facility.count({
          where: { status: "PUBLISHED", city: { equals: city, mode: "insensitive" } },
        });
      }
      return { city, slug: citySlug(city), count: listingCount + facilityCount };
    }),
  );
  return counts
    .filter((c) => c.count >= MIN_LISTINGS_FOR_LANDING_PAGE)
    .sort((a, b) => b.count - a.count);
}
