"use client";

import { useActionState } from "react";
import { CARE_LEVEL_FILTERS, COUNTIES } from "@/lib/facility-options";
import { submitFacility, type ListFacilityState } from "./actions";

const initialState: ListFacilityState = { ok: false };

export function ListFacilityForm() {
  const [state, formAction, pending] = useActionState(submitFacility, initialState);

  if (state.ok) {
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
        Thanks! Your listing has been submitted and will appear once we
        review it.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Facility name *
        <input
          name="name"
          required
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Street address
        <input name="address" className="min-h-11 rounded-lg border border-slate-300 px-3 text-base" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          City *
          <input
            name="city"
            required
            className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          ZIP
          <input name="zip" className="min-h-11 rounded-lg border border-slate-300 px-3 text-base" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        County *
        <select
          name="county"
          required
          defaultValue=""
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
        >
          <option value="" disabled>
            Select a county
          </option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Phone
          <input name="phone" className="min-h-11 rounded-lg border border-slate-300 px-3 text-base" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Website
          <input name="website" className="min-h-11 rounded-lg border border-slate-300 px-3 text-base" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Contact email
        <input
          name="email"
          type="email"
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">Care levels offered</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CARE_LEVEL_FILTERS.map((c) => (
            <label key={c.value} className="flex min-h-11 items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="careLevels" value={c.value} className="h-5 w-5 rounded border-slate-300" />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" name="medicaidAccepted" className="h-5 w-5 rounded border-slate-300" />
        Accepts Medicaid / Supportive Living Program
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Short description
        <textarea
          name="summary"
          rows={3}
          maxLength={1000}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit for review"}
      </button>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
