// Client-safe constants shared by server data-fetching (lib/facilities.ts)
// and client-side forms. Must not import Prisma or any server-only module.

export const COUNTIES = ["Cook", "DuPage", "Will", "Lake", "Kane"] as const;

export const CARE_LEVEL_FILTERS = [
  { value: "assisted living", label: "Assisted Living" },
  { value: "memory care", label: "Memory Care" },
  { value: "independent living", label: "Independent Living" },
  { value: "supportive", label: "Supportive Living / Medicaid" },
  { value: "skilled nursing", label: "Skilled Nursing" },
  { value: "respite", label: "Respite / Short-term" },
] as const;

export const PRICE_BANDS = [
  { value: "under-4000", label: "Under $4,000/mo", max: 4000 },
  { value: "4000-6000", label: "$4,000 – $6,000/mo", min: 4000, max: 6000 },
  { value: "6000-plus", label: "$6,000/mo+", min: 6000 },
] as const;
