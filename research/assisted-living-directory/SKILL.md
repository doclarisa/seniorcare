---
name: assisted-living-directory
description: Build, expand, and answer questions from a vetted senior-living directory (assisted living, memory care, supportive/affordable, and CCRC communities). Use this skill whenever the user wants to (a) look up, filter, compare, or recommend facilities from the existing directory — e.g. "which memory-care places in DuPage are Tier 1?", "cheapest Medicaid-eligible option near Naperville", "compare Belmont Village Lincoln Park vs Oak Park" — or (b) research and generate NEW directory entries or a whole new regional directory in the same format — e.g. "add St. Louis", "build a Milwaukee assisted living directory", "vet and add three facilities in Aurora". Trigger this even when the user just names a metro/county and senior living, or pastes a facility name to be vetted, or asks for a directory page — don't wait for them to say the word "directory". The base dataset is Chicagoland (40 facilities across Cook, DuPage, Lake, Will, Kane).
---

# Assisted Living Directory

This skill powers a vetted senior-living directory website. It does two jobs:

1. **Look up & recommend** from the existing directory (base: Chicagoland, 40
   facilities in `assets/chicagoland-base-directory.md`).
2. **Research & generate** new entries or whole new regional directories to the
   same standard and format.

Both jobs share one format (the facility schema) and one quality bar (the vetting
methodology). Read the relevant reference before doing substantive work — the
schema and methodology carry state-specific and reliability details that must not
be guessed at.

## Resources

- `assets/chicagoland-base-directory.md` — the canonical base dataset and the
  worked example of the target output. Read it for any lookup query, and skim it
  as a format model before generating new entries.
- `references/facility-schema.md` — the exact per-facility field set, entry
  template, data-reliability conventions, and optional JSON export shape. Read
  before writing or editing any entry.
- `references/research-methodology.md` — how to scope a region, find candidates,
  verify licensure (state-by-state), pull reviews, benchmark cost, apply flags,
  and tier. Read before building a new region or vetting new facilities.

## Which mode am I in?

- The user asks about facilities that already exist in the directory (filter,
  compare, recommend, "which ones…", "cheapest…", "near…") → **Lookup mode.**
- The user wants to add facilities or a new region, or hands you a facility to
  vet → **Build mode.**
- If ambiguous, ask one quick question rather than guessing.

## Lookup mode

1. Read `assets/chicagoland-base-directory.md`.
2. Answer from it directly. Respect the fields: filter by county, care level,
   price, Medicaid/SLP eligibility, tier, or operator as asked.
3. Always surface any **FLAG** on a facility you recommend — never present a
   flagged community as clean. The directory's value is honest vetting.
4. If the user asks about a facility or area not in the base data, say so and
   offer to research it (Build mode).
5. Keep recommendations grounded in what the data actually shows; don't invent
   scores, prices, or license details.

## Build mode

Follow `references/research-methodology.md` end to end. In brief:

1. **Scope** the region (metro + collar counties), target count, and price
   spread. State the regulator/database you'll use for that state up front.
2. **Verify licensure** against the correct state database before writing license
   fields. For Illinois use IDPH LLCS (`llcs.dph.illinois.gov`); Supportive
   Living is HFS-certified, not IDPH-licensed. For other states, find the
   official license-lookup portal first — don't assume Illinois rules apply.
3. **Gather** care levels, capacity, cost (mark aggregator figures
   `per aggregator`), room types, amenities, reviews (platform + score + count),
   and operator credibility for each facility.
4. **Flag** every inspection deficiency, fine, substantiated complaint, polarized
   or sub-3.8 review pattern, and financial concern, stated plainly.
5. **Write** each entry with `references/facility-schema.md`'s template and field
   order, verbatim labels.
6. **Tier** (Tier 1 / Tier 2-with-flags / Affordable–Medicaid) and add the
   region-level cost anchor and the mandatory caveats block.

When research requires current web data (licenses, reviews, prices, inspection
records), use web search — this information changes constantly and must not be
filled in from memory. If web access isn't available, produce the entry with the
known fields and mark every unconfirmed field `(verify)` rather than guessing.

## Output format

Default deliverable is markdown in the base-directory format: facilities grouped
by county, each following the schema, ending with a tiering summary and caveats.
For a full new region, also open with the region-level facts (cost anchor,
regulatory tracks, recurring operators) as the base file does.

Produce a downloadable `.md` file when the user is generating or expanding a
directory (it's website content they'll publish). Answer inline for quick lookup
questions. Emit the structured JSON export (schema §"Optional structured export")
only when the user asks for machine-readable output for their site.

## Non-negotiables

- Honest flags always shown. A vetted directory that hides deficiencies is worse
  than useless.
- Aggregator data is provisional: prices `per aggregator`, license numbers
  `(verify)` until confirmed against the state database.
- Never fabricate a license number, review score, or inspection result. Unknown →
  label it and mark for verification.
