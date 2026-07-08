# Facility Schema & Entry Template

Every facility entry uses the same field set and order so the directory reads
consistently and can be parsed into a website/CMS later. Keep field labels
verbatim. Omit a field only when it genuinely does not apply (e.g., no
`Medicaid/SLP` line for a private-pay-only community); when a value is unknown,
write the label and mark it `(verify)` or `Data unverified` rather than dropping it.

## Field set (in order)

1. **Address** — full street, city, state, ZIP, with `(County)` appended. If only
   the city is known, write the city and append `— verify exact street/ZIP`.
2. **Phone** — primary; a second number may follow after ` / `.
3. **Email** — only if publicly listed.
4. **Website** — bare domain + path, no `https://`.
5. **Care levels** — comma-separated: independent living, assisted living, memory
   care, skilled nursing, respite/short-term, hospice coordination, CCRC/LifeCare.
   Name any branded memory-care program in parentheses.
6. **License** — state agency + license number + status/expiration + operating
   entity (the LLC on the license). Mark `(verify)` if sourced from an aggregator
   rather than the state database. For Supportive Living, note it is HFS-certified,
   not licensed.
7. **Capacity** — unit/bed count; break out AL vs memory care vs SNF if a CCRC.
8. **Price** — monthly starting figure and/or range; label CCRCs as entrance-fee
   models with the buy-in and monthly fee. Always mark aggregator figures as
   `per aggregator` — treat as indicative, never quoted.
9. **Room types** — studio, one-bedroom, two-bedroom, semi-private, etc.
10. **Amenities** — dining style, clinical staffing (e.g., 24/7 licensed nurse),
    memory programming, therapy, salon, transportation, pet-friendly, notable extras.
11. **Reviews** — each platform with its score and review count: U.S. News awards,
    A Place for Mom, Caring.com, Google, Yelp, Seniorly. Include recognition
    ("Best Assisted Living", quality awards).
12. **Operator** — management company + one-line credibility note (portfolio size,
    founding, non-profit status) where known.
13. **Opened** — year, if known.
14. **Medicaid/SLP** — `Yes` for Supportive Living Program / Medicaid-accepting
    affordable communities; omit otherwise.
15. **Quality summary** — 1–3 sentences: what kind of community it is, its
    strongest proof points, then any **FLAG** (inspection deficiency, fine,
    substantiated complaint, polarized reviews, financial concern) stated plainly.
    End with the tier where assigned.

## Entry template

```markdown
### N. Facility Name
- Address: 123 Main St, City, IL 60000 (County)
- Phone: (000) 000-0000
- Website: example.com/community
- Care levels: Assisted living, memory care, respite
- License: IDPH #0000000; expires MM/DD/YYYY; operated by Operating Entity, LLC (verify)
- Capacity: ~00 units
- Price: ~$0,000/mo starting (per aggregator)
- Room types: Studio, one-bedroom
- Amenities: ...
- Reviews: U.S. News "Best Assisted Living"; A Place for Mom 0.0 (00 reviews); Google 0.0
- Operator: Operator Name
- Opened: 0000
- Quality summary: One line on what it is + strongest proof. **FLAG:** any concern. **Tier N.**
```

## Data-reliability conventions

- Anything from an aggregator (assistedlivingmagazine.com, seniorly, mirador,
  senior homes, family assets) is **provisional**. Mark prices `per aggregator`
  and license numbers `(verify)`.
- Never present a license number as authoritative unless it was confirmed against
  the state's live licensing database.
- A **FLAG** is mandatory whenever the source shows any of: an inspection
  deficiency, a fine, a substantiated abuse/neglect/complaint finding, polarized
  or sub-3.8 reviews, or a financial concern (e.g., operator bankruptcy). Flags
  are stated openly — the directory's credibility depends on not hiding them.

## Optional structured export (for website ingestion)

When the user wants machine-readable output for their site, emit one JSON object
per facility alongside (or instead of) the markdown, using these keys:
`name, address, city, county, state, zip, phone, email, website, care_levels[],
license{agency, number, status, expires, operator, verified}, capacity, price{starting, range, model}, room_types[], amenities[], reviews[{platform, score, count, note}], operator, opened, medicaid_slp, flags[], tier, quality_summary`.
Only produce this when asked — the markdown entry is the default deliverable.
