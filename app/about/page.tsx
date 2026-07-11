import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "About Chicago Care for Seniors" };

export default function AboutPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">About Chicago Care for Seniors</h1>

      <div className="mt-4 max-w-2xl space-y-4 text-slate-700">
        <p>
          I built Chicago Care for Seniors because I couldn&apos;t find it when my own family
          needed it.
        </p>
        <p>
          My father, who had recently immigrated, needed care after a hospital stay. I was his
          caregiver, but I had no real say in where he was placed and no way to know whether it
          was safe. He died in 2020.
        </p>
        <p>
          The information that would have told me — a facility&apos;s inspection findings, its
          staffing, its record with state regulators — existed. But it was buried in government
          databases never built for families to read, and no one hands it to you when you have no
          time and no choice.
        </p>
        <p>
          That&apos;s why this site exists: so the next family in that position, especially the
          ones who don&apos;t get a choice, can at least see the record. Today I care for my
          mother, who lives with me, and the questions I ask about her care are the same ones I
          couldn&apos;t get answered back then.
        </p>
        <p>
          That&apos;s the work this site does: sit with a state inspection report or a federal
          staffing dataset, understand what it&apos;s actually saying, and write it back in plain
          language.
        </p>

        <h2 className="text-lg font-bold text-slate-900">What this site is</h2>
        <p>
          An independent, plain-spoken guide to senior care in the Chicago area and the collar
          counties (Cook, DuPage, Lake, Will, Kane, McHenry, and Kendall), built on public
          inspection and licensing records rather than marketing. Every government-sourced
          facility page shows where its information came from and when it was last checked — see
          our{" "}
          <Link href="/methodology" className="font-semibold text-teal-800">
            methodology
          </Link>{" "}
          for exactly how.
        </p>

        <h2 className="text-lg font-bold text-slate-900">What it isn&apos;t</h2>
        <p>
          It is not medical advice, and a listing here is never an endorsement of a facility.
          It&apos;s a starting point for your own research — meant to save you time and point you
          toward the right questions, not to replace visiting a place yourself or talking to your
          own doctor.
        </p>

        <h2 className="text-lg font-bold text-slate-900">How it works</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Search and browse communities for free — no account needed.</li>
          <li>Filter by county, care type, price, and Medicaid/Supportive Living Program eligibility.</li>
          <li>Contact a community directly by phone or through its listing page.</li>
          <li>
            Community operators can{" "}
            <Link href="/list-your-facility" className="font-semibold text-teal-800">
              list or claim their facility
            </Link>{" "}
            for free, with optional paid upgrades for enhanced visibility — see our{" "}
            <Link href="/methodology#independence" className="font-semibold text-teal-800">
              note on independence
            </Link>
            .
          </li>
        </ul>

        <p>
          No facility pays to be listed here, to rank higher, or to have a weak inspection record
          softened or hidden. If that ever changes, this page will say so plainly.
        </p>
        <p>
          If this site saves one family an ounce of the confusion mine went through, it&apos;s
          done its job.
        </p>
        <p className="font-semibold text-slate-900">
          —{" "}
          <Link href="/founder" className="text-teal-800 hover:underline">
            Larisa Huhman, Founder
          </Link>
        </p>
      </div>
    </Container>
  );
}
