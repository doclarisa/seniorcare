export interface GuideMeta {
  slug: string;
  title: string; // page H1 / <title>
  dek: string; // one-line description, used in metadata + index card
}

// chicago-senior-care-taxonomy.md §7: the informational pillar-cluster layer
// that carries the domain's YMYL trust and backlink profile. Order here is
// also the display order on /guides.
export const GUIDES: GuideMeta[] = [
  {
    slug: "nursing-home-quality-report-illinois",
    title: "Nursing Home Quality & Enforcement Report: Chicago Metro, 2026",
    dek: "We analyzed CMS's complete federal record for all 312 certified nursing homes across 7 Chicago-area counties -- ratings, ownership, and $31.6M in fines, broken down.",
  },
  {
    slug: "how-to-read-idph-inspection-reports",
    title: "How to Read an Illinois Nursing Home or Assisted Living Inspection Report",
    dek: "What a state or federal inspection report actually says, in plain English -- and where to find the real one for any facility.",
  },
  {
    slug: "supportive-living-program-illinois",
    title: "Illinois's Supportive Living Program, Explained",
    dek: "The state's Medicaid-funded alternative to a nursing home -- what it covers, who qualifies, and why most families have never heard of it.",
  },
  {
    slug: "cost-of-assisted-living-illinois",
    title: "What Assisted Living Actually Costs in Illinois",
    dek: "How senior living pricing is structured, what drives the range, and the Medicaid-funded alternative most cost guides don't mention.",
  },
  {
    slug: "how-to-pay-for-senior-care-illinois",
    title: "How to Pay for Senior Care in Illinois",
    dek: "Medicaid, the Supportive Living Program, VA Aid & Attendance, and long-term care insurance -- what each actually covers.",
  },
  {
    slug: "assisted-living-vs-nursing-home",
    title: "Assisted Living vs. Nursing Home: What's the Real Difference?",
    dek: "Two different levels of care, two different regulators, two different price points -- how to tell which one your family actually needs.",
  },
  {
    slug: "memory-care-guide",
    title: "Memory Care in Illinois: A Practical Guide",
    dek: "What memory care actually adds beyond assisted living, how Illinois designates it, and the questions that separate a real memory care unit from a locked door.",
  },
  {
    slug: "questions-to-ask-on-a-facility-tour",
    title: "Questions to Ask on a Senior Living Facility Tour",
    dek: "A room-by-room, shift-by-shift checklist for the questions that matter more than how nice the lobby looks.",
  },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
