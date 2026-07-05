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
          marginBottom: "32px",
        }}>
          Imani Ventures is a private capital platform built for MSMEs that are already in motion.
We focus on businesses with proven traction, clear financial visibility, and the capacity to grow
with the right capital structure.
        </p>

        <div style={{ marginBottom: "32px" }}>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: 0,
          }}>
            This is not a marketplace for ideas.
          </p>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: 0,
          }}>
            It is access to businesses
          </p>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--crimson)",
            margin: 0,
          }}>
             with evidence.
          </p>
        </div>

      </div>

      {/* Right column — Remotion: reel with white bg removed, subject crimson */}
      <div className="imani-intro-video-col" style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#F8EDEB",
      }}>
        <IntroAnimation />
      </div>
    </section>
  );
}
