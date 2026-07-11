import { buildUrlsetXml, xmlResponse } from "@/lib/sitemap";

// No guide pages exist yet (chicago-senior-care-taxonomy.md §7's pillar-
// cluster pages -- cost of assisted living, how to read IDPH inspection
// reports, etc.). Kept as its own empty-but-valid sitemap file, rather than
// added later, so the segmented structure (and the URL Search Console sees)
// doesn't change once guides do exist.
export async function GET() {
  return xmlResponse(buildUrlsetXml([]));
}
