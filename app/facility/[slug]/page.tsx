import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getFacilityBySlug } from "@/lib/facilities";
import { formatPrice, googleMapsHref, telHref, websiteHref } from "@/lib/format";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = await getFacilityBySlug(slug);
  if (!facility) return {};
  return {
    title: `${facility.name} — ${facility.city}, IL`,
    description: facility.summary ?? `${facility.name} in ${facility.city}, ${facility.county} County, Illinois.`,
  };
}

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = await getFacilityBySlug(slug);
  if (!facility) notFound();

  const careLevels = asStringArray(facility.careLevels);
  const roomTypes = asStringArray(facility.roomTypes);
  const amenities = asStringArray(facility.amenities);
  const photos = facility.photosUnlocked ? asStringArray(facility.photos) : [];
  const price = formatPrice(facility.priceMin, facility.priceEstimate);
  const phoneHref = telHref(facility.phone);
  const siteHref = websiteHref(facility.website);
  const mapsHref = googleMapsHref(facility.address, facility.city, facility.county);

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {facility.tier === "FEATURED" && (
              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase text-amber-950">
                Featured
              </span>
            )}
            {facility.verified && (
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                Verified listing
              </span>
            )}
            {facility.qualityTier && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {facility.qualityTier}
              </span>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{facility.name}</h1>
          <p className="mt-1 text-slate-600">
            {facility.address ?? `${facility.city}, IL`} &middot; {facility.county} County
          </p>

          {facility.flags && (
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Flag on record</p>
              <p className="mt-1">{facility.flags}</p>
            </div>
          )}

          {facility.summary && (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-slate-700 sm:bg-transparent sm:p-0">
              {facility.summary}
            </p>
          )}

          {careLevels.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Care levels</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {careLevels.map((level) => (
                  <span key={level} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {level}
                  </span>
                ))}
              </div>
            </div>
          )}

          {price && (
            <div className="mt-6 rounded-lg bg-emerald-50 p-3 sm:bg-transparent sm:p-0">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Price</p>
              <p className="mt-1 text-slate-800">{price}</p>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {facility.capacityNote && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Capacity</dt>
                <dd className="mt-1 text-slate-800">{facility.capacityNote}</dd>
              </div>
            )}
            {roomTypes.length > 0 && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Room types</dt>
                <dd className="mt-1 text-slate-800">{roomTypes.join(", ")}</dd>
              </div>
            )}
            {facility.medicaidAccepted && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Medicaid / SLP</dt>
                <dd className="mt-1 text-slate-800">Accepted</dd>
              </div>
            )}
            {facility.operator && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Operator</dt>
                <dd className="mt-1 text-slate-800">{facility.operator}</dd>
              </div>
            )}
            {facility.yearOpened && (
              <div>
                <dt className="text-sm font-bold uppercase tracking-wide text-slate-500">Opened</dt>
                <dd className="mt-1 text-slate-800">{facility.yearOpened}</dd>
              </div>
            )}
          </dl>

          {amenities.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Amenities</h2>
              <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-slate-700 sm:grid-cols-2">
                {amenities.map((a) => (
                  <li key={a}>&bull; {a}</li>
                ))}
              </ul>
            </div>
          )}

          {facility.reviews.length > 0 && (
            <div className="mt-6 rounded-lg bg-sky-50 p-3 sm:bg-transparent sm:p-0">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Reviews & recognition</h2>
              <ul className="mt-2 space-y-1 text-slate-700">
                {facility.reviews.map((r) => (
                  <li key={r.id}>&bull; {r.note}</li>
                ))}
              </ul>
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Photos</h2>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt={facility.name} className="aspect-square rounded-lg object-cover" />
                ))}
              </div>
            </div>
          )}

          {facility.license && (
            <p className="mt-6 text-xs text-slate-500">
              License on record: {facility.license}
              {!facility.licenseVerified && " (unverified against state database)"}
            </p>
          )}

          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            Always verify current license status and details directly with the facility and the
            Illinois Department of Public Health (IDPH) at llcs.dph.illinois.gov before making a decision.
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
                  Call {facility.phone}
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

            {facility.address && (
              <p className="mt-4 text-sm text-slate-600">{facility.address}</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
