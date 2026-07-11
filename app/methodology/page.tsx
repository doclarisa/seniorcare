import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "Methodology — How We Compile and Verify Facilities" };

export default function MethodologyPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">How we compile and verify facilities</h1>

      <div className="mt-4 max-w-2xl space-y-4 text-slate-700">
        <p>
          Chicago Care for Seniors exists to turn public records that families can&apos;t easily
          read into information they can act on. Here&apos;s exactly how we do that — including
          how we make money, so you can judge our independence for yourself.
        </p>

        <h2 className="text-lg font-bold text-slate-900">Where our information comes from</h2>
        <p>We build every government-sourced listing from public records, not from facility marketing:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Illinois Department of Public Health (IDPH)</strong> — state licensing for
            assisted living and shared housing establishments, facility status, unit counts, and
            Alzheimer&apos;s/memory-care special-care designations.
          </li>
          <li>
            <strong>Centers for Medicare &amp; Medicaid Services (CMS)</strong> — federal data for
            nursing homes, including 5-star inspection ratings, health deficiencies, staffing
            levels, and enforcement penalties.
          </li>
          <li>
            <strong>Illinois Department of Healthcare and Family Services (HFS)</strong> — the
            Supportive Living Program, Illinois&apos;s Medicaid-funded alternative to a nursing
            home, which many families don&apos;t know exists.
          </li>
        </ul>
        <p>
          Each government-sourced facility page names the sources behind it and the date its
          information was last checked. A smaller number of listings come from an original,
          hand-researched directory rather than these government feeds; those pages are marked
          differently and don&apos;t carry a government &ldquo;data sources&rdquo; line.
        </p>

        <h2 className="text-lg font-bold text-slate-900">How we translate inspection data</h2>
        <p>
          Inspection records are public, but they&apos;re written for regulators — full of
          citation codes and survey language most families have no reason to know. We read the
          underlying records and summarize what they say in plain English: how recent the last
          inspection was, what kinds of issues were found, and how the facility compares on
          staffing.
        </p>
        <p>
          We don&apos;t hide unflattering records. If a facility has a poor inspection history,
          that shows up on its page — including for facilities we might otherwise have reason to
          feature. Surfacing what marketing-driven directories leave out is a core reason this
          site exists.
        </p>

        <h2 className="text-lg font-bold text-slate-900">&ldquo;Last verified&rdquo; dates</h2>
        <p>
          Government data updates on its own schedule — CMS refreshes monthly; state licensing
          data less often. We re-check our sources on a regular cycle and stamp each facility with
          the date we last confirmed its information. If a date looks old, treat the details as a
          starting point and confirm with the facility directly.
        </p>

        <h2 className="text-lg font-bold text-slate-900">One facility, one page</h2>
        <p>
          A single community can appear in several government databases at once — a licensed
          assisted-living wing, a memory-care designation, a Medicaid Supportive Living program, a
          skilled-nursing unit. We merge these into one page per physical location, matched by
          address, so you see the full picture of a place rather than several confusing fragments.
        </p>

        <h2 className="text-lg font-bold text-slate-900">What we don&apos;t do, and where to be careful</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>This is not medical advice and not a substitute for a physician. For any health decision, talk to your own doctor.</li>
          <li>A listing is not an endorsement. We report what the public record shows; we don&apos;t vouch for the quality of care at any facility.</li>
          <li>Records can lag reality. Always verify directly with the facility and visit in person before making a decision. We&apos;re a place to start, not a place to stop.</li>
          <li>If you spot something wrong on a page, tell us — see corrections below.</li>
        </ul>

        <h2 id="independence" className="text-lg font-bold text-slate-900">How we stay independent</h2>
        <p>
          Every listing on Chicago Care for Seniors is free. Our revenue comes from optional paid
          upgrades that facility operators can purchase — Featured placement, a Verified badge, an
          expanded photo gallery, and lead-delivery routing (see{" "}
          <Link href="/pricing" className="font-semibold text-teal-800">
            pricing
          </Link>
          ; these upgrades are still in development and not yet live). That revenue keeps the site
          free to use. It does not buy a facility a listing, and it does not remove, soften, or
          hide an inspection flag, a deficiency, or a complaint record. &ldquo;Featured&rdquo;
          affects a listing&apos;s display position, not the facts on its page — the government
          data and our own quality notes stay exactly the same whether a facility has paid for
          Featured placement or not. Facilities cannot pay to have problems removed from their
          page.
        </p>

        <h2 className="text-lg font-bold text-slate-900">Corrections</h2>
        <p>
          If a facility&apos;s information is out of date or wrong,{" "}
          <Link href="/contact" className="font-semibold text-teal-800">
            contact us
          </Link>{" "}
          with the facility name and what needs fixing. We check corrections against the source
          records and update the page.
        </p>

        <p className="text-sm text-slate-500">
          Compiled and reviewed by{" "}
          <Link href="/founder" className="font-semibold text-teal-800">
            Larisa Huhman, Founder &amp; Editor
          </Link>
          . Last updated 2026-07-10.
        </p>
      </div>
    </Container>
  );
}
