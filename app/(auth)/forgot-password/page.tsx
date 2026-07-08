"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <main style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "12px" }}>
            Check your email
          </h1>
          <p style={{ fontFamily: "var(--in)", fontSize: "17px", color: "rgba(17,17,17,0.6)", lineHeight: 1.6 }}>
            If an account exists for <strong style={{ color: "var(--ink)" }}>{email}</strong>, we sent a password reset link.
          </p>
          <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "rgba(17,17,17,0.6)", marginTop: "20px" }}>
            <Link href="/login" style={{ color: "var(--crimson)", textDecoration: "none", fontWeight: 500 }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: "8px" }}>
          Reset your password
        </h1>
        <p style={{ fontFamily: "var(--in)", fontSize: "17px", color: "rgba(17,17,17,0.6)", marginBottom: "32px" }}>
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "15px", color: "var(--ink)", fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ fontFamily: "var(--in)", fontSize: "17px", padding: "11px 14px", border: "1px solid var(--hairline)", backgroundColor: "var(--cream)", color: "var(--ink)", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "var(--maroon)", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "var(--in)", fontSize: "15px", fontWeight: 500, letterSpacing: "0.04em", backgroundColor: loading ? "var(--maroon)" : "#C4693A", color: "var(--cream)", border: "none", padding: "13px 24px", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--in)", fontSize: "16px", color: "rgba(17,17,17,0.6)", marginTop: "28px", textAlign: "center" }}>
          <Link href="/login" style={{ color: "var(--crimson)", textDecoration: "none", fontWeight: 500 }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
