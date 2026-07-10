import { prisma } from "@/lib/prisma";
import type { Facility, Review } from "@/lib/generated/prisma/client";
import { CARE_LEVEL_FILTERS, COUNTIES, PRICE_BANDS } from "@/lib/facility-options";

export type FacilityWithReviews = Facility & { reviews: Review[] };

export { COUNTIES, CARE_LEVEL_FILTERS, PRICE_BANDS };

export interface FacilityFilters {
  county?: string;
  careLevel?: string;
  medicaidOnly?: boolean;
  priceBand?: string;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export async function listFacilities(filters: FacilityFilters = {}): Promise<Facility[]> {
  const all = await prisma.facility.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { name: "asc" },
  });

  const band = PRICE_BANDS.find((b) => b.value === filters.priceBand);

  const filtered = all.filter((f) => {
    if (filters.county && f.county !== filters.county) return false;

    if (filters.careLevel) {
      const levels = asStringArray(f.careLevels);
      const needle = filters.careLevel.toLowerCase();
      const match = levels.some((l) => l.toLowerCase().includes(needle));
      if (!match) return false;
    }

    if (filters.medicaidOnly && !f.medicaidAccepted) return false;

    if (band) {
      if (f.priceMin == null) return false;
      if ("min" in band && band.min != null && f.priceMin < band.min) return false;
      if ("max" in band && band.max != null && f.priceMin > band.max) return false;
    }

    return true;
  });

  // Featured tier surfaces first (dormant at launch since every listing is
  // FREE, but this is how paid placement will show up once enabled).
  return filtered.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === "FEATURED" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function getFeaturedFacilities(limit = 3): Promise<Facility[]> {
  const featured = await prisma.facility.findMany({
    where: { status: "PUBLISHED", tier: "FEATURED" },
    orderBy: { name: "asc" },
    take: limit,
  });
  if (featured.length >= limit) return featured;

  // Dormant-tier fallback: while no facility has paid for Featured yet,
  // highlight Tier 1 (vetting) communities instead so the homepage isn't empty.
  const fallback = await prisma.facility.findMany({
    where: { status: "PUBLISHED", qualityTier: "Tier 1", tier: "FREE" },
    orderBy: { name: "asc" },
    take: limit - featured.length,
  });
  return [...featured, ...fallback];
}

export async function getFacilityBySlug(slug: string): Promise<FacilityWithReviews | null> {
  return prisma.facility.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { reviews: true },
  });
}

export async function getCountyFacilities(county: string): Promise<Facility[]> {
  return listFacilities({ county });
}

export async function countFacilities(county: string): Promise<number> {
  return prisma.facility.count({ where: { status: "PUBLISHED", county } });
}
