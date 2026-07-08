import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="flex flex-col gap-6 py-10 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold text-slate-800">Chicago Care for Seniors</p>
          <p className="mt-2">
            A free directory of assisted living, memory care, and supportive
            living communities across Chicago and the collar counties.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:flex sm:gap-12">
          <div>
            <p className="font-semibold text-slate-800">Families</p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/search" className="hover:text-teal-800">
                  Find care
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-800">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-800">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Facilities</p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/list-your-facility" className="hover:text-teal-800">
                  List your facility
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-teal-800">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-slate-200 py-4">
        <Container>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Chicago Care for Seniors. Always
            verify current license status and details directly with the
            facility and the Illinois Department of Public Health (IDPH).
          </p>
        </Container>
      </div>
    </footer>
  );
}
