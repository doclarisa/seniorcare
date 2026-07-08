import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { FacilityCard } from "@/components/FacilityCard";
import { COUNTIES, listFacilities } from "@/lib/facilities";

function countyFromSlug(slug: string): (typeof COUNTIES)[number] | null {
  const stripped = slug.replace(/-county$/i, "");
  return COUNTIES.find((c) => c.toLowerCase() === stripped.toLowerCase()) ?? null;
}

export function generateStaticParams() {
  return COUNTIES.map((c) => ({ county: `${c.toLowerCase()}-county` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county: countySlug } = await params;
  const county = countyFromSlug(countySlug);
  if (!county) return {};
  return {
    title: `Assisted Living in ${county} County, IL`,
    description: `Compare assisted living, memory care, and supportive living communities in ${county} County, Illinois.`,
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county: countySlug } = await params;
  const county = countyFromSlug(countySlug);
  if (!county) notFound();

  const facilities = await listFacilities({ county });

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Assisted Living & Memory Care in {county} County, IL
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {facilities.length} vetted {facilities.length === 1 ? "community" : "communities"} in{" "}
        {county} County, including assisted living, memory care, and Medicaid-eligible
        supportive living options.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((f) => (
          <FacilityCard key={f.id} facility={f} />
        ))}
      </div>

      {facilities.length === 0 && (
        <p className="mt-10 text-center text-slate-500">
          No communities listed in {county} County yet.
        </p>
      )}
    </Container>
  );
}
