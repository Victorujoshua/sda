import Link from "next/link";

const CRITERIA = [
  "At least 6 months of verifiable revenue",
  "Clear understanding of your numbers",
  "Strong potential to scale",
  "Committed, execution-focused founders",
];

export default function WhatWeLookFor() {
  return (
    <section style={{
      padding: "72px 40px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "17px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "40px",
      }}>
        What we look for
      </p>

      <div className="sda-two-col">
        {/* Left — headline */}
        <h2 style={{
          fontFamily: "var(--sr)",
          fontSize: "42px",
          fontWeight: 300,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          color: "#FAFAF8",
          margin: 0,
        }}>
          We support businesses<br />
          built on execution.
        </h2>

        {/* Right — criteria and callout */}
        <div>
          <p style={{
            fontFamily: "var(--in)",
            fontSize: "17px",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7,
            marginBottom: "28px",
          }}>
            If you are already building and need capital, this is for you.
          </p>

          <div>
            {CRITERIA.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 0",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: i === CRITERIA.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : undefined,
                }}
              >
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#CF9A0A",
                  flexShrink: 0,
                }} />
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "20px",
            marginTop: "24px",
          }}>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "18px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
              marginBottom: "12px",
              margin: "0 0 12px",
            }}>
              Applications that do not meet these criteria will not be considered.
            </p>
            <Link
              href="/apply"
              style={{
                fontFamily: "var(--in)",
                fontSize: "17px",
                color: "#CF9A0A",
                textDecoration: "none",
              }}
            >
              Apply for funding →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
