const STEPS = [
  "Businesses apply and undergo screening",
  "Financials and operations are reviewed",
  "Funding is structured based on business cash flow",
  "Opportunities are shared with approved investors",
  "Investors decide which deals to participate in",
];

export default function HowItWorks() {
  return (
    <section
      style={{
        backgroundColor: "var(--cream)",
        padding: "80px 40px",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: "15px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "rgba(17,17,17,0.35)",
            marginBottom: "32px",
          }}
        >
          How the platform works
        </p>

        <h2
          style={{
            fontFamily: "var(--sr)",
            fontSize: "42px",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            lineHeight: 1.12,
            marginBottom: "48px",
          }}
        >
          We operate as a curated investment network.
        </h2>

        <div>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                padding: "20px 0",
                borderTop: "1px solid var(--hairline)",
                borderBottom:
                  i === STEPS.length - 1
                    ? "1px solid var(--hairline)"
                    : undefined,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid var(--hairline)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: "18px",
                    fontWeight: 400,
                    color: "var(--crimson)",
                  }}
                >
                  {i + 1}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: "18px",
                  color: "var(--ink)",
                  lineHeight: 1.5,
                  margin: 0,
                  paddingTop: "4px",
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "48px" }}>
          <p
            style={{
              fontFamily: "var(--sr)",
              fontSize: "22px",
              fontWeight: 300,
              color: "rgba(17,17,17,0.45)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            No open marketplace
          </p>
          <p
            style={{
              fontFamily: "var(--sr)",
              fontSize: "22px",
              fontWeight: 300,
              color: "rgba(17,17,17,0.45)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            No noise
          </p>
          <p
            style={{
              fontFamily: "var(--sr)",
              fontSize: "22px",
              fontWeight: 300,
              color: "var(--ink)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Only filtered opportunities
          </p>
        </div>
      </div>
    </section>
  );
}
