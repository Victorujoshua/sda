const FUNDING_TYPES = [
  {
    type: "Equity",
    description: "Ownership stake in exchange for capital.",
    note: "Suitable for high-growth businesses",
  },
  {
    type: "Debt",
    description: "Fixed repayment schedule over an agreed term.",
    note: "Suitable for businesses with steady cash flow",
  },
  {
    type: "Asset financing",
    description: "Secured against business assets or equipment.",
    note: "Suitable for capital-intensive operations",
  },
  {
    type: "Revenue-based",
    description: "Repay as a percentage of monthly revenue.",
    note: "Suitable for businesses with variable income",
  },
];

export default function FundingOptions() {
  return (
    <section
      id="funding-options"
      style={{ padding: "72px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "16px",
      }}>
        How we fund
      </p>
      <h2 style={{
        fontFamily: "var(--sr)",
        fontSize: "38px",
        fontWeight: 300,
        letterSpacing: "-0.02em",
        color: "#FAFAF8",
        marginBottom: "48px",
      }}>
        Flexible structures for real business needs.
      </h2>

      <div className="sda-funding-grid">
        {FUNDING_TYPES.map((item) => (
          <div
            key={item.type}
            style={{ backgroundColor: "#0A0A0A", padding: "36px 28px" }}
          >
            <p style={{
              fontFamily: "var(--sr)",
              fontSize: "22px",
              fontWeight: 400,
              color: "#FAFAF8",
              marginBottom: "10px",
            }}>
              {item.type}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              marginBottom: "8px",
            }}>
              {item.description}
            </p>
            <p style={{
              fontFamily: "var(--in)",
              fontSize: "14px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.25)",
            }}>
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
