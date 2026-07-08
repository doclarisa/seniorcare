import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  const siteContact = process.env.SITE_CONTACT_EMAIL;
  if (resend && siteContact) {
    await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL ?? "site@chicagocareforseniors.com",
      to: siteContact,
      subject: `Site contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
  } else {
    console.log("[contact] Resend/SITE_CONTACT_EMAIL not configured — message logged only.", {
      name,
      email,
      message,
    });
  }

  return NextResponse.json({ ok: true });
}
