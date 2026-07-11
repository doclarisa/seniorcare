import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "Larisa Huhman, Founder" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Larisa Huhman",
  jobTitle: "Founder & Editor",
  url: "/founder",
  email: "mailto:info@chicagocareforseniors.com",
  worksFor: { "@type": "Organization", name: "Chicago Care for Seniors" },
  description:
    "Founder and editor of Chicago Care for Seniors, translates public IDPH/CMS/HFS inspection and licensing records into plain-language guidance for families.",
};

export default function FounderPage() {
  return (
    <Container className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold text-slate-900">Larisa Huhman, Founder</h1>

      <div className="mt-4 max-w-2xl space-y-4 text-slate-700">
        <p>Larisa Huhman is the founder and editor of Chicago Care for Seniors.</p>
        <p>
          She was her father&apos;s caregiver until his death in 2020. He had recently immigrated,
          and she had little say in his care and no easy way to check the record of the places
          meant to provide it. She now cares for her mother, who lives with her.
        </p>
        <p>
          Larisa isn&apos;t paid by any facility. She reads the public inspection, staffing, and
          enforcement records behind every page and writes them in plain language — so families
          can see the same record she couldn&apos;t find when she needed it. See the{" "}
          <Link href="/methodology" className="font-semibold text-teal-800">
            methodology
          </Link>{" "}
          for how.
        </p>
        <p>
          Have a question or a correction? Contact Larisa at{" "}
          <a href="mailto:info@chicagocareforseniors.com" className="font-semibold text-teal-800">
            info@chicagocareforseniors.com
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
