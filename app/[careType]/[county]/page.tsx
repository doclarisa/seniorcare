import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ListingCard } from "@/components/ListingCard";
import {
  CARE_TYPE_LABELS,
  COUNTY_SLUGS,
  MIN_LISTINGS_FOR_LANDING_PAGE,
  countyNameFromSlug,
  listListingsByCareTypeAndCounty,
} from "@/lib/listings";

// "assisted-living" is intentionally excluded: that care type is served by
// the existing app/assisted-living/[county] route (already live/indexed --
// see chicago-senior-care-taxonomy.md's migration-safety note). This
// catch-all covers the *new* government-fed care types only, so it never
// competes with that route for the same URL.
const CARE_TYPES = ["memory-care", "supportive-living", "nursing-homes"] as const;

export function generateStaticParams() {
  return CARE_TYPES.flatMap((careType) => COUNTY_SLUGS.map((county) => ({ careType, county })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ careType: string; county: string }>;
}): Promise<Metadata> {
  const { careType, county } = await params;
  if (!CARE_TYPES.includes(careType as (typeof CARE_TYPES)[number])) return {};
  const label = CARE_TYPE_LABELS[careType] ?? careType;
  return {
    title: `${label} in ${countyNameFromSlug(county)} County, IL`,
    description: `Compare ${label.toLowerCase()} communities in ${countyNameFromSlug(county)} County, Illinois, with IDPH/CMS inspection records.`,
  };
}

export default async function CareTypeCountyPage({
  params,
}: {
  params: Promise<{ careType: string; county: string }>;
}) {
  const { careType, county } = await params;
  if (!CARE_TYPES.includes(careType as (typeof CARE_TYPES)[number])) notFound();
  if (!COUNTY_SLUGS.includes(county)) notFound();

  const listings = await listListingsByCareTypeAndCounty(careType, county);

  // Threshold rule (taxonomy §3): below this, roll up to the county's
  // parent -- don't publish a thin/doorway page.
  if (listings.length < MIN_LISTINGS_FOR_LANDING_PAGE) notFound();

  const label = CARE_TYPE_LABELS[careType] ?? careType;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        {label} in {countyNameFromSlug(county)} County, IL
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {listings.length} {label.toLowerCase()} {listings.length === 1 ? "community" : "communities"} in{" "}
        {countyNameFromSlug(county)} County, sourced from Illinois state licensing and federal inspection
        records.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </Container>
  );
}
