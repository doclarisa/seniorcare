// Normalizes a street address into a stable dedup key (import plan §3:
// "normalize street + zip ... merge"). Used ONLY as an internal matching
// key, never displayed — so a merge miss (two keys for the same building)
// is the safe failure mode; a merge hit on two DIFFERENT buildings is not.
// Keep this conservative rather than clever.

const DIRECTIONALS = {
  NORTH: "N",
  SOUTH: "S",
  EAST: "E",
  WEST: "W",
  NORTHEAST: "NE",
  NORTHWEST: "NW",
  SOUTHEAST: "SE",
  SOUTHWEST: "SW",
};

const SUFFIXES = {
  STREET: "ST",
  AVENUE: "AVE",
  ROAD: "RD",
  DRIVE: "DR",
  BOULEVARD: "BLVD",
  LANE: "LN",
  PLACE: "PL",
  COURT: "CT",
  CIRCLE: "CIR",
  TERRACE: "TER",
  PARKWAY: "PKWY",
  HIGHWAY: "HWY",
  TRAIL: "TRL",
  SQUARE: "SQ",
};

export function normalizeStreet(street) {
  if (!street) return "";
  let s = street.toUpperCase();
  s = s.replace(/[.#]/g, "");
  s = s.replace(/,/g, " ");
  // strip trailing suite/unit/apt indicators
  s = s.replace(/\b(SUITE|STE|UNIT|APT|APARTMENT|BLDG|BUILDING|FL|FLOOR)\b.*$/, "");
  s = s.replace(/\s+/g, " ").trim();
  const words = s.split(" ").map((w) => DIRECTIONALS[w] ?? SUFFIXES[w] ?? w);
  return words.join(" ").trim();
}

export function addressKey(street, zip) {
  const normStreet = normalizeStreet(street);
  const normZip = (zip ?? "").trim().slice(0, 5);
  return `${normStreet}|${normZip}`;
}
