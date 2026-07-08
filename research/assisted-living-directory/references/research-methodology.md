# Research & Vetting Methodology

How to build a new regional directory to the same standard as the Chicagoland base.

## Contents
1. Scoping a region
2. Finding candidate facilities
3. The vetting bar (what earns a spot)
4. Verifying licensure (state-by-state)
5. Pulling reviews and recognition
6. Costs and benchmarking
7. Inspection deficiencies and flags
8. Tiering
9. Mandatory caveats block

---

## 1. Scoping a region
Define the metro plus its collar/adjacent counties explicitly (the base uses
Chicago + Cook, DuPage, Lake, Will, Kane). Group facilities by county in the
output. Decide a target count up front (the base is 40) and aim for coverage
across price points — luxury, mid-market, and affordable/Medicaid — so the
directory serves every reader, not just high-budget families.

## 2. Finding candidate facilities
Search per county and per care type. Cross-reference several sources so the list
isn't just one aggregator's picks: Google/Maps listings, Caring.com, A Place for
Mom, U.S. News "Best Senior Living", Seniorly, and the operators' own sites.
Note recurring high-quality operators (national and regional) and check their
location pages — they surface strong candidates quickly.

## 3. The vetting bar (what earns a spot)
A facility qualifies when it has strong online proof of quality: verifiable state
licensure (or certification for affordable programs), a professional web
presence, and solid review volume/ratings across at least one or two of Google,
Caring.com, A Place for Mom, or U.S. News. A facility that can't clear the bar is
either dropped or included with a clear `Data unverified` note and no tier.

## 4. Verifying licensure (state-by-state)
Assisted living licensing is state-specific — always confirm the current
regulator and database for the target state before writing license fields.

- **Illinois** — two tracks. Standard assisted living is licensed by the Illinois
  Department of Public Health (IDPH) under the Assisted Living and Shared Housing
  Act (210 ILCS 9/1 et seq.; 77 Ill. Admin. Code Part 295). Verify at the IDPH
  LLCS database: `llcs.dph.illinois.gov`. The affordable **Supportive Living
  Program (SLP)** is administered separately by Illinois Healthcare and Family
  Services (HFS) under 89 Ill. Adm. Code 146; SLFs are **certified, not
  IDPH-licensed**, so they will NOT appear in the IDPH database — verify via HFS
  instead. SLP pays based on 60% of the average regional nursing-facility rate.
- **Other states** — before building, search for "[state] assisted living
  licensing [department]" and locate the official license-lookup portal (usually
  the state Department of Health, Human Services, or Social Services / Aging).
  Confirm the governing statute name and the exact license-search URL, and note
  whether the state has a separate affordable/Medicaid-waiver track analogous to
  Illinois SLP. Record the regulator and database used at the top of the new
  directory's region-level facts.

Never present a license number as authoritative unless confirmed against the
live state database. Aggregator-sourced numbers get `(verify)`.

## 5. Pulling reviews and recognition
For each facility, capture platform + score + review count, not just a vibe:
U.S. News awards ("Best Assisted Living"/"Best Memory Care" + survey respondent
count), A Place for Mom (score and count), Caring.com, Google, Yelp, Seniorly,
plus operator-level recognition (AHCA/NCAL quality awards, Great Place to Work,
Fortune Best Workplaces in Aging Services). Review counts and stars are snapshots
— note that they change frequently.

## 6. Costs and benchmarking
Lead the region with a cost anchor: the metro's average assisted-living monthly
cost versus the national and state medians, citing the source and year (the base
uses CareScout's 2024 Cost of Care Study via Caring.com / U.S. News). Note that
memory care runs meaningfully higher than assisted living. In entries, mark all
aggregator prices `per aggregator` and label CCRCs as entrance-fee models.

## 7. Inspection deficiencies and flags
Check the state inspection/survey history for each facility. A **FLAG** is
mandatory for any: inspection deficiency, fine, substantiated
abuse/neglect/complaint finding, polarized or sub-3.8 reviews, or financial
concern (operator bankruptcy, entrance-fee refund risk). State the flag plainly
in the Quality summary — hiding it would undermine the directory's credibility
and usefulness. A flagged facility can still be listed (often Tier 2) as long as
it remains licensed and otherwise well-reviewed.

## 8. Tiering
- **Tier 1** — feature first: strongest combination of verified licensure,
  professional web presence, and high review volume/ratings, with no material flags.
- **Tier 2** — include with flags noted: minor inspection deficiencies, polarized
  reviews, or financial cautions.
- **Affordable/Medicaid tier** — a dedicated category for Supportive Living /
  Medicaid-accepting affordable communities, so budget-constrained readers have a
  clear path.

Thresholds that move a facility OUT of Tier 1: dropping below ~3.8 average stars,
a license lapse, or a new substantiated abuse/neglect citation.

## 9. Mandatory caveats block
Every generated directory ends with a caveats section covering at least: prices
are third-party estimates and vary (confirm with each community); review counts
and ratings are snapshots; license numbers/bed counts from aggregators must be
re-verified against the state database before publishing; Supportive Living
facilities are certified (not standard-licensed) and won't appear in the standard
license database; and any facilities with partial data are pending verification.
