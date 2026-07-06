import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apply for Funding — Imani Ventures",
  description:
    "Apply for micro angel investment from Imani Ventures. We fund early-stage Nigerian businesses with traction across equity, debt, asset financing, and revenue-based instruments.",
  openGraph: {
    title: "Apply for Funding — Imani Ventures",
    description:
      "Apply for micro angel investment. We fund Nigerian businesses with traction.",
    url: "https://imaniventures.org/apply",
    siteName: "Imani Ventures",
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
    <main className="imani-page-main" style={{ padding: "120px 40px 80px" }}>
      {/* Header */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(17,17,17,0.35)",
        marginBottom: "20px",
      }}>
        Apply for funding
      </p>
      <h1 className="imani-page-h1" style={{
        fontFamily: "var(--sr)",
        fontSize: "52px",
        fontWeight: 300,
        lineHeight: 1.06,
        letterSpacing: "-0.025em",
        color: "var(--ink)",
        marginBottom: "20px",
        maxWidth: "640px",
      }}>
        We fund businesses{" "}
        <em style={{ fontStyle: "normal", fontWeight: 300, color: "rgba(17,17,17,0.45)" }}>
          with traction.
        </em>
      </h1>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "18px",
        lineHeight: 1.7,
        color: "rgba(17,17,17,0.65)",
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
        color: "var(--ink)",
        marginBottom: "24px",
      }}>
        What we look for
      </h2>
      <div style={{
        border: "1px solid var(--crimson)",
        backgroundColor: "rgba(178,35,41,0.06)",
        padding: "32px",
        marginBottom: "72px",
      }}>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {CRITERIA.map((item) => (
            <li
              key={item}
              style={{
                borderBottom: "1px solid var(--hairline)",
                padding: "16px 0",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                fontFamily: "var(--in)",
                fontSize: "18px",
                lineHeight: 1.6,
                color: "var(--ink)",
              }}
            >
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--crimson)",
                flexShrink: 0,
                marginTop: "9px",
              }} />
              {item}
            </li>
          ))}
        </ul>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "16px",
          fontWeight: 500,
          color: "var(--crimson)",
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
        color: "var(--ink)",
        marginBottom: "24px",
      }}>
        Funding instruments
      </h2>
      <div className="imani-instruments-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "64px",
      }}>
        {INSTRUMENTS.map(({ type, description, note }) => (
          <div key={type} className="imani-instrument-card" style={{ padding: "32px 28px" }}>
            <p style={{
              fontFamily: "var(--sr)",
              fontSize: "18px",
              fontWeight: 300,
              color: "var(--ink)",
              margin: "0 0 10px",
            }}>
              {type}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "rgba(17,17,17,0.65)",
              margin: "0 0 12px",
            }}>
              {description}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "14px",
              color: "rgba(17,17,17,0.4)",
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
          backgroundColor: "var(--crimson)",
          color: "#FAFAF8",
          fontFamily: "var(--in)",
          fontSize: "14px",
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
