export function formatPrice(priceMin: number | null, estimate: boolean): string | null {
  if (priceMin == null) return null;
  const amount = `$${priceMin.toLocaleString()}/mo`;
  return estimate ? `From ~${amount} (estimate)` : `From ${amount}`;
}

export function telHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.split("/")[0].replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function websiteHref(website: string | null): string | null {
  if (!website) return null;
  return website.startsWith("http") ? website : `https://${website}`;
}
