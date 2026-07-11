import { buildCountyListings } from "./build-county-listings.mjs";

// Thin wrapper kept for the established `npx tsx scripts/build-cook-listings.mjs`
// entry point. Cook used to have its own standalone copy of the merge
// pipeline, which silently diverged from the generalized version in
// build-county-listings.mjs (a city-casing fix landed there but not here,
// splitting e.g. "Park Ridge" into two differently-cased cities for Cook
// specifically). Delegating to the shared implementation is what keeps that
// from happening again. File slug is "cook" -- matches data/raw/{hfs,cms}/cook.json
// and produces data/processed/cook-listings.json, same convention as every
// other county (see scripts/upsert-cook-listings.ts for the reader).
buildCountyListings("Cook", "cook");
