import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, PAYMENTS_ENABLED, priceIdFor, type PaidTierKey } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  if (!PAYMENTS_ENABLED) {
    return NextResponse.json({ error: "Payments are not yet enabled." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const facilityId = typeof body?.facilityId === "string" ? body.facilityId : null;
  const tier = typeof body?.tier === "string" ? (body.tier as PaidTierKey) : null;
  if (!facilityId || !tier) {
    return NextResponse.json({ error: "Missing facilityId or tier." }, { status: 400 });
  }

  const priceId = priceIdFor(tier);
  if (!priceId) {
    return NextResponse.json({ error: `No Stripe price configured for tier "${tier}".` }, { status: 400 });
  }

  const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!facility) {
    return NextResponse.json({ error: "Facility not found." }, { status: 404 });
  }

  const stripe = getStripe();
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/facility/${facility.slug}?upgrade=success`,
    cancel_url: `${origin}/pricing?upgrade=cancelled`,
    client_reference_id: facility.id,
    customer_email: facility.email ?? undefined,
    metadata: { facilityId: facility.id, tier },
  });

  return NextResponse.json({ url: session.url });
}
