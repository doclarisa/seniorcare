import { CARE_LEVEL_FILTERS, COUNTIES, PRICE_BANDS } from "@/lib/facilities";

export function FilterBar({
  county,
  careLevel,
  medicaid,
  priceBand,
}: {
  county?: string;
  careLevel?: string;
  medicaid?: string;
  priceBand?: string;
}) {
  return (
    <form method="get" className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:items-end">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        County
        <select
          name="county"
          defaultValue={county ?? ""}
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
        >
          <option value="">All counties</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Care type
        <select
          name="careLevel"
          defaultValue={careLevel ?? ""}
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
        >
          <option value="">All care types</option>
          {CARE_LEVEL_FILTERS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Price
        <select
          name="priceBand"
          defaultValue={priceBand ?? ""}
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
        >
          <option value="">Any price</option>
          {PRICE_BANDS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="medicaid"
          value="1"
          defaultChecked={medicaid === "1"}
          className="h-5 w-5 rounded border-slate-300"
        />
        Medicaid accepted
      </label>

      <button
        type="submit"
        className="col-span-2 flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white sm:col-span-4"
      >
        Apply filters
      </button>
    </form>
  );
}
