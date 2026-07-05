import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Imani Ventures",
  description:
    "Imani Ventures is a micro angel investment platform backing early-stage Nigerian businesses with traction. Learn about our team and approach.",
  openGraph: {
    title: "About — Imani Ventures",
    description:
      "Imani Ventures is a micro angel investment platform backing early-stage Nigerian businesses with traction.",
    url: "https://imaniventures.org/about",
    siteName: "Imani Ventures",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main style={{ padding: "120px 40px 80px", maxWidth: "860px" }}>
      {/* Eyebrow */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(17,17,17,0.35)",
        marginBottom: "20px",
      }}>
        About Imani Ventures
      </p>

      <h1 style={{
        fontFamily: "var(--sr)",
        fontSize: "52px",
        fontWeight: 300,
        lineHeight: 1.06,
        letterSpacing: "-0.025em",
        color: "var(--ink)",
        marginBottom: "32px",
      }}>
        Capital for Nigerian businesses{" "}
        <em style={{ fontStyle: "normal", fontWeight: 300, color: "rgba(17,17,17,0.45)" }}>
          already moving.
        </em>
      </h1>

      <div style={{
        borderTop: "1px solid var(--hairline)",
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "600px",
      }}>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          lineHeight: 1.7,
          color: "rgba(17,17,17,0.65)",
        }}>
          Imani Ventures is a micro angel investment platform repositioned to connect serious
          capital with early-stage Nigerian businesses that already have traction —
          revenue, customers, and a clear sense of where they are going.
        </p>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          lineHeight: 1.7,
          color: "rgba(17,17,17,0.65)",
        }}>
          We are not a grant programme. We are not a pitch competition. We back
          operators who understand their market and have already started building
          something real.
        </p>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          lineHeight: 1.7,
          color: "rgba(17,17,17,0.65)",
        }}>
          Our funding instruments — equity, debt, asset financing, and
          revenue-based funding — are structured to match the stage and shape of
          each business. We work with founders who want a partner, not just a
          cheque.
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        marginTop: "64px",
        borderTop: "1px solid var(--hairline)",
        paddingTop: "40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "1px",
        backgroundColor: "var(--hairline)",
      }}>
        {[
          { stat: "4+", label: "portfolio companies" },
          { stat: "3+", label: "sectors backed" },
          { stat: "Nigeria", label: "focus market" },
        ].map(({ stat, label }) => (
          <div key={label} style={{
            backgroundColor: "var(--ink)",
            padding: "32px 24px",
          }}>
            <p style={{
              fontFamily: "var(--sr)",
              fontSize: "42px",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              color: "var(--cream)",
              margin: "0 0 6px",
            }}>
              {stat}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "14px",
              color: "rgba(248,237,235,0.55)",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
