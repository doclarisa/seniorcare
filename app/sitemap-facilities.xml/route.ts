import { prisma } from "@/lib/prisma";
import { SITE_URL, buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600; // sitemaps don't need to be regenerated on every crawl request

export async function GET() {
  const [facilities, listings] = await Promise.all([
    prisma.facility.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.listing.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const urls = [...facilities, ...listings].map((f) => ({
    loc: `${SITE_URL}/facility/${f.slug}`,
    lastmod: f.updatedAt.toISOString(),
    changefreq: "monthly" as const,
    priority: 0.7,
  }));

  return xmlResponse(buildUrlsetXml(urls));
}
