import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    // Listed individually (not just the index) so a crawler that only reads
    // the first Sitemap: line still finds every segment.
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-pages.xml`,
      `${SITE_URL}/sitemap-facilities.xml`,
      `${SITE_URL}/sitemap-landings.xml`,
      `${SITE_URL}/sitemap-guides.xml`,
    ],
  };
}
