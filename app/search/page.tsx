import { Container } from "@/components/Container";
import { FacilityCard } from "@/components/FacilityCard";
import { FilterBar } from "@/components/FilterBar";
import { listFacilities } from "@/lib/facilities";

export const metadata = {
  title: "Search Assisted Living & Memory Care Communities",
};

function param(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

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

  const facilities = await listFacilities({
    county,
    careLevel,
    priceBand,
    medicaidOnly: medicaid === "1",
  });

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Find senior living in Chicagoland
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {facilities.length} {facilities.length === 1 ? "community" : "communities"} found
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <FilterBar county={county} careLevel={careLevel} medicaid={medicaid} priceBand={priceBand} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((f) => (
          <FacilityCard key={f.id} facility={f} />
        ))}
      </div>

      {facilities.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No communities match those filters yet. Try broadening your search.
        </p>
      )}
    </Container>
  );
}
