// Genuine, locally-grounded copy for each care-type metro hub page
// (chicago-senior-care-taxonomy.md §5: "Every landing page needs a short
// intro (200-400 words of genuine local context) plus an FAQ block -- bare
// lists get filtered.") Facts here are kept to well-established regulatory
// definitions (IDPH/HFS/CMS program rules), not specific costs or
// statistics that would need per-session verification on a YMYL page.

export interface CareTypeContent {
  intro: string[];
  faqs: { question: string; answer: string }[];
}

export const CARE_TYPE_CONTENT: Record<string, CareTypeContent> = {
  "assisted-living": {
    intro: [
      "Assisted living communities in the Chicago area help older adults with day-to-day tasks like bathing, dressing, medication management, and meals, while still offering private or semi-private apartments and a level of independence. It sits between fully independent living and the round-the-clock medical care of a nursing home.",
      "In Illinois, assisted living communities are licensed by the Illinois Department of Public Health (IDPH) as \"Assisted Living\" or \"Shared Housing\" establishments, and are subject to periodic state surveys. Many communities also operate a separate memory care wing for residents with Alzheimer's or another dementia, which IDPH tracks separately as an Alzheimer's Special Care Program designation.",
      "The listings on this page combine our own hand-vetted directory with Illinois's public IDPH licensing records, so you can see a facility's license status and recent state survey history alongside its contact information -- not just marketing copy.",
    ],
    faqs: [
      {
        question: "What's the difference between assisted living and a nursing home?",
        answer:
          "Assisted living is for people who need help with daily activities -- bathing, dressing, medication reminders -- but not continuous medical care. Nursing homes (also called skilled nursing facilities) provide 24/7 medical and nursing care and are typically used for rehabilitation or higher-acuity long-term care.",
      },
      {
        question: "Does Medicare cover assisted living?",
        answer:
          "Generally no. Medicare doesn't cover the room-and-board cost of assisted living. It may cover specific medical services delivered there (like a doctor visit), but not the residential care itself. Illinois's Medicaid-funded Supportive Living Program is a separate option for residents who qualify financially.",
      },
      {
        question: "Is assisted living regulated in Illinois?",
        answer:
          "Yes. The Illinois Department of Public Health licenses assisted living and shared housing establishments and conducts periodic licensure surveys and complaint investigations, the records for which are public.",
      },
    ],
  },
  "memory-care": {
    intro: [
      "Memory care is specialized housing and care for people living with Alzheimer's disease or another form of dementia. It's usually delivered inside a secured unit -- doors and common areas designed to prevent residents from wandering off unsupervised -- with staff trained specifically in dementia care and a daily routine built around cognitive engagement and consistency.",
      "Memory care isn't always a separate building: in the Chicago area it's frequently a dedicated wing within a larger assisted living or supportive living community. Illinois's Department of Public Health tracks this through the Alzheimer's Special Care Program designation, which requires facilities to disclose their staffing ratios, training, and programming for residents with dementia.",
      "The communities listed here carry that Alzheimer's Special Care designation, a dementia-care flag from Illinois's Supportive Living Program, or both, cross-referenced against the same facility's state licensing and (where applicable) federal nursing home inspection record.",
    ],
    faqs: [
      {
        question: "What is memory care, exactly?",
        answer:
          "Memory care is a type of long-term care specifically designed for people with Alzheimer's disease or other dementias, typically featuring a secured environment, a higher staff-to-resident ratio than standard assisted living, and staff trained in dementia-specific care techniques.",
      },
      {
        question: "Does Illinois require special certification for memory care?",
        answer:
          "Facilities that market themselves as memory care can seek an Alzheimer's Special Care Program designation from IDPH, which requires disclosing specific staff training hours and programming. Not every facility with a secured dementia unit carries this formal designation, so it's worth asking directly.",
      },
      {
        question: "How is memory care different from regular assisted living?",
        answer:
          "Memory care adds a secured environment, staff trained specifically in dementia care, and a daily structure designed around cognitive symptoms -- on top of the personal-care help (bathing, dressing, medication) that standard assisted living already provides.",
      },
    ],
  },
  "supportive-living": {
    intro: [
      "Illinois's Supportive Living Program (SLP) is a state Medicaid-funded alternative to nursing home care -- apartment-style housing with meals, personal care, and 24-hour staff availability, for older adults and for younger adults with physical disabilities who meet the program's income and level-of-care requirements. It's run through the Illinois Department of Healthcare and Family Services (HFS), not IDPH.",
      "This is sometimes called \"Medicaid assisted living,\" since it functions similarly to private-pay assisted living but is funded through Medicaid for residents who qualify financially. Some supportive living communities also carry a dementia-care designation for residents with Alzheimer's or another dementia; others specifically serve younger adults (22-64) with physical disabilities rather than the general 65-and-older population.",
      "Because supportive living generates no referral fees for the big paid senior-living directories, it tends to be underrepresented in most consumer search results -- even though it's often the most realistic option for a family relying on Medicaid. Every listing here comes directly from HFS's own published list of operational Supportive Living facilities.",
    ],
    faqs: [
      {
        question: "What is Illinois's Supportive Living Program?",
        answer:
          "It's a state Medicaid program that funds apartment-style assisted-living-equivalent housing for older adults and younger adults with physical disabilities, as a lower-cost alternative to nursing home placement, administered by the Illinois Department of Healthcare and Family Services.",
      },
      {
        question: "Who qualifies for supportive living in Illinois?",
        answer:
          "Generally, adults 65 and older, or adults 22-64 with a physical disability, who meet Medicaid's income and asset limits and a required level-of-care assessment. Eligibility rules can change, so confirm current requirements directly with HFS or the facility.",
      },
      {
        question: "Does Medicaid cover the full cost of supportive living?",
        answer:
          "Medicaid covers the service and care costs under the program. Residents typically contribute toward room and board based on their income (for most, this is their Social Security/SSI income minus a small personal needs allowance) -- confirm the specific arrangement with the facility.",
      },
    ],
  },
  "nursing-homes": {
    intro: [
      "Nursing homes -- also called skilled nursing facilities -- provide 24-hour medical and nursing care for people who need more than assisted living can offer: post-hospital rehabilitation, complex medication management, wound care, or long-term custodial care for advanced medical needs. Unlike assisted living, nursing homes are certified and closely tracked by the federal government, not just the state.",
      "Every Medicare- and Medicaid-certified nursing home in the country reports detailed data to the Centers for Medicare & Medicaid Services (CMS): certified bed count, staffing hours per resident, health inspection results, and a 5-star quality rating covering overall performance, health inspections, staffing, and clinical quality measures.",
      "That CMS data is the backbone of the listings on this page -- star ratings, deficiency counts from the most recent inspection, and any fines or penalties on record -- turned into plain language rather than left as raw regulatory codes.",
    ],
    faqs: [
      {
        question: "What is a CMS star rating?",
        answer:
          "It's a 1-to-5-star score Medicare publishes for every certified nursing home, combining an overall rating with three component scores: health inspections, staffing levels, and clinical quality measures. Five stars is \"much above average\"; one star is \"much below average.\"",
      },
      {
        question: "How do I read a nursing home's inspection report?",
        answer:
          "Look at how many deficiencies were cited on the most recent standard health inspection, whether any were serious enough to trigger a fine or payment denial, and how recently the inspection happened. Our facility pages summarize this in plain language directly from the CMS record.",
      },
      {
        question: "What's the difference between a nursing home and assisted living?",
        answer:
          "Nursing homes provide 24/7 skilled nursing and medical care and are certified by Medicare/Medicaid. Assisted living is for people who need help with daily activities but not continuous medical supervision, and in Illinois is licensed by the state (IDPH) rather than certified federally.",
      },
    ],
  },
};
