import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SUBMIT_LIMIT = 5;
const SUBMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const { allowed, retryAfterSeconds } = rateLimit(`contact:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  // Hardcoded fallback rather than requiring SITE_CONTACT_EMAIL to be set
  // correctly in every environment -- the site owner needs contact form
  // submissions to reliably reach her regardless of whether that env var
  // is configured in Vercel, so the destination is guaranteed correct at
  // the code level, with the env var only as an override.
  const siteContact = process.env.SITE_CONTACT_EMAIL || "larisahuhman@gmail.com";
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
