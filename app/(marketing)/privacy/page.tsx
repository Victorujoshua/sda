import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SDA",
  description: "SDA Privacy Policy — how we collect, use, and protect your data.",
  openGraph: {
    title: "Privacy Policy — SDA",
    description: "SDA Privacy Policy.",
    url: "https://sda.ng/privacy",
    siteName: "SDA",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main style={{ padding: "120px 40px 80px", maxWidth: "720px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
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
        Privacy Policy
      </h1>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "14px",
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
            heading: "1. What we collect",
            body: "We collect information you provide when you create an account, submit an application, or contact us. This includes your name, email address, phone number, business details, and financial documents you upload. We also collect usage data automatically via analytics.",
          },
          {
            heading: "2. How we use your data",
            body: "We use your data to process applications, match opportunities, send transactional notifications, and improve the platform. We do not sell your data to third parties. We do not use your data for advertising.",
          },
          {
            heading: "3. Document storage",
            body: "Financial documents are stored in private, encrypted cloud storage. They are never publicly accessible. Access is restricted to SDA admin personnel and governed by row-level security policies.",
          },
          {
            heading: "4. Data retention",
            body: "We retain your account data for as long as your account is active. Application data is retained for a minimum of 5 years for compliance purposes. You may request deletion of personal data by contacting us.",
          },
          {
            heading: "5. Your rights",
            body: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@sda.ng. We will respond within 30 days.",
          },
          {
            heading: "6. Cookies",
            body: "We use only essential cookies required for authentication and session management. We do not use advertising or tracking cookies.",
          },
          {
            heading: "7. Contact",
            body: "For privacy-related questions, contact privacy@sda.ng.",
          },
        ].map(({ heading, body }) => (
          <div key={heading}>
            <h2 style={{
              fontFamily: "var(--sr)",
              fontSize: "18px",
              fontWeight: 400,
              color: "#FAFAF8",
              margin: "0 0 10px",
            }}>
              {heading}
            </h2>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "16px",
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
