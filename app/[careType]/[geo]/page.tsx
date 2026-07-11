import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ListingCard } from "@/components/ListingCard";
import {
  CARE_TYPE_LABELS,
  COUNTY_SLUGS,
  MIN_LISTINGS_FOR_LANDING_PAGE,
  cityNameFromSlug,
  countyNameFromSlug,
  listCitiesWithCareType,
  listListingsByCareTypeAndCity,
  listListingsByCareTypeAndCounty,
} from "@/lib/listings";

// "assisted-living" is intentionally excluded: that care type is served by
// the existing app/assisted-living/[geo] route (already live/indexed at the
// county level -- see chicago-senior-care-taxonomy.md's migration-safety
// note). This catch-all covers the *new* government-fed care types only, so
// it never competes with that route for the same URL.
const CARE_TYPES = ["memory-care", "supportive-living", "nursing-homes"] as const;

// `geo` is either one of the 7 fixed county slugs ("cook-county") or a city
// slug derived from real data ("naperville") -- see lib/listings.ts's note
// on why cities aren't a fixed enum the way counties are. Chicago
// *neighborhood* pages (taxonomy §4, /{care-type}/chicago/{hood}) are a
// separate, not-yet-built feature; Chicago itself is just the city with the
// most listings and is served here like any other city slug.
async function resolveGeo(geoSlug: string) {
  if (COUNTY_SLUGS.includes(geoSlug)) {
    return { kind: "county" as const, name: countyNameFromSlug(geoSlug)! };
  }
  const cityName = await cityNameFromSlug(geoSlug);
  if (cityName) return { kind: "city" as const, name: cityName };
  return null;
}

export async function generateStaticParams() {
  const countyParams = CARE_TYPES.flatMap((careType) => COUNTY_SLUGS.map((geo) => ({ careType, geo })));
  const cityParams = (
    await Promise.all(
      CARE_TYPES.map(async (careType) => {
        const cities = await listCitiesWithCareType(careType);
        return cities.map((c) => ({ careType, geo: c.slug }));
      }),
    )
  ).flat();
  return [...countyParams, ...cityParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ careType: string; geo: string }>;
}): Promise<Metadata> {
  const { careType, geo } = await params;
  if (!CARE_TYPES.includes(careType as (typeof CARE_TYPES)[number])) return {};
  const resolved = await resolveGeo(geo);
  if (!resolved) return {};
  const label = CARE_TYPE_LABELS[careType] ?? careType;
  const place = resolved.kind === "county" ? `${resolved.name} County` : resolved.name;
  return {
    title: `${label} in ${place}, IL`,
    description: `Compare ${label.toLowerCase()} communities in ${place}, Illinois, with IDPH/CMS inspection records.`,
  };
}

export default async function CareTypeGeoPage({
  params,
}: {
  params: Promise<{ careType: string; geo: string }>;
}) {
  const { careType, geo } = await params;
  if (!CARE_TYPES.includes(careType as (typeof CARE_TYPES)[number])) notFound();

  const resolved = await resolveGeo(geo);
  if (!resolved) notFound();

  const listings =
    resolved.kind === "county"
      ? await listListingsByCareTypeAndCounty(careType, geo)
      : await listListingsByCareTypeAndCity(careType, resolved.name);

  // Threshold rule (taxonomy §3): below this, roll up to the parent page --
  // don't publish a thin/doorway page.
  if (listings.length < MIN_LISTINGS_FOR_LANDING_PAGE) notFound();

  const label = CARE_TYPE_LABELS[careType] ?? careType;
  const place = resolved.kind === "county" ? `${resolved.name} County` : resolved.name;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        {label} in {place}, IL
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {listings.length} {label.toLowerCase()} {listings.length === 1 ? "community" : "communities"} in{" "}
        {place}, sourced from Illinois state licensing and federal inspection records.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </Container>
  );
}
