# Chicago Care for Seniors — Data Import & Enrichment Plan (v1)

Priority #2. This turns the locked taxonomy into a populated directory. It covers
where to pull every facility, how to merge sources without creating duplicate
pages, the canonical record each facility becomes, and the enrichment that makes a
page worth ranking.

Companion to `chicago-senior-care-taxonomy.md`. Feeds directly into the Prisma
`Listing` seed from the directory build stack.

---

## 1. The three primary sources (all free, all public records)

| Source | Covers | Care types it feeds | Format / how to pull | Refresh |
|---|---|---|---|---|
| **IDPH Assisted Living & Shared Housing Licensed Establishment Listing** — via the Office of Health Care Regulation "Facility Lookup" portal (`llcs.dph.illinois.gov/s/facility-lookup`) | Every state-licensed assisted living & shared housing establishment, with unit count, **Alzheimer's unit flag**, adult day care flag, address, county, license # and status | `assisted-living`, `memory-care` (via the Alzheimer's flag) | Search/filter by county, then **export to Excel/CSV**. Filter to your 7 counties. | Periodic (license renewals annual) — re-pull quarterly |
| **HFS Supportive Living Program provider sites** (`hfs.illinois.gov/medicalprograms/slf/` — per-county pages like `/cook.html`, plus the operational-sites PDFs) | Every Medicaid Supportive Living facility, with apartments count, opening date, operator/company, **dementia-care flag** (`65+`) and **population-served flag** (`22–64 physical disability`, etc.) | `supportive-living`, and cross-flags into `memory-care` where dementia-designated | Per-county HTML tables + downloadable PDFs. Parse the county pages for your 7 counties. | HFS updates periodically — re-pull quarterly |
| **CMS Provider Data Catalog — Nursing Homes** (`data.cms.gov/provider-data/dataset/4pq5-n9py` = Provider Information; plus Health Deficiencies, Ownership, and Penalties datasets) | Every Medicare/Medicaid-certified nursing home nationwide, one row per home: certified beds, **5-star ratings** (overall / health-inspection / staffing / quality), staffing hours, deficiencies, penalties, ownership | `nursing-homes` | Download the full CSVs, **filter to State = IL** and your counties. This is the richest dataset and powers your inspection differentiator. | **Monthly** — the freshest of the three |

**Data.illinois.gov** also hosts an open-data version of the IDPH assisted-living
listing; treat the OHCR portal export as the live source of truth and only use the
open-data file if it's confirmed current.

---

## 2. Coverage gaps — be honest about these

Government data does **not** cleanly cover two of your six verticals:

- **`independent-living`** — not a licensed care category in Illinois, so there's
  no state list. Source from Google Places, facility websites, and existing
  aggregators. Manual/commercial sourcing.
- **`continuing-care`** (CCRCs / life plan communities) — no clean IDPH facility
  list; a CCRC campus usually shows up piecemeal across the IDPH (assisted living
  wing), CMS (nursing wing), and HFS lists. Identify CCRCs by cross-referencing
  campuses that appear in multiple sources at one address, plus manual research.

Launch the four government-fed verticals first (`assisted-living`, `memory-care`,
`supportive-living`, `nursing-homes`); backfill independent living and CCRC as a
second wave.

---

## 3. The one non-obvious trap: one building ≠ one listing... or many

A single physical campus frequently appears in **multiple** source files — e.g. a
community with an assisted-living license (IDPH), a memory-care wing (IDPH
Alzheimer's flag), a Supportive Living designation (HFS), and a skilled-nursing
unit (CMS). If you import each row blindly you'll create duplicate facility pages
for the same address, which Google treats as thin/duplicate content.

**The rule:** one `Listing` per **physical location** (keyed on a normalized
address), carrying a `categories` **array** of every care type offered there. That
single facility page then appears on *all* the matching `{care-type} × {geo}`
landing pages. Only split into separate `Listing` records when the source data
shows genuinely separate licenses at distinct addresses.

Entity resolution: normalize `street + zip` (strip suite/unit, standardize
"North"→"N", etc.), fuzzy-match facility names as a tiebreaker, and merge. This
dedup step runs *before* geocoding and enrichment.

---

## 4. The canonical facility record

Maps onto the directory stack's `Listing` model — core columns for querying,
everything niche in the `enriched` JSON blob.

```
Listing
  name           "Belmont Village Lincoln Park"
  slug           belmont-village-lincoln-park      # {name}-{city|neighborhood}, unique
  address, city, county, region(=neighborhood), zip
  lat, lng                                          # from geocoding (map + "near me")
  phone, website, email
  categories     ["assisted-living","memory-care"]  # ALL care types at this site
  status         PUBLISHED | PENDING
  enriched: {
    # --- from IDPH ---
    licenseNumber, licenseStatus,
    units,                       # capacity
    hasAlzheimersUnit: true,

    # --- from HFS (if applicable) ---
    supportiveLiving: true,
    medicaidAccepted: true,      # drives the "medicaid assisted living" angle
    apartments, opened, operator,
    populationServed: "65+" | "22-64 physical disability",

    # --- from CMS (nursing homes) ---
    ccn,                         # CMS provider number
    certifiedBeds,
    ratings: { overall, healthInspection, staffing, quality },  # 1–5 stars
    deficiencyCount, lastInspectionDate, penalties,

    # --- enrichment layer (your moat) ---
    inspectionSummary: "Plain-language summary of IDPH/CMS record",
    amenities: [...],            # Google Places / facility site
    priceEstimate,               # industry data / facility site
    photos: [...],               # Google Places
    googleRating, reviewCount,

    dataSources: ["IDPH","CMS","HFS"],
    lastVerified: "2026-07-08"   # freshness + YMYL trust signal
  }
```

---

## 5. Field mapping (source → canonical)

| Canonical field | IDPH | HFS SLP | CMS Nursing Homes |
|---|---|---|---|
| name | Facility name | Facility | Provider Name |
| address/city/zip | Address fields | Address line | Provider Address / City / ZIP |
| county | County | County page | County/Parish |
| phone | — | Phone | Telephone Number |
| units/beds | Units | Apartments | Number of Certified Beds |
| care-type tag | assisted-living (+ memory-care if Alzheimer's flag) | supportive-living (+ memory-care if dementia flag) | nursing-homes |
| ratings | — | — | Overall/Health/Staffing/QM ratings |
| deficiencies | (state survey record) | — | Health Deficiencies dataset |
| operator/ownership | — | Company | Ownership dataset |
| medicaidAccepted | — | true | (Medicaid-certified flag) |

---

## 6. The pipeline (order of operations)

1. **Extract** each source to a raw CSV (IDPH export → CSV; parse HFS county
   pages/PDFs → CSV; CMS CSVs filtered to IL).
2. **Normalize** each to the canonical column set; tag each row with its care type.
3. **Dedup & merge** on normalized address (§3) → one row per physical site with a
   `categories` array and merged `enriched` fields.
4. **Geocode** every site (address → lat/lng) for the map and "near me" queries.
5. **Enrich** — match to Google Places (photos, hours, website, rating); run AI
   enrichment to (a) write the plain-language inspection summary from the CMS/IDPH
   record and (b) answer the specific questions families ask; stamp `lastVerified`.
6. **Load** — upsert into Prisma `Listing` keyed on `slug` (idempotent seed, so
   re-runs update rather than duplicate). New/changed sites land as `PENDING`;
   flip to `PUBLISHED` after a spot check.
7. **Generate pages** — the taxonomy's landing pages build from the loaded records;
   enforce the **≥3-listing threshold** (taxonomy §3) before a geo × care-type page
   goes live.

---

## 7. Enrichment = the differentiator (don't skip step 5)

The government data is what *everyone could* have; the enrichment is what makes
your page beat A Place for Mom's. Two enrichment moves matter most:

- **Plain-language inspection summaries.** Raw CMS deficiency codes and IDPH survey
  records are unreadable to families. Turning "3 health deficiencies, last survey
  2025-08, staffing 4/5" into an honest paragraph is the exact time-save families
  can't get from Google Maps — and it's your transparency angle made concrete.
- **Question-answering per facility.** Mirror the enrich-the-data pattern: let the
  data answer "Does this place take Medicaid?", "Is there a secured memory-care
  unit?", "What were the recent inspection issues?" — pulled from the merged record,
  not guessed.

---

## 8. Refresh & trust

- Re-run the pipeline **monthly** (CMS refreshes monthly; IDPH/HFS quarterly is
  fine but a monthly cadence keeps `lastVerified` current across the board).
- Every facility page shows **"Data sources: IDPH, CMS, HFS · Last verified {date}"**
  — this is both a freshness signal to Google and the trust anchor a YMYL page
  needs. It also feeds the `/methodology` page in priority #3.
- These are public records; using them is fine. Cite them, and never imply a
  facility *endorses* your directory.

---

## Next step

The extract → dedup → geocode → enrich → load pipeline is a real coding job (CSV
parsing, entity resolution, geocoding + Places API calls, an AI enrichment pass,
Prisma upserts). That's the moment to move into the codebase rather than chat.
Priority #3 (the E-E-A-T / methodology layer) can run in parallel and reuses the
`dataSources` and `lastVerified` fields defined here.
