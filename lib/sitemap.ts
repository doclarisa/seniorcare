// Shared helpers for the segmented sitemap Route Handlers (app/sitemap-*.xml).
// Plain Route Handlers rather than Next's special sitemap.ts convention,
// specifically so the files can have exact custom names
// (sitemap-facilities.xml, not facility/sitemap.xml) --
// chicago-senior-care-taxonomy.md §6 asks for sitemaps "segmented by type
// (sitemap-facilities.xml, sitemap-landings.xml, sitemap-guides.xml) for
// cleaner Search Console coverage reporting."

export const SITE_URL = "https://www.chicagocareforseniors.com";

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildUrlsetXml(urls: SitemapUrlEntry[]): string {
  const items = urls
    .map((u) => {
      const parts = [`<loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`<lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`<changefreq>${u.changefreq}</changefreq>`);
      if (u.priority != null) parts.push(`<priority>${u.priority}</priority>`);
      return `<url>${parts.join("")}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export function buildSitemapIndexXml(sitemaps: { loc: string; lastmod?: string }[]): string {
  const items = sitemaps
    .map((s) => `<sitemap><loc>${escapeXml(s.loc)}</loc>${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ""}</sitemap>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=UTF-8" },
  });
}
