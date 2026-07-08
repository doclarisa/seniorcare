import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, PAYMENTS_ENABLED, type PaidTierKey } from "@/lib/stripe";

async function applyUpgrade(facilityId: string, tier: PaidTierKey) {
  const data: Record<string, unknown> = {};
  if (tier === "featured") data.tier = "FEATURED";
  if (tier === "verified") data.verified = true;
  if (tier === "photos") data.photosUnlocked = true;
  if (tier === "leads") data.leadDeliveryOn = true;
  await prisma.facility.update({ where: { id: facilityId }, data });
}

export async function POST(req: NextRequest) {
  if (!PAYMENTS_ENABLED) {
    // Dormant: acknowledge without processing so a stray test event isn't retried forever.
    return NextResponse.json({ received: true, skipped: "payments dormant" });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature/secret." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const facilityId = session.metadata?.facilityId;
    const tier = session.metadata?.tier as PaidTierKey | undefined;
    if (facilityId && tier) {
      await applyUpgrade(facilityId, tier);
    }
  }

  return NextResponse.json({ received: true });
}
