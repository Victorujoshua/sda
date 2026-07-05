import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclosure — Imani Ventures",
  description:
    "Important risk information for investors and applicants on the Imani Ventures platform. Early-stage investment carries significant risk of loss.",
  openGraph: {
    title: "Risk Disclosure — Imani Ventures",
    description: "Important risk disclosure for Imani Ventures investors.",
    url: "https://imaniventures.org/risk-disclosure",
    siteName: "Imani Ventures",
    type: "website",
  },
};

export default function RiskDisclosurePage() {
  return (
    <main style={{ padding: "120px 40px 80px", maxWidth: "720px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(17,17,17,0.35)",
        marginBottom: "20px",
      }}>
        Legal
      </p>
      <h1 style={{
        fontFamily: "var(--sr)",
        fontSize: "38px",
        fontWeight: 300,
        lineHeight: 1.12,
        letterSpacing: "-0.02em",
        color: "var(--ink)",
        marginBottom: "12px",
      }}>
        Risk Disclosure
      </h1>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "14px",
        color: "rgba(17,17,17,0.35)",
        marginBottom: "48px",
      }}>
        Last updated: June 2025
      </p>

      {/* Warning callout — danger red, not gold */}
      <div style={{
        border: "1px solid rgba(153,27,27,0.4)",
        backgroundColor: "rgba(153,27,27,0.06)",
        padding: "20px 24px",
        marginBottom: "48px",
      }}>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "15px",
          lineHeight: 1.65,
          color: "rgba(153,27,27,0.9)",
          margin: 0,
        }}>
          <strong>Important:</strong> Early-stage investment is high risk. You may lose
          all of your invested capital. Do not invest money you cannot afford to lose.
          Past portfolio performance is not indicative of future results.
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        borderTop: "1px solid var(--hairline)",
        paddingTop: "40px",
      }}>
        {[
          {
            heading: "1. Business failure risk",
            body: "The majority of early-stage businesses fail. Even businesses with traction and revenue may not reach profitability or achieve the growth required to generate a return. You should assume that any individual investment may return zero.",
          },
          {
            heading: "2. Illiquidity",
            body: "Investments in private businesses are illiquid. There is no public market for these securities. You may be unable to sell or transfer your investment for years, or at all. Do not invest capital you may need access to.",
          },
          {
            heading: "3. Dilution",
            body: "If a portfolio company raises further capital, your ownership stake may be diluted. Future investors may negotiate terms that disadvantage earlier investors.",
          },
          {
            heading: "4. Currency and macroeconomic risk",
            body: "All Imani Ventures investments are in Nigerian businesses. Naira devaluation, inflation, regulatory change, or macroeconomic shocks specific to Nigeria could impair the value of your investment regardless of the underlying business performance.",
          },
          {
            heading: "5. Information risk",
            body: "The information provided by applicants is self-reported and not independently audited at the application stage. Imani Ventures conducts screening and review but cannot guarantee the accuracy of all information. Invest only after conducting your own due diligence.",
          },
          {
            heading: "6. Regulatory risk",
            body: "The regulatory environment for angel investing and small business finance in Nigeria is subject to change. Changes in law or regulation may affect the value or structure of your investment.",
          },
          {
            heading: "7. No financial advice",
            body: "Nothing on this platform constitutes financial, legal, or tax advice. You should consult a qualified professional before making any investment decision.",
          },
          {
            heading: "8. Diversification",
            body: "Imani Ventures strongly recommends that any investment through this platform represents only a small portion of a diversified portfolio. Do not concentrate your savings in early-stage investments.",
          },
        ].map(({ heading, body }) => (
          <div key={heading}>
            <h2 style={{
              fontFamily: "var(--sr)",
              fontSize: "18px",
              fontWeight: 400,
              color: "var(--ink)",
              margin: "0 0 10px",
            }}>
              {heading}
            </h2>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(17,17,17,0.65)",
              margin: 0,
            }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
