import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { GUIDES, getGuide } from "@/lib/guides";
import { GUIDE_CONTENT } from "@/lib/guide-content";
import { SITE_URL } from "@/lib/sitemap";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Chicago Care for Seniors`,
    description: guide.dek,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const content = GUIDE_CONTENT[slug];
  if (!guide || !content) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.dek,
        author: { "@type": "Person", name: "Larisa Huhman", url: `${SITE_URL}/founder` },
        publisher: { "@type": "Organization", name: "Chicago Care for Seniors" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "/" },
          { "@type": "ListItem", position: 2, name: "Guides", item: "/guides" },
          { "@type": "ListItem", position: 3, name: guide.title, item: `/guides/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      ...(content.howTo
        ? [
            {
              "@type": "HowTo",
              name: content.howTo.name,
              step: content.howTo.steps.map((s) => ({
                "@type": "HowToStep",
                name: s.name,
                text: s.text,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <Container className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-800">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/guides" className="hover:text-teal-800">
          Guides
        </Link>{" "}
        / {guide.title}
      </nav>

      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{guide.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{guide.dek}</p>

      <div className="mt-6 max-w-2xl space-y-4 text-slate-700">
        {content.sections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <h2 className="mt-6 text-lg font-bold text-slate-900">{section.heading}</h2>
            )}
            {section.paragraphs.map((p, j) => (
              <p key={j} className={j > 0 || section.heading ? "mt-3" : ""}>
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {section.list.map((item, k) => (
                  <li key={k}>{item}</li>
                ))}
              </ul>
            )}
            {section.table && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-max text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {section.table.headers.map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-semibold text-slate-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, r) => (
                      <tr key={r} className="border-t border-slate-200">
                        {row.map((cell, c) =>
                          typeof cell === "string" ? (
                            <td key={c} className="px-4 py-2 text-slate-700">
                              {cell}
                            </td>
                          ) : (
                            <td key={c} className="px-4 py-2">
                              <Link href={cell.href ?? "#"} className="font-semibold text-teal-800 hover:underline">
                                {cell.text}
                              </Link>
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Frequently asked questions</h2>
      <div className="mt-4 max-w-2xl space-y-6">
        {content.faqs.map((f) => (
          <div key={f.question}>
            <h3 className="font-semibold text-slate-900">{f.question}</h3>
            <p className="mt-1 text-slate-700">{f.answer}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-sm text-slate-500">
        Written and reviewed by{" "}
        <Link href="/founder" className="font-semibold text-teal-800">
          Larisa Huhman, Founder &amp; Editor
        </Link>
        . See our{" "}
        <Link href="/methodology" className="font-semibold text-teal-800">
          methodology
        </Link>{" "}
        for how facility data is sourced and verified.
      </p>
    </Container>
  );
}
