"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--cream)",
        color: "var(--ink)",
        fontFamily: "var(--in)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--hairline)",
          padding: "0 40px",
          height: 56,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--sr)",
            fontSize: 18,
            fontWeight: 600,
            color: "var(--ink)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Imani Ventures
        </Link>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px" }}>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: "0 0 16px",
          }}
        >
          Error
        </p>
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "var(--ink)",
            margin: "0 0 16px",
            fontStyle: "normal",
          }}
        >
          Something went wrong.
        </h1>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 17,
            color: "var(--muted)",
            lineHeight: 1.7,
            margin: "0 0 32px",
          }}
        >
          An unexpected error occurred. Try again or return to the dashboard.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              letterSpacing: "0.04em",
              padding: "10px 22px",
              backgroundColor: "var(--crimson)",
              color: "var(--cream)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              letterSpacing: "0.04em",
              padding: "10px 22px",
              color: "var(--ink)",
              border: "1px solid var(--hairline)",
              textDecoration: "none",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
