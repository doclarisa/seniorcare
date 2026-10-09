import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEbookEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  company: z.string().optional(), // honeypot -- must stay empty
});

const SUBMIT_LIMIT = 5;
const SUBMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const { allowed, retryAfterSeconds } = rateLimit(`ebook:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const { email, first_name, company } = parsed.data;

  if (company) {
    // Honeypot tripped -- pretend success, do nothing.
    return NextResponse.json({ ok: true });
  }

  await prisma.worksheetLead.upsert({
    where: { email },
    create: { email, firstName: first_name || null, source: "ebook" },
    update: { source: "ebook" },
  });

  await sendEbookEmail({ to: email, firstName: first_name });

  return NextResponse.json({ ok: true });
}
