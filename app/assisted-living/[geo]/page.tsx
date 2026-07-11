import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { FacilityCard } from "@/components/FacilityCard";
import { ListingCard } from "@/components/ListingCard";
import { listFacilities } from "@/lib/facilities";
import {
  COUNTY_SLUGS,
  MIN_LISTINGS_FOR_LANDING_PAGE,
  cityNameFromSlug,
  countyNameFromSlug,
  listCitiesWithCareType,
  listListingsByCareTypeAndCity,
  listListingsByCareTypeAndCounty,
} from "@/lib/listings";
import type { Facility, Listing } from "@/lib/generated/prisma/client";

// `geo` is either a county slug ("cook-county", grandfathered -- always
// renders, even at zero results, since this URL pattern predates the
// Listing pipeline) or a city slug ("naperville", new -- subject to the
// usual >=3-listing threshold rule like every other new geo page).
async function resolveGeo(geoSlug: string) {
  if (COUNTY_SLUGS.includes(geoSlug)) {
    return { kind: "county" as const, name: countyNameFromSlug(geoSlug)! };
  }
  const cityName = await cityNameFromSlug(geoSlug);
  if (cityName) return { kind: "city" as const, name: cityName };
  return null;
}

export async function generateStaticParams() {
  const countyParams = COUNTY_SLUGS.map((geo) => ({ geo }));
  const cities = await listCitiesWithCareType("assisted-living");
  return [...countyParams, ...cities.map((c) => ({ geo: c.slug }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ geo: string }>;
}): Promise<Metadata> {
  const { geo } = await params;
  const resolved = await resolveGeo(geo);
  if (!resolved) return {};
  const place = resolved.kind === "county" ? `${resolved.name} County` : resolved.name;
  return {
    title: `Assisted Living in ${place}, IL`,
    description: `Compare assisted living, memory care, and supportive living communities in ${place}, Illinois.`,
  };
}

type MergedEntry =
  | { type: "facility"; sortName: string; isFeatured: boolean; data: Facility }
  | { type: "listing"; sortName: string; isFeatured: boolean; data: Listing };

export default async function AssistedLivingGeoPage({
  params,
}: {
  params: Promise<{ geo: string }>;
}) {
  const { geo } = await params;
  const resolved = await resolveGeo(geo);
  if (!resolved) notFound();

  // Two sources, deliberately merged rather than shown separately: the
  // original hand-curated Facility dataset (richer -- price, reviews,
  // photos) and the new government-verified Listing dataset (IDPH/HFS/CMS).
  // A small number of Listings duplicate an existing Facility (same
  // physical building, confirmed by exact address match and manually
  // reviewed -- see scripts/unpublish-duplicates.ts); those were already
  // unpublished at the data layer, so no de-dup logic is needed here: every
  // PUBLISHED Listing that reaches this query is a genuinely new building.
  const [facilities, listings] =
    resolved.kind === "county"
      ? await Promise.all([
          listFacilities({ county: resolved.name }),
          listListingsByCareTypeAndCounty("assisted-living", geo),
        ])
      : await Promise.all([
          listFacilities({ city: resolved.name }),
          listListingsByCareTypeAndCity("assisted-living", resolved.name),
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

  // County pages are grandfathered (render even at zero -- see file note);
  // city pages are new, so the usual threshold rule applies.
  if (resolved.kind === "city" && total < MIN_LISTINGS_FOR_LANDING_PAGE) notFound();

  const place = resolved.kind === "county" ? `${resolved.name} County` : resolved.name;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">Assisted Living & Memory Care in {place}, IL</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {total} {total === 1 ? "community" : "communities"} in {place}, including assisted living,
        memory care, and Medicaid-eligible supportive living options -- combining our vetted
        directory with Illinois state licensing and federal inspection records.
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
        <p className="mt-10 text-center text-slate-500">No communities listed in {place} yet.</p>
      )}
    </Container>
  );
}
