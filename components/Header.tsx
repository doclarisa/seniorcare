"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";

const NAV_LINKS = [
  { href: "/search", label: "Find Care" },
  { href: "/pricing", label: "For Facilities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex min-h-11 items-center text-lg font-bold text-teal-800"
          onClick={() => setOpen(false)}
        >
          Chicago Care for Seniors
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href
                  ? "text-teal-800"
                  : "text-slate-600 hover:text-teal-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/list-your-facility"
            className="rounded-full bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
          >
            List Your Facility
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-slate-700 md:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </Container>

      {open && (
        <>
          <button
            aria-label="Close menu overlay"
            className="fixed inset-x-0 top-16 z-30 h-[calc(100vh-4rem)] bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-x-0 top-full z-40 border-t border-slate-200 bg-white shadow-lg md:hidden">
            <Container className="flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center border-b border-slate-100 text-base font-medium ${
                    pathname === link.href ? "text-teal-800" : "text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/list-your-facility"
                onClick={() => setOpen(false)}
                className="my-3 flex min-h-11 items-center justify-center rounded-full bg-teal-800 px-4 text-base font-semibold text-white"
              >
                List Your Facility
              </Link>
            </Container>
          </nav>
        </>
      )}
    </header>
  );
}
