import { Container } from "@/components/Container";
import { FacilityCard } from "@/components/FacilityCard";
import { ListingCard } from "@/components/ListingCard";
import { FilterBar } from "@/components/FilterBar";
import { listFacilities } from "@/lib/facilities";
import { searchListings } from "@/lib/listings";
import type { Facility, Listing } from "@/lib/generated/prisma/client";

export const metadata = {
  title: "Search Assisted Living & Memory Care Communities",
};

function param(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

type MergedEntry =
  | { type: "facility"; sortName: string; isFeatured: boolean; data: Facility }
  | { type: "listing"; sortName: string; isFeatured: boolean; data: Listing };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const county = param(params.county);
  const careLevel = param(params.careLevel);
  const priceBand = param(params.priceBand);
  const medicaid = param(params.medicaid);
  const medicaidOnly = medicaid === "1";

  // Same "one building, one card" rule as /assisted-living/[county]: the
  // ~20 Listings confirmed to duplicate an existing Facility are already
  // unpublished at the data layer (scripts/unpublish-duplicates.ts), so no
  // extra de-dup logic is needed here -- every PUBLISHED Listing that
  // reaches these queries is a genuinely distinct building.
  const [facilities, listings] = await Promise.all([
    listFacilities({ county, careLevel, priceBand, medicaidOnly }),
    searchListings({ county, careLevel, priceBand, medicaidOnly }),
  ]);

  const merged: MergedEntry[] = [
    ...facilities.map((f): MergedEntry => ({
      type: "facility",
      sortName: f.name,
      isFeatured: f.tier === "FEATURED",
      data: f,
    })),
    ...listings.map((l): MergedEntry => ({
      type: "listing",
      sortName: l.name,
      isFeatured: false,
      data: l,
    })),
  ].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.sortName.localeCompare(b.sortName);
  });

  const total = merged.length;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Find senior living in Chicagoland
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {total} {total === 1 ? "community" : "communities"} found
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <FilterBar county={county} careLevel={careLevel} medicaid={medicaid} priceBand={priceBand} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((entry) =>
          entry.type === "facility" ? (
            <FacilityCard key={`f-${entry.data.id}`} facility={entry.data} />
          ) : (
            <ListingCard key={`l-${entry.data.id}`} listing={entry.data} />
          ),
        )}
      </div>

      {total === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No communities match those filters yet. Try broadening your search.
        </p>
      )}
    </Container>
  );
}
