export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--in)",
        padding: "48px",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--sr)",
          fontSize: "32px",
          fontWeight: 300,
          letterSpacing: "-0.01em",
          marginBottom: "12px",
        }}
      >
        App placeholder
      </h1>
      <p style={{ fontFamily: "var(--in)", fontSize: "15px", color: "var(--muted)" }}>
        Route: <code>/dashboard</code> — (app) group — Section 3 builds this page.
      </p>
    </main>
  );
}
