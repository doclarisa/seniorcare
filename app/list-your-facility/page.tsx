import { Container } from "@/components/Container";
import { ListFacilityForm } from "./ListFacilityForm";

export const metadata = { title: "List or Claim Your Facility" };

export default function ListYourFacilityPage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-slate-900">List or claim your facility</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Every listing starts free. Submit your community below and our team
        will review and publish it. You&apos;ll be able to add paid upgrades
        like Featured placement, a Verified badge, and a full photo gallery
        soon —{" "}
        <a href="/pricing" className="font-semibold text-teal-800">
          see pricing
        </a>
        .
      </p>
      <div className="mt-6 max-w-2xl">
        <ListFacilityForm />
      </div>
    </Container>
  );
}
