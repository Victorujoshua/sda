"use client";

import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    PaystackPop: {
      new (): {
        newTransaction(opts: {
          key: string;
          email: string;
          amount: number;
          currency: string;
          ref: string;
          onSuccess: (t: { reference: string }) => void;
          onCancel: () => void;
        }): void;
      };
    };
  }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  transparentBackdrop?: boolean;
  initialError?: string;
}

export default function MembershipModal({
  isOpen,
  onClose,
  onSuccess,
  transparentBackdrop = false,
  initialError,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const scriptLoaded = useRef(false);

  // Load Paystack v2 inline.js on first mount
  useEffect(() => {
    if (document.querySelector('script[src*="js.paystack.co/v2"]')) {
      scriptLoaded.current = true;
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v2/inline.js";
    s.async = true;
    s.onload = () => { scriptLoaded.current = true; };
    document.head.appendChild(s);
  }, []);

  // ESC to close — blocked during loading
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, loading, onClose]);

  // Scroll lock
  useEffect(() => {
    if (!transparentBackdrop) {
      document.body.style.overflow = isOpen ? "hidden" : "";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen, transparentBackdrop]);

  async function handlePay() {
    setLoading(true);
    setError(null);

    let ref: string, pk: string, amtKobo: number, email: string;
    try {
      const res = await fetch("/api/payments/init", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Could not initialise payment. Please try again.");
        setLoading(false);
        return;
      }
      ref = data.reference;
      pk = data.publicKey;
      amtKobo = data.amountKobo;
      email = data.email;
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
      return;
    }

    if (!window.PaystackPop) {
      setError("Payment script not ready. Please refresh the page and try again.");
      setLoading(false);
      return;
    }

    const pop = new window.PaystackPop();
    pop.newTransaction({
      key: pk,
      email,
      amount: amtKobo,
      currency: "NGN",
      ref,
      onSuccess: async (transaction) => {
        // loading stays true — prevent close while verifying
        try {
          const vRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: transaction.reference }),
          });
          const vData = await vRes.json();
          if (vData.success) {
            onSuccess?.();
          } else {
            setError("Something went wrong. No money was taken. Try again.");
            setLoading(false);
          }
        } catch {
          setError("Something went wrong. No money was taken. Try again.");
          setLoading(false);
        }
      },
      onCancel: () => {
        // Paystack popup closed without payment — keep modal open
        setLoading(false);
      },
    });
  }

  if (!isOpen) return null;

  return (
    <>
      <style>{`@keyframes imani-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Backdrop */}
      <div
        onClick={loading ? undefined : onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: transparentBackdrop
            ? "transparent"
            : "rgba(0,0,0,0.6)",
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        {/* Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "var(--cream)",
            maxWidth: 480,
            width: "100%",
            borderRadius: 8,
            borderTop: "2px solid var(--crimson)",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Close button — hidden during loading */}
          {!loading && (
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 18,
                background: "none",
                border: "none",
                fontSize: 22,
                lineHeight: 1,
                color: "var(--muted)",
                cursor: "pointer",
                padding: "2px 4px",
              }}
            >
              ×
            </button>
          )}

          <div style={{ padding: "32px 32px 28px" }}>
            {/* Heading */}
            <h2
              style={{
                fontFamily: "var(--sr)",
                fontSize: 24,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                margin: "0 0 12px",
              }}
            >
              Unlock deal details
            </h2>

            {/* Body */}
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--muted)",
                lineHeight: 1.7,
                margin: "0 0 20px",
              }}
            >
              A one-time{" "}
              <span style={{ fontFamily: "'Aileron', system-ui, sans-serif" }}>₦</span>
              10,000 diligence and administrative fee gives you permanent access
              to gated deal details across all active opportunities on the
              platform.
            </p>

            {/* What it unlocks */}
            <ul
              style={{
                margin: "0 0 24px",
                padding: "0 0 0 18px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                "Full financial details and revenue breakdowns",
                "Business plan and growth documentation",
                "Gated deal terms and investment structure",
                "Permanent access to all current and future opportunities",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    color: "var(--ink)",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  border: "1px solid rgba(178,35,41,0.3)",
                  backgroundColor: "rgba(178,35,41,0.06)",
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    color: "var(--maroon)",
                    margin: "0 0 10px",
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={handlePay}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    padding: "6px 14px",
                    backgroundColor: "var(--crimson)",
                    color: "var(--cream)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 0 18px",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid var(--hairline)",
                    borderTopColor: "var(--crimson)",
                    flexShrink: 0,
                    animation: "imani-spin 0.8s linear infinite",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  Confirming payment…
                </p>
              </div>
            )}

            {/* Buttons — hidden during loading */}
            {!loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  onClick={handlePay}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    letterSpacing: "0.04em",
                    padding: "11px 24px",
                    backgroundColor: "var(--crimson)",
                    color: "var(--cream)",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Pay{" "}
                  <span style={{ fontFamily: "'Aileron', system-ui, sans-serif" }}>₦</span>
                  10,000
                </button>
                <button
                  onClick={onClose}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    letterSpacing: "0.03em",
                    padding: "11px 20px",
                    backgroundColor: "transparent",
                    color: "var(--ink)",
                    border: "1px solid var(--hairline)",
                    cursor: "pointer",
                  }}
                >
                  Maybe later
                </button>
              </div>
            )}

            {/* Terms note */}
            {!loading && (
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  color: "var(--muted)",
                  margin: "16px 0 0",
                }}
              >
                By paying you agree to our{" "}
                <a
                  href="/terms"
                  style={{ color: "var(--muted)", textDecoration: "underline" }}
                >
                  terms
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
