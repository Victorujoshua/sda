"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    window.location.href = "/dashboard";
  }

  const eyeBtnStyle: React.CSSProperties = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(0,0,0,0.4)",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <main style={{ minHeight: "calc(100vh - 80px)", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "8px" }}>
          Set a new password
        </h1>
        <p style={{ fontFamily: "var(--in)", fontSize: "17px", color: "#6B6B6B", marginBottom: "32px" }}>
          Choose a strong password for your account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#0A0A0A", fontWeight: 500 }}>
              New password <span style={{ color: "#6B6B6B", fontWeight: 400 }}>(min. 8 characters)</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={{ fontFamily: "var(--in)", fontSize: "17px", padding: "11px 44px 11px 14px", border: "1px solid #E5E4DF", backgroundColor: "#FAFAF8", color: "#0A0A0A", outline: "none", width: "100%", boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeBtnStyle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#0A0A0A", fontWeight: 500 }}>
              Confirm password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                style={{ fontFamily: "var(--in)", fontSize: "17px", padding: "11px 44px 11px 14px", border: "1px solid #E5E4DF", backgroundColor: "#FAFAF8", color: "#0A0A0A", outline: "none", width: "100%", boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={eyeBtnStyle}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "#991B1B", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: "var(--in)", fontSize: "15px", fontWeight: 500, letterSpacing: "0.04em", backgroundColor: loading ? "#2d5a43" : "#1A3D2F", color: "#FAFAF8", border: "none", padding: "13px 24px", cursor: loading ? "not-allowed" : "pointer", width: "100%" }}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--in)", fontSize: "16px", color: "#6B6B6B", marginTop: "28px", textAlign: "center" }}>
          <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
