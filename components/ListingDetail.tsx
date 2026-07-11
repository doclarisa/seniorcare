import { Container } from "@/components/Container";
import { CARE_TYPE_LABELS } from "@/lib/listings";
import { googleMapsHref, telHref, websiteHref } from "@/lib/format";
import type { Listing } from "@/lib/generated/prisma/client";

interface EnrichedData {
  licenseNumber?: string | null;
  licenseStatus?: string | null;
  units?: number | null;
  hasAlzheimersUnit?: boolean;
  alzheimersUnits?: number | null;
  supportiveLiving?: boolean;
  medicaidAccepted?: boolean;
  operator?: string | null;
  populationServed?: string | null;
  ccn?: string | null;
  certifiedBeds?: number | null;
  ratings?: {
    overall?: number | null;
    healthInspection?: number | null;
    staffing?: number | null;
    quality?: number | null;
  };
  deficiencyCount?: number | null;
  ownershipType?: string | null;
  isCcrc?: boolean;
  inspectionSummary?: string | null;
  dataSources?: string[];
  lastVerified?: string;
}

function StarRating({ label, value }: { label: string; value: number | null | undefined }) {
  if (value == null) return null;
  return (
    <div>
      <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-800">{"★".repeat(value)}{"☆".repeat(5 - value)} <span className="text-slate-500">({value}/5)</span></dd>
    </div>
  );
}

export function ListingDetail({ listing }: { listing: Listing }) {
  const enriched = (listing.enriched ?? {}) as EnrichedData;
  const phoneHref = telHref(listing.phone);
  const siteHref = websiteHref(listing.website);
  const mapsHref = googleMapsHref(listing.address, listing.city, listing.county);
  const dataSourceLabels: Record<string, string> = {
    IDPH: "Illinois Dept. of Public Health",
    HFS: "Illinois Dept. of Healthcare & Family Services",
    CMS: "CMS (Medicare/Medicaid)",
  };

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {listing.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800"
              >
                {CARE_TYPE_LABELS[c] ?? c}
              </span>
            ))}
          </div>

          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{listing.name}</h1>
          <p className="mt-1 text-slate-600">
            {listing.address} &middot; {listing.city}, {listing.county} County
          </p>

          {enriched.inspectionSummary && (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-slate-700 sm:bg-transparent sm:p-0">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 sm:hidden">
                Inspection record
              </h2>
              <p className="mt-1 sm:mt-0">{enriched.inspectionSummary}</p>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {enriched.licenseStatus && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">License status (IDPH)</dt>
                <dd className="mt-1 text-slate-800">{enriched.licenseStatus}{enriched.licenseNumber ? ` — #${enriched.licenseNumber}` : ""}</dd>
              </div>
            )}
            {enriched.units != null && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Units</dt>
                <dd className="mt-1 text-slate-800">{enriched.units}</dd>
              </div>
            )}
            {enriched.certifiedBeds != null && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Certified beds (CMS)</dt>
                <dd className="mt-1 text-slate-800">{enriched.certifiedBeds}</dd>
              </div>
            )}
            {enriched.hasAlzheimersUnit && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Memory care</dt>
                <dd className="mt-1 text-slate-800">
                  Dedicated Alzheimer&apos;s/memory care unit{enriched.alzheimersUnits ? ` (${enriched.alzheimersUnits} units)` : ""}
                </dd>
              </div>
            )}
            {enriched.medicaidAccepted && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Medicaid</dt>
                <dd className="mt-1 text-slate-800">
                  Accepted — Illinois Supportive Living Program{enriched.populationServed ? ` (${enriched.populationServed})` : ""}
                </dd>
              </div>
            )}
            {enriched.ownershipType && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Ownership</dt>
                <dd className="mt-1 text-slate-800">{enriched.ownershipType}</dd>
              </div>
            )}
            {enriched.isCcrc && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Community type</dt>
                <dd className="mt-1 text-slate-800">Continuing Care Retirement Community (CCRC)</dd>
              </div>
            )}
          </dl>

          {enriched.ratings && (
            <div className="mt-6 rounded-lg bg-sky-50 p-3 sm:bg-transparent sm:p-0">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">CMS star ratings</h2>
              <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StarRating label="Overall" value={enriched.ratings.overall} />
                <StarRating label="Health inspection" value={enriched.ratings.healthInspection} />
                <StarRating label="Staffing" value={enriched.ratings.staffing} />
                <StarRating label="Quality measures" value={enriched.ratings.quality} />
              </dl>
              {enriched.deficiencyCount != null && (
                <p className="mt-3 text-sm text-slate-600">
                  Most recent standard health inspection: {enriched.deficiencyCount} deficienc{enriched.deficiencyCount === 1 ? "y" : "ies"} identified.
                </p>
              )}
            </div>
          )}

          <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            Data sources: {(enriched.dataSources ?? []).map((s) => dataSourceLabels[s] ?? s).join(", ") || "Illinois Dept. of Public Health"}
            {enriched.lastVerified ? ` · Last verified ${enriched.lastVerified}` : ""}. Always verify current
            license status and details directly with the facility.
          </p>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col gap-2">
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white"
                >
                  Call {listing.phone}
                </a>
              )}
              {siteHref && (
                <a
                  href={siteHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
                >
                  Visit website
                </a>
              )}
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
              >
                View on Google Maps
              </a>
            </div>

            {listing.address && <p className="mt-4 text-sm text-slate-600">{listing.address}</p>}
          </div>
        </div>
      </div>
    </Container>
  );
}
