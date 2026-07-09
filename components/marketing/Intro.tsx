import IntroAnimation from "@/components/marketing/IntroAnimation";

export default function Intro() {
  return (
    <section className="imani-intro-section" style={{
      backgroundColor: "var(--cream)",
      borderBottom: "1px solid var(--hairline)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 0,
      alignItems: "stretch",
      minHeight: "500px",
    }}>
      {/* Left column — text content */}
      <div className="imani-intro-left" style={{ padding: "80px 48px" }}>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: 1.8,
          color: "rgba(17,17,17,0.65)",
          marginBottom: "24px",
        }}>
          Imani Ventures is a private capital platform built for MSMEs that are already in motion.
We focus on businesses with proven traction, clear financial visibility, and the capacity to grow
with the right capital structure.
        </p>

        <p style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: 1.8,
          color: "rgba(17,17,17,0.65)",
          marginBottom: "32px",
        }}>
          On the other side, we provide investors with access to curated opportunities structured around real cash flow, not just projections.
        </p>

        <div style={{ marginBottom: "32px" }}>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "32px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: 0,
          }}>
            This is not a marketplace for ideas. It is access to businesses{" "}
            <span style={{ color: "var(--crimson)" }}>with evidence.</span>
          </p>
        </div>

      </div>

      {/* Right column — Remotion: reel with white bg removed, subject crimson */}
      <div className="imani-intro-video-col" style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#B22325",
      }}>
        <IntroAnimation />
      </div>
    </section>
  );
}
