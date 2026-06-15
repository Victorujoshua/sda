"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "8px" }}>
          Welcome back
        </h1>
        <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#6B6B6B", marginBottom: "36px" }}>
          Sign in to your SDA account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ fontFamily: "var(--in)", fontSize: "15px", padding: "11px 14px", border: "1px solid #E5E4DF", backgroundColor: "#FAFAF8", color: "#0A0A0A", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500 }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#1A3D2F", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ fontFamily: "var(--in)", fontSize: "15px", padding: "11px 14px", border: "1px solid #E5E4DF", backgroundColor: "#FAFAF8", color: "#0A0A0A", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#991B1B", margin: 0 }}>
              {error}
            </p>
          )}

          {searchParams.get("error") === "auth_callback_error" && (
            <p style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#991B1B", margin: 0 }}>
              The link has expired or is invalid. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "var(--in)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", backgroundColor: loading ? "#2d5a43" : "#1A3D2F", color: "#FAFAF8", border: "none", padding: "13px 24px", cursor: loading ? "not-allowed" : "pointer", width: "100%", marginTop: "4px" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--in)", fontSize: "14px", color: "#6B6B6B", marginTop: "28px", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "#FAFAF8" }} />}>
      <LoginForm />
    </Suspense>
  );
}
