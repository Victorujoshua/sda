import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SDA",
  description: "SDA Terms of Service — the rules governing use of the SDA platform.",
  openGraph: {
    title: "Terms of Service — SDA",
    description: "SDA Terms of Service.",
    url: "https://sda.ng/terms",
    siteName: "SDA",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main style={{ padding: "120px 40px 80px", maxWidth: "720px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.3)",
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
        color: "#FAFAF8",
        marginBottom: "12px",
      }}>
        Terms of Service
      </h1>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "12px",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "48px",
      }}>
        Last updated: June 2025
      </p>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "40px",
      }}>
        {[
          {
            heading: "1. Acceptance",
            body: "By accessing or using the SDA platform, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.",
          },
          {
            heading: "2. Eligibility",
            body: "You must be at least 18 years old and legally permitted to enter contracts in Nigeria to use this platform. Business applicants must represent a legally registered Nigerian entity.",
          },
          {
            heading: "3. Platform purpose",
            body: "SDA is a facilitator of investment introductions. We do not provide financial advice, guarantee investment returns, or manage money on behalf of investors or applicants. No financial transaction takes place on this platform.",
          },
          {
            heading: "4. Accuracy of information",
            body: "You agree to provide accurate, complete, and current information. Misrepresentation, fraud, or submission of false documents will result in immediate account suspension and may be reported to relevant authorities.",
          },
          {
            heading: "5. Intellectual property",
            body: "All content on this platform — including deal summaries prepared by SDA — is owned by SDA. You may not reproduce, distribute, or use this content without written permission.",
          },
          {
            heading: "6. Limitation of liability",
            body: "SDA is not liable for any investment losses. Investment involves risk. Past portfolio performance does not guarantee future results. You are solely responsible for your investment decisions.",
          },
          {
            heading: "7. Account termination",
            body: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or are identified as posing risk to other users.",
          },
          {
            heading: "8. Governing law",
            body: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in the courts of Lagos State.",
          },
          {
            heading: "9. Contact",
            body: "For questions about these terms, contact legal@sda.ng.",
          },
        ].map(({ heading, body }) => (
          <div key={heading}>
            <h2 style={{
              fontFamily: "var(--sr)",
              fontSize: "16px",
              fontWeight: 400,
              color: "#FAFAF8",
              margin: "0 0 10px",
            }}>
              {heading}
            </h2>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
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
