import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">Contact us</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Questions about a listing, found something that needs updating, or
        want to talk about advertising? Send us a message.
      </p>
      <div className="mt-6 max-w-md">
        <ContactForm />
      </div>
    </Container>
  );
}
