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
