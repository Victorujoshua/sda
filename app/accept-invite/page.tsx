"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptAdminInvite } from "@/app/actions/admin";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(0,0,0,0.15)",
  padding: "12px 14px",
  fontFamily: "var(--in)",
  fontSize: 14,
  color: "var(--ink)",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: 12,
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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <p style={{ fontFamily: "var(--in)", fontSize: 14, color: "var(--danger)" }}>
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
            border: "1px solid var(--danger)",
            padding: "10px 14px",
            fontFamily: "var(--in)",
            fontSize: 13,
            color: "var(--danger)",
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          style={inputStyle}
        />
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 12,
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
          fontSize: 15,
          fontWeight: 600,
          padding: "14px 32px",
          backgroundColor: isPending ? "rgba(10,10,10,0.5)" : "#0A0A0A",
          color: "#FAFAF8",
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
        backgroundColor: "var(--paper)",
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
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: "0 0 12px",
          }}
        >
          SDA Admin
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
            fontSize: 14,
            color: "var(--muted)",
            margin: "0 0 36px",
            lineHeight: 1.6,
          }}
        >
          You have been invited to join SDA as an admin. Create your password to
          get started.
        </p>

        <Suspense fallback={null}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </div>
  );
}
