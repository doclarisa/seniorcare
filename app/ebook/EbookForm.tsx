"use client";

import { useState, FormEvent } from "react";

export function EbookForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const firstName = (form.elements.namedItem("first_name") as HTMLInputElement).value.trim();
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;

    if (!email || email.indexOf("@") === -1) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: firstName, company }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="form-card">
      {status === "success" ? (
        <div className="form-success show" role="status" aria-live="polite">
          <div className="tick" aria-hidden="true">
            &#10003;
          </div>
          <h2>Check your email</h2>
          <p>
            Your copy of the book is on its way. If it isn&rsquo;t there in a few minutes, check
            your spam folder and add us to your contacts.
          </p>
        </div>
      ) : (
        <form id="lead-form" onSubmit={handleSubmit} noValidate>
          <h2>Get the free book</h2>
          <p className="sub">
            Enter your email and we&rsquo;ll send the full PDF right away. No cost, ever.
          </p>

          <div className="field">
            <label htmlFor="fname">
              First name <span style={{ fontWeight: 400, color: "#88a0b6" }}>(optional)</span>
            </label>
            <input type="text" id="fname" name="first_name" placeholder="Maria" autoComplete="given-name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@email.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Honeypot: hidden from people, catches bots. Leave empty. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          {error && (
            <p style={{ color: "#ffb4b4", fontSize: 14, margin: "-6px 0 12px" }} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="cta" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send me the book"}
          </button>
          <p className="microtrust">Free &middot; No spam &middot; Unsubscribe anytime</p>
        </form>
      )}
    </div>
  );
}
