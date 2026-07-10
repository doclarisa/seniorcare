import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import {
  CARE_TYPE_LABELS,
  COUNTY_SLUGS,
  MIN_LISTINGS_FOR_LANDING_PAGE,
  listListingsByCareTypeAndCounty,
} from "@/lib/listings";
import { telHref } from "@/lib/format";

// "assisted-living" is intentionally excluded: that care type is served by
// the existing app/assisted-living/[county] route (already live/indexed --
// see chicago-senior-care-taxonomy.md's migration-safety note). This
// catch-all covers the *new* government-fed care types only, so it never
// competes with that route for the same URL.
const CARE_TYPES = ["memory-care", "supportive-living", "nursing-homes"] as const;

function countyLabel(countySlug: string): string {
  const name = countySlug.replace(/-county$/i, "");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

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
    title: `${label} in ${countyLabel(county)} County, IL`,
    description: `Compare ${label.toLowerCase()} communities in ${countyLabel(county)} County, Illinois, with IDPH/CMS inspection records.`,
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
        {label} in {countyLabel(county)} County, IL
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {listings.length} {label.toLowerCase()} {listings.length === 1 ? "community" : "communities"} in{" "}
        {countyLabel(county)} County, sourced from Illinois state licensing and federal inspection
        records.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => {
          const phoneHref = telHref(l.phone);
          return (
            <div key={l.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <Link href={`/facility/${l.slug}`} className="text-lg font-bold text-slate-900 hover:text-teal-800">
                    {l.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    {l.city}, IL{l.zip ? ` ${l.zip}` : ""} &middot; {l.county} County
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.categories.map((c) => (
                    <span key={c} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {CARE_TYPE_LABELS[c] ?? c}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex gap-2 pt-2">
                  {phoneHref && (
                    <a
                      href={phoneHref}
                      className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-teal-800 px-4 text-sm font-semibold text-teal-800"
                    >
                      Call
                    </a>
                  )}
                  <Link
                    href={`/facility/${l.slug}`}
                    className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
