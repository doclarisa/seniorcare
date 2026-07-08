"use client";

import { useState } from "react";

export function InquiryForm({ facilityId, facilityName }: { facilityId: string; facilityName: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      facilityId,
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
        Thanks — your message about {facilityName} has been sent.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        required
        placeholder="Your name"
        className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
      />
      <input
        name="phone"
        placeholder="Phone (optional)"
        className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
      />
      <textarea
        name="message"
        rows={3}
        placeholder="What would you like to know?"
        className="rounded-lg border border-slate-300 px-3 py-2 text-base"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again or call directly.</p>
      )}
    </form>
  );
}
