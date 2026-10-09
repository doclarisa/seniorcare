import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendLeadEmail(opts: {
  to: string;
  facilityName: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
}) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — inquiry saved but not emailed.", opts);
    return { skipped: true };
  }
  return resend.emails.send({
    from: process.env.LEAD_FROM_EMAIL ?? "leads@chicagocareforseniors.com",
    to: opts.to,
    subject: `New inquiry for ${opts.facilityName}`,
    text: `Name: ${opts.name}\nEmail: ${opts.email}\nPhone: ${opts.phone ?? "N/A"}\n\nMessage:\n${opts.message ?? "(no message)"}`,
  });
}

const WORKSHEET_URL = "https://www.chicagocareforseniors.com/downloads/il-assisted-living-worksheet.pdf";
const EBOOK_URL = "https://www.chicagocareforseniors.com/downloads/how-to-pay-for-assisted-living-in-illinois.pdf";

export async function sendWorksheetEmail(opts: { to: string; firstName?: string | null }) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — worksheet lead saved but not emailed.", opts);
    return { skipped: true };
  }
  const greeting = opts.firstName ? `Hi ${opts.firstName},` : "Hi,";
  return resend.emails.send({
    from: process.env.LEAD_FROM_EMAIL ?? "leads@chicagocareforseniors.com",
    to: opts.to,
    subject: "Your free Illinois assisted living cost & eligibility worksheet",
    text: `${greeting}\n\nHere's your free worksheet: ${WORKSHEET_URL}\n\nIt walks through the real monthly cost of assisted living in Illinois, Medicaid spend-down, spousal protections, VA benefits, and the Supportive Living Program.\n\nWhen it's helpful to talk it through, we're here at no cost to your family: https://www.chicagocareforseniors.com/contact\n\n— Chicago Care for Seniors`,
  });
}

export async function sendEbookEmail(opts: { to: string; firstName?: string | null }) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — ebook lead saved but not emailed.", opts);
    return { skipped: true };
  }
  const greeting = opts.firstName ? `Hi ${opts.firstName},` : "Hi,";
  return resend.emails.send({
    from: process.env.LEAD_FROM_EMAIL ?? "leads@chicagocareforseniors.com",
    to: opts.to,
    subject: "Your free copy of \"How to Pay for Assisted Living in Illinois Without Going Broke\"",
    text: `${greeting}\n\nHere's your free copy of the book: ${EBOOK_URL}\n\nIt walks through Medicaid spend-down and the five-year look-back, protections for the spouse who stays home, VA Pension with Aid & Attendance, and Illinois' Supportive Living Program — using plain-language examples, not legal jargon.\n\nWhen it's helpful to talk it through, we're here at no cost to your family: https://www.chicagocareforseniors.com/contact\n\n— Larisa Huhman, Chicago Care for Seniors`,
  });
}
