import { GUIDES } from "@/lib/guides";
import { SITE_URL, buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const urls = [
    { loc: `${SITE_URL}/guides`, changefreq: "monthly" as const, priority: 0.6 },
    ...GUIDES.map((g) => ({
      loc: `${SITE_URL}/guides/${g.slug}`,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];
  return xmlResponse(buildUrlsetXml(urls));
}
