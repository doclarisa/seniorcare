# IDPH Assisted Living/Shared Housing crawl — data notes

- Source: https://llcs.dph.illinois.gov/s/facility-lookup (IDPH Facility Lookup, Salesforce Lightning app), Facility Type = "Assisted Living/Shared Housing Establishment", statewide, no county filter applied at crawl time.
- Crawled via `scripts/idph-crawl.mjs` (Playwright, click-based, no API — none exists).
- Final output: `assisted-living-il.json` (541 records). Raw checkpoint: `assisted-living-il.checkpoint.jsonl`.

## Known discrepancy: 541 vs. stated 614 total

The portal's own "Viewing X-Y of 614" pagination header claims 614 facilities, but only **541 distinct facilities ever render as a clickable "View Details" row**, verified across **6 independent full page-1-through-page-62 walks** of the entire paginated list. The same 541 unique Facility IDs turn up every time; the other 73 never appear under any page position in any pass. This is not a page-ordering artifact (an earlier version of the crawler used position-based fast-forwarding and produced spurious gaps from that; this result is from the corrected version that always walks from page 1).

Per the project's no-fabrication rule, the crawler hard-stops rather than guessing at the missing 73 — see `crawl.log` around 2026-07-10T08:38 UTC for the final stop message. Decision (2026-07-10, user confirmed): proceed with the verified 541 as the dataset for now; the gap is documented here rather than silently resolved. Do not assume the missing 73 don't exist — they may be legitimate facilities the portal fails to surface via pagination (duplicate suppression bug, restricted records, etc.). Revisit if a discrepancy shows up against another authoritative count (e.g. CMS or HFS cross-reference) for the same facilities.

## Cook County snapshot (as of this crawl)

- Cook County, all statuses: 90
- Cook County, Active only: 71

## Status breakdown (statewide, all 541)

- Active: 436
- Inactive - CHOW: 69
- Closed: 24
- Inactive: 12

Only `Active` records should be treated as currently-operating facilities for the directory. `Inactive - CHOW` (change of ownership) and `Closed` should be excluded from published listings but may be worth keeping in the raw dataset for reference/dedup purposes.
