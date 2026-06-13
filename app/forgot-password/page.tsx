"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <main style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Link href="/" style={{ display: "inline-flex", marginBottom: "40px" }}>
            <Image src="/images/logo.png" alt="SDA" width={80} height={28} style={{ objectFit: "contain" }} />
          </Link>
          <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "12px" }}>
            Check your email
          </h1>
          <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#6B6B6B", lineHeight: 1.6 }}>
            If an account exists for <strong style={{ color: "#0A0A0A" }}>{email}</strong>, we sent a password reset link.
          </p>
          <p style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#6B6B6B", marginTop: "20px" }}>
            <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <Link href="/" style={{ display: "inline-flex", marginBottom: "40px" }}>
          <Image src="/images/logo.png" alt="SDA" width={80} height={28} style={{ objectFit: "contain" }} />
        </Link>

        <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "8px" }}>
          Reset your password
        </h1>
        <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#6B6B6B", marginBottom: "32px" }}>
          Enter your email and we&apos;ll send you a reset link.
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

          {error && (
            <p style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#991B1B", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "var(--in)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", backgroundColor: loading ? "#2d5a43" : "#1A3D2F", color: "#FAFAF8", border: "none", padding: "13px 24px", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--in)", fontSize: "14px", color: "#6B6B6B", marginTop: "28px", textAlign: "center" }}>
          <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
