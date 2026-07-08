"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }
    router.push(params.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        name="password"
        type="password"
        required
        autoFocus
        placeholder="Admin password"
        className="min-h-11 rounded-lg border border-slate-300 px-3 text-base"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-11 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Container className="max-w-sm py-16">
      <h1 className="text-xl font-bold text-slate-900">Admin sign in</h1>
      <div className="mt-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </Container>
  );
}
