"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "8px" }}>
          Set a new password
        </h1>
        <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#6B6B6B", marginBottom: "32px" }}>
          Choose a strong password for your account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500 }}>
              New password <span style={{ color: "#6B6B6B", fontWeight: 400 }}>(min. 8 characters)</span>
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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "13px", color: "#0A0A0A", fontWeight: 500 }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            style={{ fontFamily: "var(--in)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em", backgroundColor: loading ? "#2d5a43" : "#1A3D2F", color: "#FAFAF8", border: "none", padding: "13px 24px", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}
          >
            {loading ? "Updating…" : "Update password"}
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
