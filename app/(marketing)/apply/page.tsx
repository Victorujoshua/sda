import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apply for Funding — SDA",
  description:
    "Apply for micro angel investment from SDA. We fund early-stage Nigerian businesses with traction across equity, debt, asset financing, and revenue-based instruments.",
  openGraph: {
    title: "Apply for Funding — SDA",
    description:
      "Apply for micro angel investment. We fund Nigerian businesses with traction.",
    url: "https://sda.ng/apply",
    siteName: "SDA",
    type: "website",
  },
};

const CRITERIA = [
  "Nigerian-registered business, at least 6 months operating",
  "Generating revenue — no pre-revenue ideas",
  "Clear use of funds with a defined return mechanism",
  "Founder willing to share financials and operate transparently",
];

const INSTRUMENTS = [
  {
    type: "Equity",
    description: "We take a minority stake in exchange for capital.",
    note: "Typical range: ₦2M – ₦15M",
  },
  {
    type: "Debt",
    description: "Fixed-term loan with agreed repayment schedule.",
    note: "Typical range: ₦500K – ₦5M",
  },
  {
    type: "Asset financing",
    description: "We fund a specific asset — equipment, inventory, vehicle.",
    note: "Asset-backed; quicker to close",
  },
  {
    type: "Revenue-based",
    description: "Repayment as a percentage of monthly revenue until target met.",
    note: "Flexible for seasonal businesses",
  },
];

export default function ApplyPage() {
  return (
    <main style={{ padding: "120px 40px 80px" }}>
      {/* Header */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "20px",
      }}>
        Apply for funding
      </p>
      <h1 style={{
        fontFamily: "var(--sr)",
        fontSize: "52px",
        fontWeight: 300,
        lineHeight: 1.06,
        letterSpacing: "-0.025em",
        color: "#FAFAF8",
        marginBottom: "20px",
        maxWidth: "640px",
      }}>
        We fund businesses{" "}
        <em style={{ fontStyle: "normal", fontWeight: 300, color: "rgba(255,255,255,0.45)" }}>
          with traction.
        </em>
      </h1>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "18px",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.65)",
        maxWidth: "520px",
        marginBottom: "56px",
      }}>
        Not ideas. Not decks. Businesses that are already operating, generating
        revenue, and clear about where they are going next.
      </p>

      {/* Requirements block */}
      <h2 style={{
        fontFamily: "var(--sr)",
        fontSize: "28px",
        fontWeight: 300,
        letterSpacing: "-0.01em",
        color: "#FAFAF8",
        marginBottom: "24px",
      }}>
        What we look for
      </h2>
      <div style={{
        border: "1px solid #CF9A0A",
        backgroundColor: "rgba(207,154,10,0.08)",
        padding: "32px",
        marginBottom: "72px",
      }}>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {CRITERIA.map((item) => (
            <li
              key={item}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "16px 0",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                fontFamily: "var(--in)",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#FAFAF8",
              }}
            >
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#CF9A0A",
                flexShrink: 0,
                marginTop: "9px",
              }} />
              {item}
            </li>
          ))}
        </ul>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "14px",
          fontWeight: 500,
          color: "#CF9A0A",
          margin: "20px 0 0",
        }}>
          Applications that do not meet these criteria will not be considered.
        </p>
      </div>

      {/* Funding instruments */}
      <h2 style={{
        fontFamily: "var(--sr)",
        fontSize: "28px",
        fontWeight: 300,
        letterSpacing: "-0.01em",
        color: "#FAFAF8",
        marginBottom: "24px",
      }}>
        Funding instruments
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "64px",
      }}>
        {INSTRUMENTS.map(({ type, description, note }) => (
          <div key={type} className="sda-instrument-card" style={{ padding: "32px 28px" }}>
            <p style={{
              fontFamily: "var(--sr)",
              fontSize: "18px",
              fontWeight: 300,
              color: "#FAFAF8",
              margin: "0 0 10px",
            }}>
              {type}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.65)",
              margin: "0 0 12px",
            }}>
              {description}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
            }}>
              {note}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/signup"
        style={{
          display: "inline-block",
          backgroundColor: "#CF9A0A",
          color: "#0A0A0A",
          fontFamily: "var(--in)",
          fontSize: "12px",
          letterSpacing: "0.04em",
          padding: "12px 28px",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Start your application
      </Link>
    </main>
  );
}
