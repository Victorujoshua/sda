import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Investors — Imani Ventures",
  description:
    "Invest in early-stage Nigerian businesses with traction. Imani Ventures curates deal flow, conducts due diligence, and structures investment opportunities for angel investors.",
  openGraph: {
    title: "For Investors — Imani Ventures",
    description:
      "Invest in early-stage Nigerian businesses with traction. Curated deal flow for angel investors.",
    url: "https://imaniventures.org/investors",
    siteName: "Imani Ventures",
    type: "website",
  },
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse deal summaries",
    body: "All deal summaries are publicly visible. You can review sector, stage, funding type, and headline metrics without logging in.",
  },
  {
    step: "02",
    title: "Create an account",
    body: "Register as an investor to access full deal documentation, founder profiles, financial summaries, and due diligence materials.",
  },
  {
    step: "03",
    title: "Express interest",
    body: "When you find a deal you want to pursue, express your interest. The Imani Ventures team connects you with the founding team to discuss terms.",
  },
  {
    step: "04",
    title: "Commit offline",
    body: "Investment commitments in V1 are recorded offline. No money moves through this platform — Imani Ventures facilitates introductions and term discussions.",
  },
];

export default function InvestorsPage() {
  return (
    <main style={{ padding: "120px 40px 80px" }}>
      {/* Header */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(17,17,17,0.35)",
        marginBottom: "20px",
      }}>
        For investors
      </p>
      <h1 style={{
        fontFamily: "var(--sr)",
        fontSize: "52px",
        fontWeight: 300,
        lineHeight: 1.06,
        letterSpacing: "-0.025em",
        color: "var(--ink)",
        marginBottom: "20px",
        maxWidth: "680px",
      }}>
        Access curated deals in{" "}
        <em style={{ fontStyle: "normal", fontWeight: 300, color: "rgba(17,17,17,0.45)" }}>
          Nigerian early-stage companies.
        </em>
      </h1>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "18px",
        lineHeight: 1.7,
        color: "rgba(17,17,17,0.65)",
        maxWidth: "560px",
        marginBottom: "48px",
      }}>
        Imani Ventures conducts initial screening, reviews financials, and structures deal
        summaries so you can evaluate opportunities quickly and confidently.
      </p>

      <div style={{ display: "flex", gap: "16px", marginBottom: "80px" }}>
        <Link
          href="/opportunities"
          style={{
            display: "inline-block",
            backgroundColor: "var(--crimson)",
            color: "#FAFAF8",
            fontFamily: "var(--in)",
            fontSize: "14px",
            letterSpacing: "0.04em",
            padding: "12px 28px",
            textDecoration: "none",
          }}
        >
          Explore Opportunities
        </Link>
        <Link
          href="/signup/investor"
          style={{
            display: "inline-block",
            border: "1px solid var(--hairline)",
            color: "var(--ink)",
            fontFamily: "var(--in)",
            fontSize: "14px",
            letterSpacing: "0.04em",
            padding: "12px 28px",
            textDecoration: "none",
          }}
        >
          Create account
        </Link>
      </div>

      {/* How it works */}
      <h2 style={{
        fontFamily: "var(--sr)",
        fontSize: "28px",
        fontWeight: 300,
        letterSpacing: "-0.01em",
        color: "var(--ink)",
        marginBottom: "32px",
      }}>
        How it works
      </h2>
      <div style={{ borderTop: "1px solid var(--hairline)" }}>
        {HOW_IT_WORKS.map(({ step, title, body }) => (
          <div
            key={step}
            style={{
              borderBottom: "1px solid var(--hairline)",
              padding: "32px 0",
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: "32px",
            }}
          >
            <span style={{
              fontFamily: "var(--in)",
              fontSize: "13px",
              color: "rgba(17,17,17,0.35)",
              letterSpacing: "0.04em",
              paddingTop: "3px",
            }}>
              {step}
            </span>
            <div>
              <p style={{
                fontFamily: "var(--sr)",
                fontSize: "18px",
                fontWeight: 400,
                color: "var(--ink)",
                margin: "0 0 8px",
              }}>
                {title}
              </p>
              <p style={{
                fontFamily: "var(--in)",
                fontSize: "17px",
                lineHeight: 1.65,
                color: "rgba(17,17,17,0.65)",
                margin: 0,
                maxWidth: "480px",
              }}>
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fee note */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "15px",
        lineHeight: 1.7,
        color: "rgba(17,17,17,0.45)",
        maxWidth: "520px",
        marginTop: "40px",
      }}>
        We charge a combination of diligence and administrative fees to investors
        who are accepted onto the platform. These fees cover deal sourcing, vetting,
        documentation, and ongoing operational support.
      </p>
    </main>
  );
}
