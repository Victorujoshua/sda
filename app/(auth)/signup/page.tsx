"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SignupProgress from "@/components/auth/SignupProgress";
import MobileStepIndicator from "@/components/auth/MobileStepIndicator";
import { Eye, EyeOff } from "lucide-react";

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  border: "1px solid rgba(0,0,0,0.15)",
  padding: "12px 16px",
  fontFamily: "var(--in)",
  fontSize: "17px",
  color: "#0A0A0A",
  backgroundColor: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: "15px",
  fontWeight: 500,
  color: "#0A0A0A",
  marginBottom: "6px",
};

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "applicant", full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  }

  const currentStep = done ? 2 : 1;

  return (
    <div className="sda-signup-grid">
      <div className="sda-signup-inner">

        <div className="sda-signup-sidebar">
          <SignupProgress currentStep={currentStep} variant="applicant" />
        </div>

        <div className="sda-signup-form-col">
          <div className="sda-mobile-steps">
            <MobileStepIndicator currentStep={currentStep} totalSteps={6} />
          </div>

          {done ? (
            <div style={{ maxWidth: 440 }}>
              <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", margin: "0 0 8px" }}>
                Check your email
              </h1>
              <p style={{ fontFamily: "var(--in)", fontSize: "18px", color: "rgba(0,0,0,0.5)", lineHeight: 1.6, margin: "0 0 40px" }}>
                We sent a confirmation link to <strong style={{ color: "#0A0A0A", fontWeight: 500 }}>{email}</strong>. Click it to activate your account, then continue your application.
              </p>
              <p style={{ fontFamily: "var(--in)", fontSize: "16px", color: "rgba(0,0,0,0.5)" }}>
                Already confirmed?{" "}
                <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <div style={{ maxWidth: 440 }}>
              <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "#0A0A0A", margin: "0 0 8px" }}>
                Join SDA as an Applicant
              </h1>
              <p style={{ fontFamily: "var(--in)", fontSize: "18px", color: "rgba(0,0,0,0.5)", margin: "0 0 40px" }}>
                Create an account to apply for funding.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>
                    Password{" "}
                    <span style={{ color: "rgba(0,0,0,0.4)", fontWeight: 400 }}>(min. 8 characters)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      style={{ ...inputStyle, padding: "12px 44px 12px 16px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)", padding: "4px", display: "flex", alignItems: "center" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: "17px",
                    fontWeight: 600,
                    backgroundColor: loading ? "#b8870a" : "#CF9A0A",
                    color: "#0A0A0A",
                    border: "none",
                    padding: "14px 32px",
                    cursor: loading ? "not-allowed" : "pointer",
                    width: "100%",
                    marginTop: "4px",
                  }}
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p style={{ fontFamily: "var(--in)", fontSize: "16px", color: "rgba(0,0,0,0.5)", marginTop: "28px" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#1A3D2F", textDecoration: "none", fontWeight: 500 }}>
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
