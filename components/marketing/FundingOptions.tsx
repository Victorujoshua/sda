import Image from "next/image";

const FUNDING_TYPES = [
  {
    type: "Revenue-Based Financing",
    description: "Returns linked to business revenue over time",
    icon: "/images/icons/revenue.svg",
  },
  {
    type: "Fixed Return Financing",
    description: "Structured repayments over a defined period",
    icon: "/images/icons/debt.svg",
  },
  {
    type: "Profit Sharing",
    description: "Returns aligned with business performance",
    icon: "/images/icons/asset.svg",
  },
  {
    type: "Equity",
    description: "Long-term participation in growth",
    icon: "/images/icons/equity.svg",
  },
  {
    // Hybrid Structures spans full width — icon placeholder: equity.svg
    // TODO: replace icon with a dedicated hybrid/combined icon
    type: "Hybrid Structures",
    description: "A combination of income and long-term upside",
    icon: "/images/icons/equity.svg",
    fullWidth: true,
  },
] as const;

export default function FundingOptions() {
  return (
    <section
      id="funding-options"
      style={{
        backgroundColor: "var(--ink)",
        padding: "72px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "17px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.45)",
        marginBottom: "16px",
      }}>
        How capital is structured
      </p>

      <h2 style={{
        fontFamily: "var(--sr)",
        fontSize: "38px",
        fontWeight: 300,
        letterSpacing: "-0.02em",
        color: "#FAFAF8",
        marginBottom: 0,
      }}>
        Not all businesses need the same type of capital.
      </h2>

      <p style={{
        fontFamily: "var(--in)",
        fontSize: "18px",
        fontWeight: 400,
        lineHeight: 1.6,
        color: "rgba(255,255,255,0.55)",
        maxWidth: "600px",
        marginTop: "16px",
        marginBottom: "48px",
      }}>
        We structure financing based on how the business actually operates.
      </p>

      <div className="imani-funding-grid" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        {FUNDING_TYPES.map((item) => (
          <div
            key={item.type}
            style={{
              backgroundColor: "var(--ink)",
              padding: "40px 36px",
              ...("fullWidth" in item && item.fullWidth ? { gridColumn: "1 / -1" } : {}),
            }}
          >
            <div className="imani-funding-card">
              <div style={{ flex: 1 }}>
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
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.6,
                  marginBottom: 0,
                }}>
                  {item.description}
                </p>
              </div>
              <div className="imani-funding-icon">
                <Image
                  src={item.icon}
                  alt={item.type}
                  width={64}
                  height={64}
                  style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Closing statement */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "15px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.45)",
        marginTop: "48px",
        marginBottom: 0,
      }}>
        The goal is simple
      </p>
      <p style={{
        fontFamily: "var(--sr)",
        fontSize: "24px",
        fontWeight: 300,
        color: "#FAFAF8",
        marginTop: "12px",
        marginBottom: 0,
      }}>
        Capital that fits the business, not the other way around.
      </p>
    </section>
  );
}
