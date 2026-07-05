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
  border: "1px solid var(--hairline)",
  padding: "12px 16px",
  fontFamily: "var(--in)",
  fontSize: "17px",
  color: "var(--ink)",
  backgroundColor: "var(--cream)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: "15px",
  fontWeight: 500,
  color: "var(--ink)",
  marginBottom: "6px",
};

export default function InvestorSignupPage() {
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
        data: { role: "investor", full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  }

  const currentStep = done ? 2 : 1;

  return (
    <div className="imani-signup-grid">
      <div className="imani-signup-inner">

        <div className="imani-signup-sidebar">
          <SignupProgress currentStep={currentStep} variant="investor" />
        </div>

        <div className="imani-signup-form-col">
          <div className="imani-mobile-steps">
            <MobileStepIndicator currentStep={currentStep} totalSteps={6} />
          </div>

          {done ? (
            <div style={{ maxWidth: 440 }}>
              <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 8px" }}>
                Check your email
              </h1>
              <p style={{ fontFamily: "var(--in)", fontSize: "18px", color: "rgba(17,17,17,0.5)", lineHeight: 1.6, margin: "0 0 40px" }}>
                We sent a confirmation link to <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{email}</strong>. Click it to activate your account.
              </p>
              <p style={{ fontFamily: "var(--in)", fontSize: "16px", color: "rgba(17,17,17,0.5)" }}>
                Already confirmed?{" "}
                <Link href="/login" style={{ color: "var(--crimson)", textDecoration: "none", fontWeight: 500 }}>
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            <div style={{ maxWidth: 440 }}>
              <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 8px" }}>
                Join Imani Ventures as an Investor
              </h1>
              <p style={{ fontFamily: "var(--in)", fontSize: "18px", color: "rgba(17,17,17,0.5)", margin: "0 0 40px" }}>
                Create an account to explore investment opportunities.
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
                    <span style={{ color: "rgba(17,17,17,0.4)", fontWeight: 400 }}>(min. 8 characters)</span>
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
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(17,17,17,0.4)", padding: "4px", display: "flex", alignItems: "center" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "var(--maroon)", margin: 0 }}>
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
                    backgroundColor: loading ? "var(--maroon)" : "var(--crimson)",
                    color: "var(--cream)",
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

              <p style={{ fontFamily: "var(--in)", fontSize: "16px", color: "rgba(17,17,17,0.5)", marginTop: "28px" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "var(--crimson)", textDecoration: "none", fontWeight: 500 }}>
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
