import Stripe from "stripe";

export const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === "true";

let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  if (!cachedStripe) {
    cachedStripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return cachedStripe;
}

export type PaidTierKey = "featured" | "verified" | "photos" | "leads";

const TIER_PRICE_ENV: Record<PaidTierKey, string> = {
  featured: "STRIPE_PRICE_FEATURED",
  verified: "STRIPE_PRICE_VERIFIED",
  photos: "STRIPE_PRICE_PHOTOS",
  leads: "STRIPE_PRICE_LEADS",
};

export function priceIdFor(tier: PaidTierKey): string | null {
  return process.env[TIER_PRICE_ENV[tier]] ?? null;
}

export function tierKeyForPriceId(priceId: string): PaidTierKey | null {
  for (const key of Object.keys(TIER_PRICE_ENV) as PaidTierKey[]) {
    if (process.env[TIER_PRICE_ENV[key]] === priceId) return key;
  }
  return null;
}

export const PRICING_PLANS: { key: PaidTierKey; name: string; blurb: string }[] = [
  {
    key: "featured",
    name: "Featured",
    blurb:
      "Priority placement at the top of relevant searches, highlighted card styling, and a Featured ribbon.",
  },
  {
    key: "verified",
    name: "Verified",
    blurb: "A trust badge shown once you confirm your details and licensure with us.",
  },
  {
    key: "photos",
    name: "Photo Gallery",
    blurb: "Unlock multiple photos and a longer description on your listing.",
  },
  {
    key: "leads",
    name: "Lead Delivery",
    blurb: "Family inquiries from your listing page get emailed straight to you.",
  },
];
