import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { FacilityCard } from "@/components/FacilityCard";
import { ListingCard } from "@/components/ListingCard";
import { listFacilities } from "@/lib/facilities";
import { COUNTY_SLUGS, countyNameFromSlug, listListingsByCareTypeAndCounty } from "@/lib/listings";
import type { Facility, Listing } from "@/lib/generated/prisma/client";

function countySlugFromParam(slug: string): string | null {
  return COUNTY_SLUGS.includes(slug) ? slug : null;
}

export function generateStaticParams() {
  return COUNTY_SLUGS.map((county) => ({ county }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county: countySlug } = await params;
  const county = countyNameFromSlug(countySlug);
  if (!county) return {};
  return {
    title: `Assisted Living in ${county} County, IL`,
    description: `Compare assisted living, memory care, and supportive living communities in ${county} County, Illinois.`,
  };
}

type MergedEntry =
  | { type: "facility"; sortName: string; isFeatured: boolean; data: Facility }
  | { type: "listing"; sortName: string; isFeatured: boolean; data: Listing };

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county: countySlug } = await params;
  const validSlug = countySlugFromParam(countySlug);
  if (!validSlug) notFound();
  const county = countyNameFromSlug(validSlug)!;

  // Two sources, deliberately merged rather than shown separately: the
  // original hand-curated Facility dataset (richer -- price, reviews,
  // photos) and the new government-verified Listing dataset (IDPH/HFS/CMS).
  // A small number of Listings duplicate an existing Facility (same
  // physical building, confirmed by exact address match and manually
  // reviewed -- see scripts/unpublish-duplicates.ts); those were already
  // unpublished at the data layer, so no de-dup logic is needed here: every
  // PUBLISHED Listing that reaches this query is a genuinely new building.
  const [facilities, listings] = await Promise.all([
    listFacilities({ county }),
    listListingsByCareTypeAndCounty("assisted-living", validSlug),
  ]);

  const merged: MergedEntry[] = [
    ...facilities.map((f): MergedEntry => ({
      type: "facility",
      sortName: f.name,
      isFeatured: f.tier === "FEATURED",
      data: f,
    })),
    ...listings.map((l): MergedEntry => ({
      type: "listing",
      sortName: l.name,
      isFeatured: false,
      data: l,
    })),
  ].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.sortName.localeCompare(b.sortName);
  });

  const total = merged.length;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Assisted Living & Memory Care in {county} County, IL
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {total} {total === 1 ? "community" : "communities"} in {county} County, including assisted
        living, memory care, and Medicaid-eligible supportive living options -- combining our
        vetted directory with Illinois state licensing and federal inspection records.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((entry) =>
          entry.type === "facility" ? (
            <FacilityCard key={`f-${entry.data.id}`} facility={entry.data} />
          ) : (
            <ListingCard key={`l-${entry.data.id}`} listing={entry.data} />
          ),
        )}
      </div>

      {total === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No communities listed in {county} County yet.
        </p>
      )}
    </Container>
  );
}
