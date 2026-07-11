import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "Medical & Information Disclaimer" };

export default function MedicalDisclaimerPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">Medical &amp; information disclaimer</h1>

      <div className="mt-4 max-w-2xl space-y-4 text-slate-700">
        <p>
          The information on Chicago Care for Seniors is provided for general informational
          purposes only and is not medical advice. It is not a substitute for professional
          medical, legal, or financial guidance, and it does not create any provider relationship.
        </p>
        <p>
          A facility&apos;s appearance on this site is not an endorsement or a guarantee of the
          quality of its care. Always consult a qualified professional and verify details directly
          with a facility before making decisions about care.
        </p>
        <p>
          Facility data is drawn from public records (IDPH, CMS, HFS) and may not reflect the most
          current information. See our{" "}
          <Link href="/methodology" className="font-semibold text-teal-800">
            methodology
          </Link>{" "}
          for how and how often that data is checked, and each facility page for its specific
          &ldquo;last verified&rdquo; date.
        </p>
      </div>
    </Container>
  );
}
