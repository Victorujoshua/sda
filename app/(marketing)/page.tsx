export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--in)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "48px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--muted)",
          marginBottom: "24px",
        }}
      >
        SDA · Micro Angel Investing · Nigeria
      </p>

      <h1
        style={{
          fontFamily: "var(--sr)",
          fontSize: "58px",
          fontWeight: 300,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          marginBottom: "16px",
        }}
      >
        Marketing placeholder
      </h1>

      <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "var(--muted)" }}>
        Route: <code>/</code> — (marketing) group — Section 6 builds this page.
      </p>

      <div
        style={{
          marginTop: "32px",
          display: "flex",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "--ink", color: "#0A0A0A" },
            { label: "--paper", color: "#FAFAF8", border: "#E5E4DF" },
            { label: "--accent", color: "#1A3D2F" },
            { label: "--muted", color: "#6B6B6B" },
            { label: "--surface", color: "#F2F1EC", border: "#E5E4DF" },
            { label: "--success", color: "#2D6A4F" },
            { label: "--warning", color: "#B45309" },
            { label: "--danger", color: "#991B1B" },
          ].map(({ label, color, border }) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--in)",
                fontSize: "11px",
                color: "var(--muted)",
              }}
            >
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: color,
                  border: `1px solid ${border ?? "#0A0A0A33"}`,
                  flexShrink: 0,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
