import { SITE_URL, buildSitemapIndexXml, xmlResponse } from "@/lib/sitemap";

export async function GET() {
  const xml = buildSitemapIndexXml(
    ["sitemap-pages.xml", "sitemap-facilities.xml", "sitemap-landings.xml", "sitemap-guides.xml"].map((name) => ({
      loc: `${SITE_URL}/${name}`,
    })),
  );
  return xmlResponse(xml);
}
