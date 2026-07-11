export interface GuideTable {
  headers: string[];
  rows: (string | { text: string; href?: string })[][];
}

export interface GuideSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
  table?: GuideTable;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface GuideContent {
  sections: GuideSection[];
  faqs: GuideFaq[];
  howTo?: { name: string; steps: HowToStep[] };
}

export const GUIDE_CONTENT: Record<string, GuideContent> = {
  "how-to-read-idph-inspection-reports": {
    sections: [
      {
        paragraphs: [
          "Every assisted living, shared housing, and nursing facility in Illinois is inspected by a state or federal regulator on a regular schedule -- and every one of those inspections becomes a public record. Almost nobody reads them, because they're written for regulators, not families: dense with survey codes, citation numbers, and bureaucratic shorthand. This guide translates the parts that actually matter.",
        ],
      },
      {
        heading: "What gets inspected, and by whom",
        paragraphs: [
          "Assisted living and shared housing establishments are licensed and surveyed by the Illinois Department of Public Health (IDPH). Nursing homes that accept Medicare or Medicaid are additionally certified and inspected under federal rules administered through the Centers for Medicare & Medicaid Services (CMS). A facility can appear in both systems -- e.g. a campus with an assisted living wing and a separate skilled-nursing wing -- with two separate inspection histories.",
          "IDPH surveys aren't all the same type. The three you'll see most often on a facility's record are a routine annual licensure survey, a complaint investigation (triggered by a specific complaint filed against the facility), and a facility-reported incident review (triggered by the facility itself reporting something to the state, as it's required to for certain events).",
        ],
      },
      {
        heading: "Decoding the terms",
        paragraphs: [
          "A few terms come up on almost every record:",
        ],
        list: [
          "Survey ID / Exit Date — the date inspectors finished the on-site portion of a given survey. This is the closest thing to \"when was this place last checked.\"",
          "Survey type — what triggered the visit. \"Annual Licensure Only\" is routine; anything with \"COI\" (Complaint Original Investigation) or \"FRI\" (Facility Reported Incident) means something specific was being looked into, not a routine check-in.",
          "Form 2567 (\"Statement of Deficiencies\") — the actual document listing what inspectors found wrong, if anything. A survey with no Form 2567 attached generally means no deficiencies were cited on that visit.",
          "Deficiency / citation — a specific instance where inspectors determined the facility fell short of a regulatory requirement. Citations range widely in severity, from a paperwork/documentation issue to a resident-safety finding.",
        ],
      },
      {
        heading: "What a citation does — and doesn't — tell you",
        paragraphs: [
          "A citation is a fact, not a verdict. Context matters more than the raw count: how recent it is, whether it was a single documentation lapse or a pattern, and whether the facility corrected it (most citations require and get a plan of correction). A facility with zero citations isn't automatically superior to one with a minor, corrected citation from two years ago -- but a facility with repeated, recent, serious findings is a real signal worth asking the facility about directly, by name, before you decide.",
          "For CMS-certified nursing homes specifically, the federal 5-star rating system folds inspection results, staffing data, and clinical quality measures into a single score, which makes comparison easier than reading raw survey text. Illinois's IDPH licensing data for assisted living and shared housing doesn't have an equivalent star rating -- you're reading the underlying survey history directly, which is exactly what we summarize in plain language on every facility page sourced from IDPH.",
        ],
      },
      {
        heading: "Pulling up the real record yourself",
        paragraphs: [
          "We link every government-sourced facility page back to its source. For assisted living and shared housing, that's IDPH's Facility Lookup portal at llcs.dph.illinois.gov. For nursing homes, it's CMS's Care Compare tool. Both let you search by facility name and read the underlying survey documents directly -- worth doing for any facility you're seriously considering, especially if it's been a while since our \"last verified\" date.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is Form 2567?",
        answer:
          "It's the standard \"Statement of Deficiencies\" form regulators attach to a survey when they cite a facility for falling short of a requirement. If a survey has no Form 2567 attached, that generally means no deficiencies were found on that visit.",
      },
      {
        question: "Does a citation automatically mean I should avoid a facility?",
        answer:
          "No. Look at the pattern: how recent, how severe, whether it was a single incident or repeated, and whether it was corrected. A single older, minor, corrected citation is very different from multiple recent, serious findings. When in doubt, ask the facility directly about a specific citation you're concerned about.",
      },
      {
        question: "How often are facilities inspected in Illinois?",
        answer:
          "Licensed assisted living and shared housing establishments generally receive an annual licensure survey at minimum, plus additional visits any time a complaint or reportable incident triggers an investigation. CMS-certified nursing homes are subject to a standard survey roughly annually as well, on a schedule set federally.",
      },
      {
        question: "What's the difference between a complaint investigation and a routine survey?",
        answer:
          "A routine (\"Annual Licensure Only\") survey is a scheduled check-in that happens regardless of any specific concern. A complaint investigation (COI) or facility-reported incident (FRI) review happens because something specific was reported -- either by an outside party filing a complaint, or by the facility itself, which is required to self-report certain events.",
      },
    ],
  },

  "supportive-living-program-illinois": {
    sections: [
      {
        paragraphs: [
          "If you've been told a loved one needs \"assisted living\" but can't afford private pay and assume nursing home Medicaid is the only public option, there's a program worth knowing about: Illinois's Supportive Living Program (SLP). It's a state Medicaid benefit that funds apartment-style assisted-living-equivalent housing, and most families have never heard of it -- largely because, unlike private-pay assisted living, it generates no referral fees for the directories and placement services that dominate search results.",
        ],
      },
      {
        heading: "What it actually is",
        paragraphs: [
          "Supportive Living is run by the Illinois Department of Healthcare and Family Services (HFS), not by IDPH (the agency that licenses conventional assisted living). Approved Supportive Living establishments provide private or semi-private apartments, meals, personal care assistance, medication oversight, and 24-hour staff availability -- functionally similar to private-pay assisted living, but paid for through Medicaid for residents who qualify.",
          "Some Supportive Living communities also carry a dementia-care designation (sometimes shown as \"DCS\" in state records) for residents with Alzheimer's or another dementia. Others are specifically designed for younger adults (22–64) with physical disabilities rather than the general 65-and-older population -- a distinction worth checking, since not every SLP building serves both groups.",
        ],
      },
      {
        heading: "Who qualifies",
        paragraphs: [
          "Eligibility generally requires being 65 or older (or 22–64 with a qualifying physical disability), meeting Medicaid's income and asset limits, and meeting a required level-of-care assessment showing the applicant needs the kind of help Supportive Living provides. Because Medicaid eligibility rules and income limits are updated periodically, confirm current numbers directly with HFS or with a Supportive Living facility's admissions staff rather than relying on a fixed figure from any single source, including this one.",
        ],
      },
      {
        heading: "What residents actually pay",
        paragraphs: [
          "Medicaid covers the service and care costs. Most residents contribute toward room and board out of their own income (commonly Social Security or SSI), minus a small personal needs allowance set by the state -- the specifics depend on the individual's income and should be confirmed with the facility and HFS directly.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Supportive Living the same as a nursing home?",
        answer:
          "No. It's designed as a lower-cost, more independent alternative to nursing home placement for people who need help with daily living but not the level of 24/7 skilled medical care a nursing home provides.",
      },
      {
        question: "Who qualifies for Supportive Living in Illinois?",
        answer:
          "Generally, adults 65 and older, or adults 22–64 with a physical disability, who meet Medicaid's income and asset limits and a required level-of-care assessment. Confirm current requirements directly with HFS or the facility, since eligibility rules can change.",
      },
      {
        question: "How is this different from regular assisted living?",
        answer:
          "The care model is similar. The difference is funding and regulation: conventional assisted living is private-pay and licensed by IDPH; Supportive Living is Medicaid-funded and administered by HFS. A resident who can't afford private-pay assisted living may still qualify for an equivalent level of care through Supportive Living.",
      },
      {
        question: "Are all Supportive Living communities the same?",
        answer:
          "No. Some serve the general 65-and-older population, some specifically serve younger adults with physical disabilities, and some carry an additional dementia-care designation. Check which population a specific community serves before assuming it fits your situation.",
      },
    ],
  },

  "cost-of-assisted-living-illinois": {
    sections: [
      {
        paragraphs: [
          "Senior living pricing is confusing on purpose, in the sense that almost no facility publishes a simple number -- and the number that does get published is often a \"starting from\" figure that doesn't reflect what most residents actually pay. Here's how the pricing is actually structured, and where the real low-cost option that most cost guides skip entirely.",
        ],
      },
      {
        heading: "How pricing is typically structured",
        paragraphs: [
          "Most assisted living communities price in layers rather than one flat fee: a base rate that covers the apartment, meals, and standard amenities, plus a care-level charge added on top based on how much hands-on assistance a resident needs (bathing, medication management, mobility support, and similar). Many communities also charge a one-time community or move-in fee. This is why the advertised \"starting at\" price is often well below what a resident with real care needs ends up paying -- the base rate assumes minimal care, and most residents need more than that.",
          "Memory care units typically cost more than standard assisted living at the same community, reflecting higher staffing ratios and specialized programming. Continuing Care Retirement Communities (CCRCs) often use a different model entirely, sometimes involving a large upfront entrance fee (frequently partially refundable) plus a smaller ongoing monthly fee -- structurally very different from a straightforward monthly rent-plus-care-level model, and worth not confusing with it when comparing prices.",
        ],
      },
      {
        heading: "What our own directory shows",
        paragraphs: [
          "Of the hand-curated communities in our directory with a facility-confirmed or reliably sourced starting price, monthly rates ranged from roughly $2,500 to $7,900, depending on county, care level, and room type. That range is illustrative, not a market survey -- it reflects a small number of facilities that publish pricing, not a comprehensive sample of the region, and most facilities in our full directory (including every government-sourced listing) don't have price data available at all, since Illinois's state licensing and federal inspection records don't collect cost information. Treat any single number you see anywhere, including here, as a starting point for a direct conversation with a facility, not a quote.",
        ],
      },
      {
        heading: "The option most cost guides leave out",
        paragraphs: [
          "If private-pay assisted living is out of reach, Illinois's Medicaid-funded Supportive Living Program funds an equivalent level of apartment-style care for residents who qualify financially and medically -- see our guide to the Supportive Living Program for how it works and who's eligible. It's a genuinely different cost structure, not just a discount, and it's the option most families in a cost-driven search never hear about.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do assisted living prices vary so much between communities?",
        answer:
          "Location, the level of care a specific resident needs (not just the community's base rate), room type (private vs. shared), and whether the community is a standalone assisted living building versus part of a larger CCRC campus all affect price significantly. Two communities advertising similar \"starting at\" rates can end up costing very differently once a resident's actual care needs are priced in.",
      },
      {
        question: "Does Medicare pay for assisted living?",
        answer:
          "Generally no. Medicare doesn't cover the room-and-board cost of assisted living. It may cover specific medical services delivered there, but not the residential care itself.",
      },
      {
        question: "Is there a lower-cost alternative to private-pay assisted living in Illinois?",
        answer:
          "Yes -- Illinois's Medicaid-funded Supportive Living Program, for residents who meet income, asset, and level-of-care requirements. It provides an apartment-style, assisted-living-equivalent level of care without private-pay pricing.",
      },
      {
        question: "What's the difference between a \"starting at\" price and what I'll actually pay?",
        answer:
          "The advertised rate typically covers the base apartment and minimal care. Most residents need an additional care-level charge on top, based on their specific needs, so the real monthly cost is often higher than the headline number. Always ask a facility for an all-in estimate based on the specific resident's needs, not just the published starting rate.",
      },
    ],
  },

  "how-to-pay-for-senior-care-illinois": {
    sections: [
      {
        paragraphs: [
          "Most families paying for senior care are combining more than one source: some private funds, and one or more public or insurance benefits. Here's what each of the major options actually covers in Illinois, and — just as important — what each one doesn't.",
        ],
      },
      {
        heading: "Medicaid (nursing home benefit)",
        paragraphs: [
          "Illinois Medicaid covers nursing home care for residents who meet income, asset, and level-of-care eligibility requirements. This is the traditional path for long-term nursing home coverage once a resident's own funds are exhausted (or if they qualify from the start), and it's separate from the Supportive Living Program described below.",
        ],
      },
      {
        heading: "The Supportive Living Program",
        paragraphs: [
          "For residents who need assisted-living-level care rather than skilled nursing, Illinois's HFS-administered Supportive Living Program is a Medicaid-funded alternative that keeps residents in an apartment-style setting rather than a nursing home. See our full guide to the Supportive Living Program for eligibility and what it covers.",
        ],
      },
      {
        heading: "VA Aid & Attendance",
        paragraphs: [
          "Wartime veterans and their surviving spouses who meet service, income, and care-need requirements may qualify for the VA's Aid & Attendance benefit, an additional monthly payment on top of a standard VA pension intended to help cover the cost of long-term care, including assisted living. It's a federal benefit administered by the VA, not a state program, and has its own separate application process through the VA directly.",
        ],
      },
      {
        heading: "Long-term care insurance",
        paragraphs: [
          "Some families have a long-term care insurance policy purchased years in advance of needing it. Coverage, waiting periods, and daily/monthly benefit caps vary enormously by policy, so the only reliable way to know what a specific policy covers is to contact the insurer directly and ask what triggers a claim (typically an inability to perform a set number of \"activities of daily living\" without assistance, or a cognitive impairment diagnosis) and what the payout structure looks like.",
        ],
      },
      {
        heading: "Private pay",
        paragraphs: [
          "Many families start with private funds -- savings, a home sale, or family contributions -- even if they expect to eventually transition to Medicaid once those funds are spent down. If that's the likely path, ask a facility directly, early, whether it accepts Medicaid (and specifically the Supportive Living Program, if relevant) once private funds run out, since not every community does.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Medicare pay for long-term senior care?",
        answer:
          "Generally no, for custodial/long-term care. Medicare covers short-term skilled nursing or rehabilitation stays under specific conditions (typically following a qualifying hospital stay), but not ongoing assisted living or long-term nursing home custodial care.",
      },
      {
        question: "What's the difference between Medicaid nursing home coverage and the Supportive Living Program?",
        answer:
          "Both are Medicaid-funded, but they cover different settings: the nursing home benefit covers skilled nursing facility care, while the Supportive Living Program covers an apartment-style, assisted-living-equivalent setting for residents who don't need that level of medical care.",
      },
      {
        question: "How do I find out if a specific facility accepts Medicaid?",
        answer:
          "Ask the facility directly, and specifically ask whether it accepts the Supportive Living Program (for assisted-living-level care) or is Medicaid-certified for nursing home care -- these are different questions with different answers, and a facility can be certified for one without the other.",
      },
      {
        question: "Can I combine VA Aid & Attendance with Medicaid?",
        answer:
          "Rules on combining VA benefits with Medicaid can be complex and situation-specific. Talk to the VA directly and, ideally, a benefits counselor familiar with both programs before assuming how they interact for your specific situation.",
      },
    ],
  },

  "assisted-living-vs-nursing-home": {
    sections: [
      {
        paragraphs: [
          "\"Assisted living\" and \"nursing home\" get used interchangeably in casual conversation, but they're different levels of care, regulated by different agencies, at different price points. Getting this right matters, because choosing the wrong level of care either means paying for medical infrastructure a resident doesn't need, or leaving them somewhere that can't actually handle their needs.",
        ],
      },
      {
        heading: "The core difference: medical care vs. daily living support",
        paragraphs: [
          "Assisted living is built around help with activities of daily living -- bathing, dressing, medication reminders, meals, mobility -- for residents who are largely independent but need some support. It is not a medical facility: there's no round-the-clock skilled nursing staff, and residents generally manage their own healthcare with outside providers.",
          "A nursing home (skilled nursing facility) provides 24-hour medical and nursing care on-site, for residents recovering from a hospitalization, managing a complex medical condition, or requiring ongoing skilled care that assisted living staff aren't licensed to provide -- wound care, IV medication management, post-surgical rehabilitation, and similar.",
        ],
      },
      {
        heading: "Different regulators, different data",
        paragraphs: [
          "In Illinois, assisted living and shared housing establishments are licensed by the state (IDPH). Nursing homes that accept Medicare or Medicaid are certified federally, through CMS, which is also why nursing homes have the 5-star rating system and detailed staffing/inspection datasets that assisted living doesn't have an equivalent of. This isn't a quality signal in either direction -- it reflects that they're fundamentally different types of licensed facility, reported through different systems.",
        ],
      },
      {
        heading: "How to tell which one you need",
        paragraphs: [
          "A useful starting question: does this person need help doing things, or do they need ongoing medical treatment? If it's mainly the former -- getting dressed, remembering medications, preparing meals -- assisted living (potentially with a memory care designation, if dementia is involved) is usually the right level. If it's the latter -- recovering from surgery, managing a condition that needs daily skilled nursing attention -- a nursing home is the appropriate setting. Many families move through both over time: a nursing home stay for rehabilitation after a hospitalization, followed by a return to assisted living once medical needs stabilize, or the reverse as needs increase over time.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can one facility offer both assisted living and nursing home care?",
        answer:
          "Yes -- often as part of a larger campus or Continuing Care Retirement Community (CCRC), with separately licensed/certified wings for each level of care, sometimes alongside independent living and memory care too.",
      },
      {
        question: "Is a nursing home always more expensive than assisted living?",
        answer:
          "Not necessarily in every individual case, but nursing home care is generally the more expensive setting given its higher staffing and medical infrastructure requirements. Medicaid coverage rules also differ significantly between the two, which affects what a family actually pays out of pocket.",
      },
      {
        question: "What happens if someone in assisted living develops a medical need beyond what the community can handle?",
        answer:
          "Assisted living communities generally have a policy for this -- often a required move to a higher level of care (memory care or a nursing home) if a resident's needs exceed what the community is licensed and staffed to provide. Ask about this policy directly when evaluating a community, before it becomes relevant.",
      },
      {
        question: "Does \"skilled nursing\" always mean long-term care?",
        answer:
          "No. Skilled nursing facilities also provide short-term rehabilitation stays, commonly following a hospitalization, for residents expected to recover and return home rather than stay long-term.",
      },
    ],
  },

  "memory-care-guide": {
    sections: [
      {
        paragraphs: [
          "Memory care gets marketed heavily, and not always accurately -- a locked door and the word \"memory\" in a community's name isn't the same as a real, staffed, purpose-built memory care program. Here's what actually distinguishes genuine memory care, and what to look for.",
        ],
      },
      {
        heading: "What memory care actually adds",
        paragraphs: [
          "On top of the personal-care help standard assisted living already provides, real memory care adds: a secured environment specifically designed to prevent residents from wandering into danger (not just a locked front door, but a layout designed around it); staff specifically trained in dementia care techniques, including how to de-escalate agitation and communicate with someone experiencing cognitive decline; and a daily structure built around consistency and cognitive engagement rather than a standard activities calendar.",
        ],
      },
      {
        heading: "How Illinois designates it",
        paragraphs: [
          "IDPH offers an Alzheimer's Special Care Program designation that assisted living and shared housing establishments can apply for, which requires disclosing specific staff training hours and programming details for residents with dementia. Not every facility with a secured memory care unit carries this formal designation -- it's worth asking a facility directly whether they hold it, and what their actual staff-to-resident ratio and dementia-specific training program looks like, rather than assuming based on marketing language alone.",
          "Illinois's Supportive Living Program has its own, separate dementia-care designation (sometimes shown as \"DCS\") for Medicaid-funded communities serving residents with dementia -- a different system from IDPH's Alzheimer's Special Care Program, covering a different (Medicaid-funded) type of community.",
        ],
      },
      {
        heading: "Questions that separate real memory care from a locked door",
        paragraphs: [
          "Ask directly: What is the staff-to-resident ratio, specifically on the memory care unit, and does it change at night? What specific training do direct-care staff receive in dementia care, and how often is it refreshed? What does a typical day actually look like for a resident -- structured, individualized programming, or an open common area with a TV on? What's the plan if a resident's needs progress beyond what the unit can safely manage?",
        ],
      },
    ],
    faqs: [
      {
        question: "Is memory care always more expensive than standard assisted living?",
        answer:
          "Generally yes, at the same community, reflecting the higher staffing ratios and specialized programming required. The exact difference varies by community.",
      },
      {
        question: "Does Illinois require special certification for memory care?",
        answer:
          "IDPH offers an optional Alzheimer's Special Care Program designation that assisted living facilities can seek, requiring disclosure of staff training and programming specifics. Not every facility marketing \"memory care\" holds this formal designation -- ask directly.",
      },
      {
        question: "What's the difference between memory care and a locked assisted living unit?",
        answer:
          "A secured door alone isn't memory care. Real memory care combines the secured environment with dementia-specific staff training, a higher staffing ratio, and programming designed around cognitive engagement -- ask about all three, not just whether the unit is locked.",
      },
      {
        question: "Can someone move from standard assisted living into memory care at the same community?",
        answer:
          "Often yes, if the community operates both, which is one advantage of choosing a community with an on-site memory care unit even if it's not needed immediately -- it avoids an additional full relocation later. Confirm this directly with any specific community, since not all offer both.",
      },
    ],
  },

  "questions-to-ask-on-a-facility-tour": {
    sections: [
      {
        paragraphs: [
          "A facility tour is designed to make a good first impression -- a nice lobby, a friendly greeting, fresh flowers in the common area. None of that tells you how residents are actually cared for on a Tuesday night when no one's touring. These are the questions that do.",
        ],
      },
      {
        heading: "Staffing",
        paragraphs: ["The single biggest driver of quality of care is staffing -- ask specifically, not just \"do you have enough staff.\""],
        list: [
          "What's the staff-to-resident ratio, and does it change overnight or on weekends?",
          "What's your staff turnover rate? High turnover often means residents are cared for by people who don't know them well.",
          "Who administers medications, and what's their training/licensure?",
          "What happens if a staff member calls in sick -- is there a reliable backup plan, or does the floor go short-staffed?",
        ],
      },
      {
        heading: "Care and health",
        paragraphs: ["Understand exactly what triggers a change in care level, cost, or a required move."],
        list: [
          "How do you assess what level of care a resident needs, and how often is that reassessed?",
          "What happens if my family member's needs increase — is there a point where they'd have to move to a different level of care?",
          "How do you handle a medical emergency, and how quickly can you get a resident to a hospital?",
          "Can I see the facility's most recent state inspection report, and is there anything on it you'd want to explain?",
        ],
      },
      {
        heading: "Daily life",
        paragraphs: ["This is where you find out what daily life is actually like, not just what the activities calendar says."],
        list: [
          "Can I see a typical daily schedule, and can I visit unannounced at a different time to see it in action?",
          "What's the food actually like -- can I eat a meal here, and are dietary restrictions genuinely accommodated?",
          "How do you handle disputes or complaints from residents or families, and can I talk to a current resident's family?",
          "What's included in the base rate, and what costs extra -- get this in writing, not verbally.",
        ],
      },
      {
        heading: "Before you decide",
        paragraphs: [
          "Pull the facility's actual state inspection and, for nursing homes, CMS rating data yourself before finalizing a decision -- see our guide on how to read an inspection report. A tour tells you how a place presents itself; the inspection record tells you what regulators actually found.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I visit more than once before deciding?",
        answer:
          "Yes, if possible -- a scheduled tour and an unannounced visit at a different time of day (especially evenings or weekends, when staffing is often lighter) can show two very different pictures of the same place.",
      },
      {
        question: "Is it reasonable to ask to see a facility's inspection report during a tour?",
        answer:
          "Yes -- it's public information either way, so asking directly is a reasonable way to gauge how transparent a facility is, in addition to looking the record up yourself.",
      },
      {
        question: "What's a red flag during a tour?",
        answer:
          "Vague or evasive answers about staffing ratios or turnover, reluctance to let you see a typical day or visit again at a different time, and an inability or unwillingness to clearly explain what's included in the base price versus billed separately.",
      },
    ],
    howTo: {
      name: "How to evaluate a senior living facility on a tour",
      steps: [
        { name: "Ask about staffing ratios and turnover", text: "Get specific numbers, not general reassurance, and ask how staffing changes overnight and on weekends." },
        { name: "Ask what triggers a care-level change or required move", text: "Understand the facility's policy before a health change forces the question." },
        { name: "Ask to see the facility's inspection record", text: "Request it directly, and separately look it up yourself via IDPH or CMS." },
        { name: "Observe daily life, not just the tour route", text: "Ask to see a typical schedule and consider visiting again, unannounced, at a different time of day." },
        { name: "Get pricing in writing", text: "Confirm exactly what's included in the base rate and what triggers additional charges before signing anything." },
      ],
    },
  },

  "nursing-home-quality-report-illinois": {
    sections: [
      {
        paragraphs: [
          "Every Medicare- and Medicaid-certified nursing home in the country reports detailed quality, staffing, and inspection data to CMS every month. We pulled the complete current CMS record for all 312 certified nursing homes across Cook, DuPage, Lake, Will, Kane, McHenry, and Kendall counties and analyzed it directly -- no sampling, no survey, just the full government dataset for the region. Here's what it actually shows.",
          "This is a snapshot of public CMS data as of our last pull; ratings and enforcement records change as new inspections happen. Every number below links back to the underlying facility pages, which show the current record and \"last verified\" date for that specific home.",
        ],
      },
      {
        heading: "Nearly half of nursing homes in the region rate below average",
        paragraphs: [
          "CMS's 5-star system rates 1 as \"much below average\" and 5 as \"much above average.\" Across the 312 facilities we tracked, the overall-rating distribution skews low: 82 facilities (26%) hold the lowest 1-star rating, and another 65 (21%) hold 2 stars -- meaning 47% of nursing homes in the region rate below average on CMS's own scale, against 57 facilities (18%) at the top 5-star tier.",
        ],
        table: {
          headers: ["Overall rating", "Number of facilities", "Share of total"],
          rows: [
            ["1 star", "82", "26%"],
            ["2 stars", "65", "21%"],
            ["3 stars", "52", "17%"],
            ["4 stars", "55", "18%"],
            ["5 stars", "57", "18%"],
          ],
        },
      },
      {
        heading: "Ratings vary sharply by county",
        paragraphs: [
          "The regional average obscures real differences by county. Cook County -- both the largest facility count and the lowest average rating in the region -- has 52% of its nursing homes at 1 or 2 stars. The collar counties fare meaningfully better on average, though every county in the region has at least a third of its facilities in the below-average tier.",
        ],
        table: {
          headers: ["County", "Facilities", "Average rating", "Share at 1-2 stars"],
          rows: [
            ["Cook", "198", "2.65", "52%"],
            ["Will", "16", "2.75", "50%"],
            ["Kane", "24", "3.00", "38%"],
            ["Kendall", "2", "3.00", "50%"],
            ["McHenry", "10", "3.10", "40%"],
            ["DuPage", "38", "3.16", "37%"],
            ["Lake", "23", "3.26", "35%"],
          ],
        },
      },
      {
        heading: "The ownership gap",
        paragraphs: [
          "The single sharpest split in the data isn't geography -- it's ownership. Non-profit and government-operated nursing homes in the region average 4.32 and 4.33 stars respectively; for-profit facilities, which make up the large majority of homes in the region (267 of 312), average just 2.56 stars. That's not a subtle difference: it's the gap between \"below average\" and \"above average\" on CMS's own scale, tracking almost exactly with who owns the building.",
          "This is a pattern, not proof of causation for any individual facility -- ownership type is one input CMS's rating already reflects indirectly through staffing and inspection outcomes, not a separate penalty. But it's a large, consistent gap across a real sample of 267 for-profit vs. 44 non-profit/government facilities, and it's worth knowing before assuming an unfamiliar facility name is representative of the broader pattern in either direction.",
        ],
        table: {
          headers: ["Ownership type", "Facilities", "Average rating"],
          rows: [
            ["For-profit", "267", "2.56"],
            ["Non-profit", "41", "4.32"],
            ["Government", "3", "4.33"],
          ],
        },
      },
      {
        heading: "$31.6 million in fines, concentrated but not isolated",
        paragraphs: [
          "CMS tracks fines and other enforcement penalties (like payment denials) against nursing homes that fail to correct serious deficiencies. Across the region, facilities have accumulated $31,614,866 in total fines on record, spread across 887 separate penalty actions. Two-thirds of nursing homes in the region (205 of 312, 66%) have at least one fine on record -- this isn't a small number of outliers; it's the norm, not the exception, though the size of individual fines varies enormously. The largest single fine in the dataset accounts for under 3% of the regional total, so this isn't one facility skewing the picture.",
        ],
      },
      {
        heading: "The most-fined facilities in the region",
        paragraphs: [
          "These are the eight facilities with the largest cumulative CMS fines on record in our dataset. A large fine reflects CMS's own enforcement action following a serious, substantiated deficiency -- click through to each facility's page for its full inspection summary and current record, not just the fine total.",
        ],
        table: {
          headers: ["Facility", "County", "Total fines on record"],
          rows: [
            [{ text: "Chicago Ridge SNF", href: "/facility/chicago-ridge-snf-chicago-ridge" }, "Cook", "$883,180"],
            [{ text: "Morgan Park Healthcare", href: "/facility/morgan-park-healthcare-chicago" }, "Cook", "$631,885"],
            [{ text: "Austin Oasis, The", href: "/facility/austin-oasis-the-chicago" }, "Cook", "$607,298"],
            [{ text: "Archer Heights Healthcare", href: "/facility/archer-heights-healthcare-chicago" }, "Cook", "$596,515"],
            [{ text: "River View Rehab Center", href: "/facility/river-view-rehab-center-elgin" }, "Kane", "$591,676"],
            [{ text: "Pearl of Orchard Valley", href: "/facility/pearl-of-orchard-valley-aurora" }, "Kane", "$542,423"],
            [{ text: "Bria of Elmwood Park", href: "/facility/bria-of-elmwood-park-elmwood-park" }, "Cook", "$527,279"],
            [{ text: "Landmark of Richton Park Rehab & Nsg Ctr", href: "/facility/landmark-of-richton-park-rehab-nsg-ctr-richton-park" }, "Cook", "$519,652"],
          ],
        },
      },
      {
        heading: "Methodology",
        paragraphs: [
          "Source: CMS Provider Data Catalog, Nursing Home Provider Information dataset, filtered to Cook, DuPage, Lake, Will, Kane, McHenry, and Kendall counties (312 certified nursing homes). Ratings, deficiency counts, and fines are CMS's own published figures, not our estimates. Ownership-type categorization groups CMS's more granular ownership categories (e.g. \"For profit - Limited Liability company,\" \"Non profit - Corporation\") into three buckets: for-profit, non-profit, and government. See our full methodology for how this fits into the rest of our data pipeline, and how often it's refreshed.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where does this data come from?",
        answer:
          "The Centers for Medicare & Medicaid Services (CMS) Provider Data Catalog, specifically the Nursing Home Provider Information dataset -- the same federal dataset that powers Medicare's official Care Compare tool. We pulled the complete record for all certified nursing homes in the seven counties covered, not a sample.",
      },
      {
        question: "Does a low CMS rating mean a facility is unsafe?",
        answer:
          "Not automatically -- a low rating reflects a combination of inspection findings, staffing levels, and quality measures relative to other facilities nationally, not a single safety judgment. It's a strong starting signal, not a final verdict; always look at a specific facility's full record, including how recent any findings are, before drawing a conclusion.",
      },
      {
        question: "Why do for-profit nursing homes rate lower on average?",
        answer:
          "The data shows a large, consistent gap, but we can't say from this dataset alone why it exists for every individual facility -- staffing levels (which factor into the rating directly) are one plausible mechanistic link, since staffing costs are often the largest controllable expense for an operator. It's a real pattern worth knowing, not proof about any single facility.",
      },
      {
        question: "How often is this report updated?",
        answer:
          "We re-pull CMS's dataset on the same refresh cycle described in our methodology (CMS itself refreshes monthly). Check the \"last verified\" date on any individual facility page for that facility's specific current record.",
      },
    ],
  },
};
