import Link from "next/link";

export default function ForInvestors() {
  return (
    <section style={{
      backgroundColor: "#0A0A0A",
      padding: "80px 40px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        fontWeight: 400,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "32px",
      }}>
        For Investors
      </p>

      <h2 style={{
        fontFamily: "var(--sr)",
        fontSize: "42px",
        fontWeight: 300,
        lineHeight: 1.15,
        color: "#FAFAF8",
        maxWidth: "760px",
        marginBottom: "32px",
      }}>
        We connect investors to businesses<br />that are already operating and generating revenue.
      </h2>

      <p style={{
        fontFamily: "var(--in)",
        fontSize: "18px",
        fontWeight: 400,
        lineHeight: 1.8,
        color: "rgba(255,255,255,0.65)",
        marginBottom: "8px",
      }}>
        Each opportunity is selected based on traction, clarity, and growth potential.
      </p>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "18px",
        fontWeight: 400,
        lineHeight: 1.8,
        color: "rgba(255,255,255,0.65)",
        marginBottom: 0,
      }}>
        No noise. No guesswork. Just credible businesses.
      </p>

      <Link
        href="/opportunities"
        style={{
          display: "inline-block",
          marginTop: "32px",
          fontFamily: "var(--in)",
          fontSize: "16px",
          fontWeight: 500,
          color: "#CF9A0A",
          textDecoration: "none",
          letterSpacing: "0.04em",
          borderBottom: "1px solid #CF9A0A",
          paddingBottom: "2px",
        }}
      >
        Explore Opportunities →
      </Link>
    </section>
  );
}
