export default function Intro() {
  return (
    <section className="sda-intro-section" style={{
      backgroundColor: "#0A0A0A",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 0,
      alignItems: "stretch",
      minHeight: "500px",
    }}>
      {/* Left column — text content */}
      <div className="sda-intro-left" style={{ padding: "80px 48px" }}>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.65)",
          marginBottom: "32px",
        }}>
          We are building a focused investment platform for businesses that are
          already in motion.
        </p>

        <div style={{ marginBottom: "32px" }}>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#FAFAF8",
            margin: 0,
          }}>
            Not just ideas.
          </p>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#FAFAF8",
            margin: 0,
          }}>
            Not just ambition.
          </p>
          <p style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#CF9A0A",
            margin: 0,
          }}>
            But execution.
          </p>
        </div>

      </div>

      {/* Right column — video */}
      <div className="sda-intro-video-col" style={{
        position: "relative",
        overflow: "hidden",
      }}>
        <video
          src="/videos/sda_reel.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
          }}
        />
        {/* Light overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 1,
        }} />
      </div>
    </section>
  );
}
