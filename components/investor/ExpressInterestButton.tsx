"use client";

import { useState, useTransition } from "react";
import { expressInterest } from "@/app/actions/investor";

export default function ExpressInterestButton({
  dealId,
  dealName,
  initialExpressed,
}: {
  dealId: string;
  dealName: string;
  initialExpressed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [expressed, setExpressed] = useState(initialExpressed);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await expressInterest(dealId, dealName);
        if (result.alreadyExpressed || !result.error) {
          setExpressed(true);
        } else if (result.error) {
          setError(result.error);
        }
      } catch {
        setError("An unexpected error occurred.");
      }
    });
  }

  if (expressed) {
    return (
      <div
        style={{
          border: "1px solid var(--success)",
          padding: "16px 24px",
          fontFamily: "var(--in)",
          fontSize: 14,
          color: "var(--success)",
          lineHeight: 1.6,
        }}
      >
        Your interest has been noted. Our team will be in touch.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            color: "var(--danger)",
            margin: "0 0 12px",
          }}
        >
          {error}
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          letterSpacing: "0.04em",
          padding: "12px 28px",
          backgroundColor: "var(--accent)",
          color: "#FAFAF8",
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? "Submitting…" : "Express interest"}
      </button>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 12,
          color: "var(--muted)",
          margin: "10px 0 0",
          lineHeight: 1.5,
        }}
      >
        No commitment. Our team will follow up to discuss the opportunity.
      </p>
    </div>
  );
}
