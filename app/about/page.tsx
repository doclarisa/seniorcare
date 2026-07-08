import { Container } from "@/components/Container";

export const metadata = { title: "About & How It Works" };

export default function AboutPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">About Chicago Care for Seniors</h1>

      <div className="mt-4 space-y-4 text-slate-700">
        <p>
          Chicago Care for Seniors is a directory of assisted living, memory
          care, and supportive living communities across Chicago and the
          collar counties (Cook, DuPage, Lake, Will, and Kane). Our goal is to
          make it easier for families to find and compare care options
          honestly — including flagging inspection or complaint history where
          it exists, not just showcasing polished listings.
        </p>

        <h2 className="text-lg font-bold text-slate-900">How it works</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Search and browse communities for free — no account needed.</li>
          <li>
            Filter by county, care type, price, and Medicaid/Supportive
            Living Program eligibility.
          </li>
          <li>
            Contact a community directly by phone or through our inquiry
            form.
          </li>
          <li>
            Community operators can{" "}
            <a href="/list-your-facility" className="font-semibold text-teal-800">
              list or claim their facility
            </a>{" "}
            for free, with optional paid upgrades for enhanced visibility.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900">A note on data</h2>
        <p>
          Facility details are compiled from public sources, aggregator
          listings, and facility websites, and are refreshed periodically.
          Prices are starting estimates unless noted as facility-stated.
          Always verify current license status, pricing, and availability
          directly with the facility and the Illinois Department of Public
          Health (IDPH) at{" "}
          <a
            href="https://llcs.dph.illinois.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-800"
          >
            llcs.dph.illinois.gov
          </a>{" "}
          before making a decision.
        </p>
      </div>
    </Container>
  );
}
