import { NextRequest, NextResponse } from "next/server";
import { getStripe, PAYMENTS_ENABLED } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!PAYMENTS_ENABLED) {
    return NextResponse.json({ error: "Payments are not yet enabled." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const customerId = typeof body?.customerId === "string" ? body.customerId : null;
  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId." }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = req.nextUrl.origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
