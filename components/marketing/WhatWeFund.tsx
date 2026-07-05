const CRITERIA = [
  "Have a minimum of 6 months verifiable revenue",
  "Understand their financial position clearly",
  "Operate with discipline and consistency",
  "Have clear potential for growth with additional capital",
];

export default function WhatWeFund() {
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
          What we fund
        </p>

        <h2
          style={{
            fontFamily: "var(--sr)",
            fontSize: "42px",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: "40px",
            lineHeight: 1.12,
          }}
        >
          We back businesses that:
        </h2>

        <div>
          {CRITERIA.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 0",
                borderTop: "1px solid var(--hairline)",
                borderBottom:
                  i === CRITERIA.length - 1
                    ? "1px solid var(--hairline)"
                    : undefined,
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--crimson)",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: "18px",
                  color: "var(--ink)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: "17px",
            lineHeight: 1.6,
            color: "rgba(17,17,17,0.65)",
            maxWidth: "640px",
            marginTop: "40px",
            marginBottom: 0,
          }}
        >
          If your business is already generating revenue and needs structured
          funding, you are in the right place.
        </p>
      </div>
    </section>
  );
}
