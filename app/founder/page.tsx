import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "Larisa Huhman — Founder & Editor" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Larisa Huhman",
  jobTitle: "Founder & Editor",
  url: "/founder",
  worksFor: { "@type": "Organization", name: "Chicago Care for Seniors" },
  description:
    "Founder and editor of Chicago Care for Seniors, translates public IDPH/CMS/HFS inspection and licensing records into plain-language guidance for families.",
};

export default function FounderPage() {
  return (
    <Container className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold text-slate-900">Larisa Huhman — Founder & Editor</h1>

      <div className="mt-4 max-w-2xl space-y-4 text-slate-700">
        <p>
          Larisa Huhman founded Chicago Care for Seniors after navigating the rehabilitation and
          nursing-home system for her father, and now cares for her mother at home. She translates
          public inspection and licensing records into plain-language guidance for families, and
          personally reviews the site&apos;s methodology and data sourcing.
        </p>
        <p className="text-sm text-slate-500">
          Byline used across the site: &ldquo;Compiled and reviewed by Larisa Huhman, Founder &amp;
          Editor.&rdquo;
        </p>
        <p>
          Read the full story behind the site on the{" "}
          <Link href="/about" className="font-semibold text-teal-800">
            About page
          </Link>
          , or see exactly how facility data is sourced and verified on the{" "}
          <Link href="/methodology" className="font-semibold text-teal-800">
            Methodology page
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
