import { Container } from "@/components/Container";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">Contact us</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Questions about a listing, found something that needs updating, or want to talk about
        advertising? Email us directly.
      </p>
      <a
        href="mailto:info@chicagocareforseniors.com"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-6 text-sm font-semibold text-white"
      >
        info@chicagocareforseniors.com
      </a>
    </Container>
  );
}
