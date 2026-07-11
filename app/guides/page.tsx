import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides — Chicago Care for Seniors",
  description: "Plain-language guides to costs, Medicaid, inspection reports, and choosing the right level of senior care in Illinois.",
};

export default function GuidesIndexPage() {
  return (
    <Container className="py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-800">
          Home
        </Link>{" "}
        / Guides
      </nav>

      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Guides</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Plain-language explainers on the questions that come up most — costs, Medicaid, reading a
        real inspection report, and telling one level of care from another.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-800"
          >
            <span className="text-lg font-bold text-slate-900">{g.title}</span>
            <span className="mt-2 text-sm text-slate-600">{g.dek}</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
