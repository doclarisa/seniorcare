# Chicago Care for Seniors — Site Taxonomy & URL Structure (v1, locked)

The single decision every other build step depends on. This defines every page
type, its URL pattern, its target keyword, its schema, and the rules that keep
programmatic pages from tripping Google's Helpful Content filter.

**Migration safety:** your two live patterns — `/assisted-living/cook-county`
and `/facility/[slug]` — are already correct. Everything below is *additive*. No
indexed URL changes, so no 301s required. Standardize on **no trailing slash** to
match what's already indexed.

---

## 1. The naming & URL rules (apply to every page)

- Slug = the **consumer search term**, not the industry/licensing term
  (`nursing-homes`, not `skilled-nursing-facility`).
- Hyphens, lowercase, keyword in the URL, full path under ~60 characters.
- **Never** put "near me" in a URL. Geo landing pages capture "near me" queries
  automatically because Google localizes them to the visitor.
- One `<h1>` per page containing the exact primary keyword.
- `BreadcrumbList` schema on every inner page; canonical tag on every page.

---

## 2. Care-type axis (the primary dimension)

Six core types ship first. Each is a top-level segment and gets its own metro hub
plus geo landings.

| Slug | Primary consumer keyword | Search intent | Notes |
|---|---|---|---|
| `assisted-living` | assisted living | Commercial | Highest volume, most competition. Already live. |
| `memory-care` | memory care / dementia care | Commercial | Split OUT of assisted living — distinct high-intent query. |
| `supportive-living` | supportive living / **medicaid assisted living** | Commercial | **Your differentiator.** IL's Medicaid-funded assisted-living program (HFS). Paid incumbents ignore it because it generates no referral fees. |
| `independent-living` | independent living / 55+ communities | Commercial | Lighter-touch; different buyer intent. |
| `nursing-homes` | nursing homes | Commercial | Use the consumer term, NOT "skilled nursing." Ties directly to your IDPH-inspection differentiator. |
| `continuing-care` | continuing care retirement community / life plan community | Commercial | CCRCs. Lower volume, high value. |

**Phase 2 care types** (add once the core six have coverage): `respite-care`,
`adult-day-care`, `in-home-care`. Note: in-home care is non-facility data — model
it separately, don't force it into the facility schema.

**Alias to set up:** `medicaid-assisted-living` → 301 or canonical to the
matching `supportive-living` page. Same intent, and it's a query the incumbents
leave wide open.

---

## 3. Geography axis (the secondary dimension)

The whole site is Chicagoland, so **no state segment in URLs.** Three geo levels:

**Counties** (7 — always build; they're hubs that link down to cities):
`cook-county`, `dupage-county`, `lake-county`, `will-county`, `kane-county`,
`mchenry-county`, `kendall-county`.

**City of Chicago + neighborhoods** (Chicago nests one level deeper):
`chicago`, then `chicago/lincoln-park`, `chicago/lakeview`, `chicago/hyde-park`,
`chicago/edgewater`, `chicago/rogers-park`, `chicago/beverly`,
`chicago/norwood-park`, `chicago/uptown`, `chicago/portage-park` … (expand as
facility density supports).

**Suburbs** (flat city slugs). Build in tiers by senior population / facility
density:

- **Tier 1 (build first):** naperville, aurora, schaumburg, arlington-heights,
  evanston, oak-park, skokie, elmhurst, wheaton, des-plaines, palatine,
  orland-park, downers-grove, glenview, northbrook, buffalo-grove,
  hoffman-estates, mount-prospect, park-ridge, oak-lawn.
- **Tier 2 (as coverage grows):** highland-park, deerfield, wilmette, hinsdale,
  oak-brook, lombard, lisle, bolingbrook, joliet, elgin, st-charles, geneva,
  batavia, crystal-lake, libertyville, vernon-hills, gurnee, waukegan,
  tinley-park, la-grange, berwyn, morton-grove, niles, wheeling,
  rolling-meadows, elk-grove-village, glen-ellyn, addison, villa-park,
  westmont, woodridge, plainfield, oswego, algonquin, huntley, mchenry,
  woodstock.

**The threshold rule (critical — prevents doorway/thin pages):**
> Only generate a `{care-type} × {geo}` page when it has **≥ 3 real listings.**
> Below that, don't create it — the geo rolls up to its county page. Empty or
> 1-listing landing pages read as doorway spam and drag the whole domain down
> under the Helpful Content system.

---

## 4. Full URL pattern reference

| Page type | URL pattern | Example |
|---|---|---|
| Home | `/` | `/` |
| Care-type metro hub | `/{care-type}` | `/memory-care` |
| County landing | `/{care-type}/{county}` | `/supportive-living/cook-county` |
| Suburb landing | `/{care-type}/{city}` | `/memory-care/naperville` |
| Chicago city landing | `/{care-type}/chicago` | `/assisted-living/chicago` |
| Chicago neighborhood | `/{care-type}/chicago/{hood}` | `/assisted-living/chicago/lincoln-park` |
| Facility detail | `/facility/{slug}` | `/facility/belmont-village-lincoln-park` |
| Guide (pillar/cluster) | `/guides/{topic}` | `/guides/cost-of-assisted-living-illinois` |
| Trust page | `/{page}` | `/methodology`, `/about` |

**Routing note (for the build step):** the geo segment can be a county, a city,
or `chicago` + neighborhood. Handle with a `/[careType]/[...geo]` catch-all, or an
explicit `/[careType]/chicago/[hood]` route alongside `/[careType]/[geo]`.

---

## 5. Page inventory — target keyword, schema, title/H1

| Page | Primary keyword pattern | Schema | Title / H1 formula |
|---|---|---|---|
| Home | senior care chicago | `Organization` + `WebSite`(SearchAction) | Senior Care in Chicago — Assisted Living, Memory Care & More \| Brand |
| Care-type hub | {care type} chicago | `CollectionPage` + `BreadcrumbList` | {Care Type} in Chicagoland — Compare Facilities \| Brand |
| County landing | {care type} {county} | `ItemList` + `FAQPage` + `BreadcrumbList` | {Care Type} in {County}, IL — {N} Facilities Compared \| Brand |
| City landing | {care type} {city} | `ItemList` + `FAQPage` + `BreadcrumbList` | {Care Type} in {City}, IL — Costs, Reviews & Inspections \| Brand |
| Facility detail | {facility name} | `LodgingBusiness` + `PostalAddress` + `AggregateRating` + `BreadcrumbList` | {Facility Name} — {City}, IL \| Reviews, Costs & IDPH Record |
| Guide | {informational query} | `Article` + `FAQPage` (+ `HowTo` where relevant) + `BreadcrumbList` | {Question or Topic} — {Year} Guide \| Brand |

Every landing page needs a short intro (200–400 words of genuine local context)
plus an FAQ block — bare lists get filtered. Facility pages carry the enriched
data (IDPH deficiency count, "last verified" date, costs, room types) that is your
actual moat.

---

## 6. Indexation & canonical policy

- **Facets are not pages.** Filter states (price band, star rating,
  Medicaid-accepted, pet-friendly, couples) are `noindex, follow` or canonical to
  the parent landing page. They exist for UX, not for the index — otherwise you
  generate thousands of near-duplicate thin URLs.
  - The one facet with real standalone demand — "medicaid" — is already covered by
    the `supportive-living` care type, so no separate facet page is needed.
- **Pagination:** short lists → "view all" on one page. Longer lists → self-
  referencing canonicals with `?page=` and `noindex` on pages 2+.
- **Threshold rule from §3** governs which geo pages exist at all.
- Submit an XML sitemap segmented by type (`sitemap-facilities.xml`,
  `sitemap-landings.xml`, `sitemap-guides.xml`) for cleaner Search Console
  coverage reporting.

---

## 7. Informational layer (pillar–cluster — powers E-E-A-T + backlinks)

These are the pages journalists, elder-law sites, and Area Agencies on Aging
actually link to, and they carry the domain's YMYL trust:

- `/guides/cost-of-assisted-living-illinois` — cost data by care type & county (a linkable data asset)
- `/guides/how-to-pay-for-senior-care-illinois` — Medicaid, VA Aid & Attendance, LTC insurance
- `/guides/supportive-living-program-illinois` — the IL Medicaid program explainer (differentiator + high intent)
- `/guides/how-to-read-idph-inspection-reports` — turns your inspection data into a citable guide; **your best linkable asset**
- `/guides/assisted-living-vs-nursing-home`
- `/guides/memory-care-guide`
- `/guides/questions-to-ask-on-a-facility-tour`

Each guide links down to the relevant care-type and county landings; the landings
link up to the guides. That cluster is what tells Google you're an authority on the
whole topic, not just a list.

---

## 8. Trust / E-E-A-T pages (feeds priority #3)

Required for a YMYL niche — an anonymous site advising families where to place a
vulnerable parent will not rank:

`/about`, `/methodology` (how you vet + IDPH data sources cited),
`/contact`, `/privacy`, `/terms`, and `/author/{name}` pages for named,
credentialed humans. Put a visible "Data sources: Illinois Dept. of Public Health"
line and a "Last verified {date}" stamp on every facility page.

---

## 9. Internal linking model

```
Home
 └─ Care-type hub (/memory-care)
     └─ County landing (/memory-care/cook-county)
         └─ City / neighborhood landing (/memory-care/evanston)
             └─ Facility detail (/facility/...)
Guides ←→ cross-link into matching care-type + geo landings
Breadcrumbs mirror the tree in reverse on every page.
```

---

## 10. Build priority (order to generate pages)

1. Split existing county pages by care type — create the parallel
   `memory-care`, `supportive-living`, `nursing-homes`, `independent-living`,
   `continuing-care` county landings (assisted-living already exists).
2. Generate **Tier 1 city** landings wherever the ≥3-listing threshold is met.
3. Add **Chicago neighborhood** landings for the dense neighborhoods.
4. Build the 7 **guide** pillar pages.
5. Add **Tier 2 cities** as the data import fills them past the threshold.

This is the structure to pour the IDPH data into (priority #2). Once it's locked,
the import generates every page above from the facility records automatically.
