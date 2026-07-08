"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MembershipModal from "@/components/investor/MembershipModal";

interface Deal {
  id: string;
  business_name: string;
  industry: string | null;
  revenue_to_date: number | null;
  funding_required: number | null;
  summary_public: string;
}

function fmt(n: number | null) {
  if (!n) return "—";
  return `₦${n.toLocaleString("en-NG")}`;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--hairline)",
        padding: "14px 0",
        display: "flex",
        gap: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          flexShrink: 0,
          width: 160,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 16,
          color: "var(--ink)",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default function PathCUnlockView({ deal }: { deal: Deal }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  function handleSuccess() {
    setModalOpen(false);
    router.refresh();
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--cream)",
          color: "var(--ink)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
              gap: 16,
            }}
          >
            <Link
              href="/opportunities"
              style={{
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              ← All opportunities
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              Dashboard
            </Link>
          </div>

          {deal.industry && (
            <span
              style={{
                fontFamily: "var(--in)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                border: "1px solid var(--hairline)",
                padding: "3px 8px",
                display: "inline-block",
                marginBottom: 16,
              }}
            >
              {deal.industry}
            </span>
          )}

          <h1
            style={{
              fontFamily: "var(--sr)",
              fontSize: 38,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: "0 0 32px",
            }}
          >
            {deal.business_name}
          </h1>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginBottom: 40,
              paddingBottom: 32,
              borderBottom: "1px solid var(--hairline)",
              flexWrap: "wrap",
            }}
          >
            {deal.funding_required && (
              <div>
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Seeking
                </p>
                <p
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: 24,
                    fontWeight: 300,
                    color: "var(--ink)",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span style={{ fontFamily: "'Aileron', system-ui, sans-serif" }}>₦</span>
                  {deal.funding_required.toLocaleString("en-NG")}
                </p>
              </div>
            )}
            {deal.revenue_to_date && (
              <div>
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Revenue to date
                </p>
                <p
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: 24,
                    fontWeight: 300,
                    color: "var(--ink)",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span style={{ fontFamily: "'Aileron', system-ui, sans-serif" }}>₦</span>
                  {deal.revenue_to_date.toLocaleString("en-NG")}
                </p>
              </div>
            )}
          </div>

          {/* Overview */}
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              margin: "0 0 12px",
            }}
          >
            Overview
          </p>
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 17,
              color: "var(--ink)",
              lineHeight: 1.8,
              margin: "0 0 40px",
            }}
          >
            {deal.summary_public}
          </p>

          {/* Locked full details section */}
          <div style={{ marginBottom: 48 }}>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                margin: "0 0 12px",
              }}
            >
              Full details
            </p>

            <div style={{ position: "relative" }}>
              {/* Blurred placeholder — aria-hidden, never contains real deal data */}
              <div
                aria-hidden="true"
                style={{
                  border: "1px solid var(--hairline)",
                  padding: "28px 32px",
                  backgroundColor: "rgba(17,17,17,0.04)",
                  filter: "blur(5px)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {[88, 72, 95, 64, 80, 55, 90].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: 13,
                      width: `${w}%`,
                      backgroundColor: "rgba(17,17,17,0.1)",
                      borderRadius: 3,
                      marginBottom: i === 6 ? 0 : 14,
                    }}
                  />
                ))}
              </div>

              {/* Overlay with unlock CTA */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(248,237,235,0.92)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  textAlign: "center",
                  padding: "32px 24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: 17,
                    fontWeight: 300,
                    color: "var(--ink)",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Full details require membership
                </p>
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    color: "var(--muted)",
                    margin: 0,
                    maxWidth: 320,
                    lineHeight: 1.6,
                  }}
                >
                  One-time{" "}
                  <span style={{ fontFamily: "'Aileron', system-ui, sans-serif" }}>₦</span>
                  10,000 — permanent access to all gated deal details.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    letterSpacing: "0.04em",
                    padding: "10px 24px",
                    backgroundColor: "#C4693A",
                    color: "var(--cream)",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Unlock full details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal — always rendered so Paystack script loads on mount */}
      <MembershipModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
