"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[MarketingError]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.3)",
          margin: "0 0 20px",
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
          color: "#FAFAF8",
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
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 32px",
          maxWidth: 400,
        }}
      >
        An unexpected error occurred. Try again or return to the homepage.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => reset()}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "10px 22px",
            backgroundColor: "#FAFAF8",
            color: "#0A0A0A",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "10px 22px",
            color: "#FAFAF8",
            border: "1px solid rgba(255,255,255,0.25)",
            textDecoration: "none",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
