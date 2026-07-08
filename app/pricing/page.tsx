import { Container } from "@/components/Container";
import { PAYMENTS_ENABLED, PRICING_PLANS } from "@/lib/stripe";

export const metadata = { title: "Pricing for Facilities" };

export default function PricingPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">Pricing for facilities</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Every listing on Chicago Care for Seniors starts free. These optional
        upgrades help your community stand out to families.
      </p>

      {!PAYMENTS_ENABLED && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Paid upgrades are launching soon. Listings are 100% free while we
          build up traffic — check back here once upgrades go live.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Free</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Standard listing</p>
          <p className="mt-2 text-sm text-slate-600">
            Name, address, phone, care types, and a one-line description —
            included for every facility, forever.
          </p>
          <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Included
          </span>
        </div>

        {PRICING_PLANS.map((plan) => (
          <div key={plan.key} className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Upgrade</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{plan.name}</p>
            <p className="mt-2 text-sm text-slate-600">{plan.blurb}</p>
            <button
              type="button"
              disabled
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg bg-slate-200 px-4 text-sm font-semibold text-slate-500"
            >
              Coming soon
            </button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Already listed and want to make changes?{" "}
        <a href="/contact" className="font-semibold text-teal-800">
          Contact us
        </a>
        .
      </p>
    </Container>
  );
}
