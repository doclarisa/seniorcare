import Link from "next/link";
import { CARE_TYPE_LABELS } from "@/lib/listings";
import { telHref } from "@/lib/format";
import type { Listing } from "@/lib/generated/prisma/client";

export function ListingCard({ listing }: { listing: Listing }) {
  const phoneHref = telHref(listing.phone);
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={`/facility/${listing.slug}`} className="text-lg font-bold text-slate-900 hover:text-teal-800">
            {listing.name}
          </Link>
          <p className="mt-1 text-sm text-slate-600">
            {listing.city}, IL{listing.zip ? ` ${listing.zip}` : ""} &middot; {listing.county} County
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {listing.categories.map((c) => (
            <span key={c} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {CARE_TYPE_LABELS[c] ?? c}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          {phoneHref && (
            <a
              href={phoneHref}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-teal-800 px-4 text-sm font-semibold text-teal-800"
            >
              Call
            </a>
          )}
          <Link
            href={`/facility/${listing.slug}`}
            className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
