// Builds plain-language inspection summaries strictly from real, retrieved
// fields (IDPH survey history, CMS ratings/deficiencies/penalties) -- never
// from inference. This is the "differentiator" enrichment from the import
// plan §7, written as a deterministic template rather than a free-form LLM
// pass, specifically to avoid any risk of a model inventing a specific date,
// count, or finding that isn't actually in the source record.

function parseMMDDYYYY(s) {
  if (!s) return null;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
}

export function summarizeIdphSurveys(surveys) {
  if (!surveys || surveys.length === 0) return null;
  const withDates = surveys
    .map((s) => ({ ...s, _date: parseMMDDYYYY(s.exitDate) }))
    .filter((s) => s._date)
    .sort((a, b) => b._date - a._date);
  if (withDates.length === 0) return null;

  const mostRecent = withDates[0];
  const complaintCount = withDates.filter((s) => /complaint|COI|FRI/i.test(s.surveyType ?? "")).length;
  const deficiencyCount = withDates.filter((s) => (s.documents ?? []).some((d) => /2567/.test(d))).length;

  const mostRecentTypeLabel = mostRecent.surveyType
    ? mostRecent.surveyType.replace(/^[^=]+=\s*/, "")
    : "a licensure survey (type not recorded)";
  const dateLabel = mostRecent.exitDate;

  let summary = `Illinois state inspectors most recently surveyed this facility on ${dateLabel} (${mostRecentTypeLabel}). `;
  summary += `IDPH's record shows ${withDates.length} survey${withDates.length === 1 ? "" : "s"} on file`;
  if (complaintCount > 0) {
    summary += `, including ${complaintCount} complaint or incident investigation${complaintCount === 1 ? "" : "s"}`;
  }
  summary += ". ";
  if (deficiencyCount > 0) {
    // "survey(s)" here refers back to the *total* set on file ("these
    // surveys"), so pluralize on withDates.length, not deficiencyCount.
    summary += `${deficiencyCount} of these survey${withDates.length === 1 ? "" : "s"} resulted in a formal statement of deficiencies (Form 2567).`;
  } else {
    summary += "None of the surveys on file show a formal statement of deficiencies (Form 2567) attached.";
  }
  return summary;
}

export function summarizeCms(cmsRecord) {
  if (!cmsRecord) return null;
  const overall = cmsRecord.overallRating;
  const health = cmsRecord.healthInspectionRating;
  const staffing = cmsRecord.staffingRating;
  const qm = cmsRecord.qmRating;
  const deficiencies = cmsRecord.totalNumberHealthDeficiencies_cycle1;
  const fines = Number(cmsRecord.numberOfFines || 0);
  const finesAmount = Number(cmsRecord.totalFinesDollars || 0);
  const penalties = Number(cmsRecord.totalNumberOfPenalties || 0);

  let summary = "";
  if (overall) {
    summary += `On CMS's federal nursing home rating system, this facility holds an overall ${overall}-star rating`;
    const parts = [];
    if (health) parts.push(`health inspections: ${health} stars`);
    if (staffing) parts.push(`staffing: ${staffing} stars`);
    if (qm) parts.push(`quality measures: ${qm} stars`);
    if (parts.length) summary += ` (${parts.join(", ")})`;
    summary += ". ";
  }
  if (deficiencies !== null && deficiencies !== undefined) {
    summary += `The most recent standard health inspection identified ${deficiencies} deficienc${deficiencies === "1" ? "y" : "ies"}. `;
  }
  if (penalties > 0) {
    summary += `CMS records ${penalties} penalt${penalties === 1 ? "y" : "ies"} against this facility`;
    if (fines > 0) summary += `, including ${fines} fine${fines === 1 ? "" : "s"} totaling $${finesAmount.toLocaleString()}`;
    summary += ".";
  } else if (overall) {
    summary += "CMS records no payment denials or fines against this facility.";
  }
  return summary.trim() || null;
}

export function combineSummaries(parts) {
  return parts.filter(Boolean).join(" ") || null;
}
