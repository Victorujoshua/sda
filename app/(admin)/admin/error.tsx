"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div style={{ padding: "48px 40px", maxWidth: 600 }}>
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
        Admin · Error
      </p>
      <h1
        style={{
          fontFamily: "var(--sr)",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          margin: "0 0 12px",
          fontStyle: "normal",
        }}
      >
        Something went wrong.
      </h1>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          lineHeight: 1.7,
          margin: "0 0 32px",
        }}
      >
        An unexpected error occurred in the admin portal. Try again or navigate
        to a different section.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => reset()}
          style={{
            fontFamily: "var(--in)",
            fontSize: 12,
            letterSpacing: "0.04em",
            padding: "9px 20px",
            backgroundColor: "var(--accent)",
            color: "#FAFAF8",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/admin"
          style={{
            fontFamily: "var(--in)",
            fontSize: 12,
            letterSpacing: "0.04em",
            padding: "9px 20px",
            color: "var(--ink)",
            border: "1px solid var(--border)",
            textDecoration: "none",
          }}
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}
