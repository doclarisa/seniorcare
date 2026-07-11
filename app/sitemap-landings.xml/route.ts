import { countFacilities } from "@/lib/facilities";
import {
  COUNTY_NAMES,
  COUNTY_SLUGS,
  MIN_LISTINGS_FOR_LANDING_PAGE,
  countListingsByCareTypeAndCounty,
  listCitiesWithCareType,
} from "@/lib/listings";
import { SITE_URL, buildUrlsetXml, xmlResponse, type SitemapUrlEntry } from "@/lib/sitemap";

export const revalidate = 3600;

const CARE_TYPES = ["assisted-living", "memory-care", "supportive-living", "nursing-homes"] as const;

async function countyTotal(careType: string, countySlug: string): Promise<number> {
  const countyName = COUNTY_NAMES[countySlug];
  const listingCount = await countListingsByCareTypeAndCounty(careType, countyName);
  if (careType !== "assisted-living") return listingCount;
  return listingCount + (await countFacilities(countyName));
}

export async function GET() {
  const urls: SitemapUrlEntry[] = [];

  for (const careType of CARE_TYPES) {
    // Metro hub page -- always exists.
    urls.push({ loc: `${SITE_URL}/${careType}`, changefreq: "weekly", priority: 0.8 });

    // County pages: assisted-living/[geo] is grandfathered and always
    // renders; the other three 404 below the >=3-listing threshold.
    for (const countySlug of COUNTY_SLUGS) {
      const count = await countyTotal(careType, countySlug);
      if (careType === "assisted-living" || count >= MIN_LISTINGS_FOR_LANDING_PAGE) {
        const path = careType === "assisted-living" ? `/assisted-living/${countySlug}` : `/${careType}/${countySlug}`;
        urls.push({ loc: `${SITE_URL}${path}`, changefreq: "weekly", priority: 0.7 });
      }
    }

    // City pages: already filtered to the threshold by listCitiesWithCareType.
    const cities = await listCitiesWithCareType(careType);
    for (const c of cities) {
      const path = careType === "assisted-living" ? `/assisted-living/${c.slug}` : `/${careType}/${c.slug}`;
      urls.push({ loc: `${SITE_URL}${path}`, changefreq: "weekly", priority: 0.6 });
    }
  }

  return xmlResponse(buildUrlsetXml(urls));
}
