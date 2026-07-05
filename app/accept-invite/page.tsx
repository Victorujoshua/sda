"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptAdminInvite } from "@/app/actions/admin";
import { Eye, EyeOff } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--hairline)",
  padding: "12px 14px",
  fontFamily: "var(--in)",
  fontSize: 16,
  color: "var(--ink)",
  backgroundColor: "var(--cream)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--ink)",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

function AcceptInviteForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <p style={{ fontFamily: "var(--in)", fontSize: 16, color: "var(--maroon)" }}>
        This invite link is invalid or has expired.
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await acceptAdminInvite(token, fullName, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/login?message=Account+created.+Please+log+in.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {error && (
        <div
          style={{
            border: "1px solid rgba(178,35,41,0.3)",
            backgroundColor: "rgba(178,35,41,0.06)",
            padding: "10px 14px",
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--maroon)",
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            style={{ ...inputStyle, padding: "12px 44px 12px 14px" }}
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
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            color: "var(--muted)",
            margin: "6px 0 0",
          }}
        >
          Minimum 8 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          fontFamily: "var(--sr)",
          fontSize: 17,
          fontWeight: 600,
          padding: "14px 32px",
          backgroundColor: isPending ? "rgba(17,17,17,0.5)" : "var(--ink)",
          color: "var(--cream)",
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        {isPending ? "Creating account…" : "Create admin account"}
      </button>
    </form>
  );
}

export default function AcceptInvitePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: "0 0 12px",
          }}
        >
          Imani Ventures Admin
        </p>
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            margin: "0 0 8px",
          }}
        >
          Set up your account
        </h1>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 16,
            color: "var(--muted)",
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          You have been invited to join Imani Ventures as an admin. Create your
          password to get started.
        </p>

        <Suspense fallback={null}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </div>
  );
}
