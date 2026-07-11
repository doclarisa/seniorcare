import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { countFacilities } from "@/lib/facilities";
import {
  CARE_TYPE_LABELS,
  COUNTY_NAMES,
  COUNTY_SLUGS,
  MIN_LISTINGS_FOR_LANDING_PAGE,
  countListingsByCareTypeAndCounty,
  listCitiesWithCareType,
} from "@/lib/listings";
import { CARE_TYPE_CONTENT } from "@/lib/care-type-content";
import { GUIDES } from "@/lib/guides";

// Internal linking model (taxonomy §9): guides link down into matching
// care-type landings, and landings link back up to the guides that cover
// them -- without this, a family lands on a hub page with nowhere to go
// for the "how do I actually evaluate this" questions the FAQ block can
// only answer briefly.
const RELATED_GUIDE_SLUGS: Record<string, string[]> = {
  "assisted-living": ["assisted-living-vs-nursing-home", "cost-of-assisted-living-illinois", "questions-to-ask-on-a-facility-tour"],
  "memory-care": ["memory-care-guide", "questions-to-ask-on-a-facility-tour"],
  "supportive-living": ["supportive-living-program-illinois", "how-to-pay-for-senior-care-illinois"],
  "nursing-homes": ["how-to-read-idph-inspection-reports", "assisted-living-vs-nursing-home"],
};

// The four government-fed verticals (chicago-senior-care-data-import-plan.md
// §2): the only ones with a clean, verifiable public data source today.
// independent-living and continuing-care have no such source and are a
// deliberate second wave -- listing them here would mean either an empty
// hub page or unsourced data on a YMYL site.
const CARE_TYPES = ["assisted-living", "memory-care", "supportive-living", "nursing-homes"] as const;

export function generateStaticParams() {
  return CARE_TYPES.map((careType) => ({ careType }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ careType: string }>;
}): Promise<Metadata> {
  const { careType } = await params;
  if (!CARE_TYPES.includes(careType as (typeof CARE_TYPES)[number])) return {};
  const label = CARE_TYPE_LABELS[careType] ?? careType;
  return {
    title: `${label} in Chicagoland — Compare Facilities | Chicago Care for Seniors`,
    description: `Compare ${label.toLowerCase()} communities across Chicago and the collar counties, with Illinois state licensing and federal inspection records.`,
  };
}

async function countyTotal(careType: string, countySlug: string): Promise<number> {
  const countyName = COUNTY_NAMES[countySlug];
  const listingCount = await countListingsByCareTypeAndCounty(careType, countyName);
  if (careType !== "assisted-living") return listingCount;
  // assisted-living/[county] merges in the original hand-curated Facility
  // dataset too (see app/assisted-living/[county]/page.tsx) -- match that
  // total here so the hub's county counts aren't understated.
  const facilityCount = await countFacilities(countyName);
  return listingCount + facilityCount;
}

export default async function CareTypeHubPage({
  params,
}: {
  params: Promise<{ careType: string }>;
}) {
  const { careType } = await params;
  if (!CARE_TYPES.includes(careType as (typeof CARE_TYPES)[number])) notFound();

  const label = CARE_TYPE_LABELS[careType];
  const content = CARE_TYPE_CONTENT[careType];

  const countyRows = await Promise.all(
    COUNTY_SLUGS.map(async (countySlug) => ({
      slug: countySlug,
      name: COUNTY_NAMES[countySlug],
      count: await countyTotal(careType, countySlug),
    })),
  );

  // assisted-living/[county] always renders (grandfathered route, no
  // threshold); the other three care types 404 below the threshold rule, so
  // don't link a county that would 404.
  const linkableCounties = countyRows.filter(
    (c) => c.count > 0 && (careType === "assisted-living" || c.count >= MIN_LISTINGS_FOR_LANDING_PAGE),
  );
  // County totals already count every listing regardless of city, so the
  // metro total comes from there -- summing city counts too would
  // double-count every listing (it belongs to both a county and a city).
  const total = countyRows.reduce((sum, c) => sum + c.count, 0);

  const cities = await listCitiesWithCareType(careType);
  const relatedGuides = (RELATED_GUIDE_SLUGS[careType] ?? [])
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => !!g);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${label} in Chicagoland`,
        description: `Directory of ${label.toLowerCase()} communities across Chicago and the collar counties.`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "/" },
          { "@type": "ListItem", position: 2, name: label, item: `/${careType}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <Container className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-800">
          Home
        </Link>{" "}
        / {label}
      </nav>

      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{label} in Chicagoland</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {total} {label.toLowerCase()} {total === 1 ? "community" : "communities"} across Chicago and
        the collar counties.
      </p>

      <div className="mt-6 max-w-3xl space-y-4 text-slate-700">
        {content.intro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Browse by county</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {linkableCounties.map((c) => (
          <Link
            key={c.slug}
            href={careType === "assisted-living" ? `/assisted-living/${c.slug}` : `/${careType}/${c.slug}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-teal-800"
          >
            <span className="font-semibold text-slate-900">{c.name} County</span>
            <span className="text-sm text-slate-500">{c.count}</span>
          </Link>
        ))}
      </div>

      {cities.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-bold text-slate-900">Browse by city</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={careType === "assisted-living" ? `/assisted-living/${c.slug}` : `/${careType}/${c.slug}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-teal-800"
              >
                <span className="font-semibold text-slate-900">{c.city}</span>
                <span className="text-sm text-slate-500">{c.count}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-10 text-lg font-bold text-slate-900">Frequently asked questions</h2>
      <div className="mt-4 max-w-3xl space-y-6">
        {content.faqs.map((f) => (
          <div key={f.question}>
            <h3 className="font-semibold text-slate-900">{f.question}</h3>
            <p className="mt-1 text-slate-700">{f.answer}</p>
          </div>
        ))}
      </div>

      {relatedGuides.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-bold text-slate-900">Related guides</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-teal-800"
              >
                <span className="font-semibold text-slate-900">{g.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
