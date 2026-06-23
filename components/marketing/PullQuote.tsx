export default function PullQuote() {
  return (
    <section style={{
      position: "relative",
      backgroundImage: "url('/images/bg_2.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "72px 40px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}>
      {/* Dark overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        zIndex: 0,
      }} />

      {/* Content above overlay */}
      <div className="sda-pull-quote-grid" style={{ position: "relative", zIndex: 1 }}>
        <div>
          <blockquote style={{
            fontFamily: "var(--sr)",
            fontSize: "54px",
            fontWeight: 300,
            lineHeight: 1.22,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.88)",
            fontStyle: "normal",
            margin: 0,
          }}>
            &ldquo;Capital should meet businesses that are already doing the work.&rdquo;
          </blockquote>
          <p style={{
            fontFamily: "var(--in)",
            fontSize: "15px",
            color: "rgba(255,255,255,0.35)",
            marginTop: "20px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            SDA · Micro Angel Investing Platform · Nigeria
          </p>
        </div>

        {/* Right panel — awaiting team photo from client */}
        <div style={{
          height: "220px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--sr)",
            fontSize: "18px",
            fontWeight: 300,
            color: "#FAFAF8",
          }}>
            SDA
          </div>
          <p style={{
            fontFamily: "var(--in)",
            fontSize: "15px",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            Investment team
          </p>
        </div>
      </div>
    </section>
  );
}
