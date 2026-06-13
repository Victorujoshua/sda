"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Role = "applicant" | "investor";

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) { setError("Please select a role before continuing."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
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
            We sent a confirmation link to <strong style={{ color: "#0A0A0A" }}>{email}</strong>. Click it to activate your account.
          </p>
          <p style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#6B6B6B", marginTop: "20px" }}>
            Already confirmed?{" "}
            <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const roleCard = (value: Role, title: string, sub: string) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      style={{
        flex: 1,
        padding: "16px",
        border: role === value ? "1px solid #1A3D2F" : "1px solid #E5E4DF",
        backgroundColor: role === value ? "rgba(26,61,47,0.04)" : "#FAFAF8",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <p style={{ fontFamily: "var(--in)", fontSize: "14px", fontWeight: 500, color: role === value ? "#1A3D2F" : "#0A0A0A", margin: "0 0 4px" }}>
        {title}
      </p>
      <p style={{ fontFamily: "var(--in)", fontSize: "12px", color: "#6B6B6B", margin: 0 }}>
        {sub}
      </p>
    </button>
  );

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <Link href="/" style={{ display: "inline-flex", marginBottom: "40px" }}>
          <Image src="/images/logo.png" alt="SDA" width={80} height={28} style={{ objectFit: "contain" }} />
        </Link>

        <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "8px" }}>
          Join SDA
        </h1>
        <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#6B6B6B", marginBottom: "32px" }}>
          Create an account to apply for funding or explore investment opportunities.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500, margin: 0 }}>
              I am joining as
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {roleCard("applicant", "Applicant", "Apply for funding")}
              {roleCard("investor", "Investor", "Browse and invest")}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500 }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              style={{ fontFamily: "var(--in)", fontSize: "15px", padding: "11px 14px", border: "1px solid #E5E4DF", backgroundColor: "#FAFAF8", color: "#0A0A0A", outline: "none", width: "100%", boxSizing: "border-box" }}
            />
          </div>

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
            <label style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500 }}>
              Password <span style={{ color: "#6B6B6B", fontWeight: 400 }}>(min. 8 characters)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
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
            style={{ fontFamily: "var(--in)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", backgroundColor: loading ? "#2d5a43" : "#1A3D2F", color: "#FAFAF8", border: "none", padding: "13px 24px", cursor: loading ? "not-allowed" : "pointer", width: "100%", marginTop: "4px" }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--in)", fontSize: "14px", color: "#6B6B6B", marginTop: "28px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
