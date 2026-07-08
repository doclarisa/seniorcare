import Link from "next/link";
import { Container } from "@/components/Container";
import { FacilityCard } from "@/components/FacilityCard";
import { CARE_LEVEL_FILTERS, COUNTIES, getFeaturedFacilities } from "@/lib/facilities";

export default async function HomePage() {
  const featured = await getFeaturedFacilities(3);

  return (
    <div>
      <section className="bg-teal-800 text-white">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Find trusted senior care in Chicagoland
          </h1>
          <p className="mt-3 max-w-xl text-teal-100">
            A free, honestly-vetted directory of assisted living, memory care,
            and supportive living communities across Chicago and the collar
            counties.
          </p>

          <form
            method="get"
            action="/search"
            className="mt-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-lg sm:flex-row"
          >
            <label className="flex-1">
              <span className="sr-only">County</span>
              <select
                name="county"
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base text-slate-800"
                defaultValue=""
              >
                <option value="">Any county</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c} County
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              <span className="sr-only">Care type</span>
              <select
                name="careLevel"
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base text-slate-800"
                defaultValue=""
              >
                <option value="">Any care type</option>
                {CARE_LEVEL_FILTERS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-6 text-sm font-bold text-amber-950"
            >
              Search
            </button>
          </form>
        </Container>
      </section>

      <section className="bg-slate-50 py-8">
        <Container>
          <div className="grid grid-cols-1 gap-4 text-sm text-slate-700 sm:grid-cols-3">
            <p>
              <span className="font-bold text-teal-800">Always free for families.</span>{" "}
              Search and compare as many communities as you like, no account needed.
            </p>
            <p>
              <span className="font-bold text-teal-800">Honestly vetted.</span>{" "}
              We surface inspection flags and complaint history, not just glossy listings.
            </p>
            <p>
              <span className="font-bold text-teal-800">Verify before you decide.</span>{" "}
              Confirm current license status directly with the facility and Illinois IDPH.
            </p>
          </div>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="py-10">
          <Container>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Highly rated communities</h2>
              <Link href="/search" className="text-sm font-semibold text-teal-800">
                View all &rarr;
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((f) => (
                <FacilityCard key={f.id} facility={f} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-slate-200 py-10">
        <Container>
          <h2 className="text-xl font-bold text-slate-900">Browse by county</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {COUNTIES.map((c) => (
              <Link
                key={c}
                href={`/assisted-living/${c.toLowerCase()}-county`}
                className="flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-teal-800 hover:text-teal-800"
              >
                {c} County
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
