import Link from "next/link";
import type { Facility } from "@/lib/generated/prisma/client";
import { formatPrice, telHref } from "@/lib/format";

export function FacilityCard({ facility }: { facility: Facility }) {
  const careLevels = Array.isArray(facility.careLevels) ? (facility.careLevels as string[]) : [];
  const price = formatPrice(facility.priceMin, facility.priceEstimate);
  const phoneHref = telHref(facility.phone);
  const isFeatured = facility.tier === "FEATURED";

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm ${
        isFeatured ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
      }`}
    >
      {isFeatured && (
        <div className="bg-amber-400 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950">
          Featured
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/facility/${facility.slug}`} className="text-lg font-bold text-slate-900 hover:text-teal-800">
              {facility.name}
            </Link>
            {facility.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800">
                Verified
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {facility.city}, IL{facility.zip ? ` ${facility.zip}` : ""} &middot; {facility.county} County
          </p>
        </div>

        {careLevels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {careLevels.slice(0, 3).map((level) => (
              <span
                key={level}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {level}
              </span>
            ))}
          </div>
        )}

        {facility.medicaidAccepted && (
          <p className="text-xs font-semibold text-emerald-700">Accepts Medicaid / Supportive Living</p>
        )}

        {facility.flags && (
          <p className="rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
            <span className="font-semibold">Flag: </span>
            {facility.flags}
          </p>
        )}

        {facility.summary && (
          <p className="line-clamp-2 text-sm text-slate-600">{facility.summary}</p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          {price ? (
            <p className="text-sm font-semibold text-slate-800">{price}</p>
          ) : (
            <p className="text-sm text-slate-400">Price on request</p>
          )}
          <div className="flex gap-2">
            {phoneHref && (
              <a
                href={phoneHref}
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-teal-800 px-4 text-sm font-semibold text-teal-800 sm:flex-none"
              >
                Call
              </a>
            )}
            <Link
              href={`/facility/${facility.slug}`}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white sm:flex-none"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
