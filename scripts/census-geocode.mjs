import fs from "node:fs";
import path from "node:path";

// Free US Census batch/one-line geocoder, no API key. We use the one-line
// endpoint per address (dataset is small enough) with a file-backed cache so
// re-runs of the pipeline don't re-hit the API for addresses already solved.

const CACHE_PATH = path.join(process.cwd(), "data", "processed", "geocode-cache.json");

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Returns { lat, lng, matchedAddress } or null if the Census geocoder found
// no match. Never guesses coordinates -- a null result means the caller
// should leave lat/lng empty rather than fabricate a location.
export async function geocodeAddress(fullAddress, { cache = loadCache(), delayMs = 400 } = {}) {
  if (cache[fullAddress] !== undefined) return cache[fullAddress];

  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(
    fullAddress,
  )}&benchmark=Public_AR_Current&format=json`;

  let result = null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const json = await res.json();
      const match = json?.result?.addressMatches?.[0];
      if (match) {
        result = {
          lat: match.coordinates.y,
          lng: match.coordinates.x,
          matchedAddress: match.matchedAddress,
        };
      }
    }
  } catch (err) {
    console.error(`  geocode error for "${fullAddress}": ${err.message}`);
  }

  cache[fullAddress] = result;
  saveCache(cache);
  await sleep(delayMs);
  return result;
}

export { loadCache, saveCache };
