import { SITE_URL, buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

const STATIC_PAGES: { path: string; priority: number; changefreq: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/search", priority: 0.9, changefreq: "weekly" },
  { path: "/about", priority: 0.5, changefreq: "monthly" },
  { path: "/founder", priority: 0.4, changefreq: "yearly" },
  { path: "/methodology", priority: 0.6, changefreq: "monthly" },
  { path: "/medical-disclaimer", priority: 0.2, changefreq: "yearly" },
  { path: "/contact", priority: 0.3, changefreq: "yearly" },
  { path: "/pricing", priority: 0.4, changefreq: "monthly" },
  { path: "/list-your-facility", priority: 0.4, changefreq: "monthly" },
];

export async function GET() {
  const urls = STATIC_PAGES.map((p) => ({
    loc: `${SITE_URL}${p.path}`,
    changefreq: p.changefreq,
    priority: p.priority,
  }));
  return xmlResponse(buildUrlsetXml(urls));
}
