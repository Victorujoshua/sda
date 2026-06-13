import { Metadata } from "next";
import { PORTFOLIO_COMPANIES } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Portfolio — SDA",
  description:
    "Meet the Nigerian businesses SDA has backed. Early-stage companies across food, e-commerce, and consumer goods.",
  openGraph: {
    title: "Portfolio — SDA",
    description: "Meet the Nigerian businesses SDA has backed.",
    url: "https://sda.ng/portfolio",
    siteName: "SDA",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <main style={{ padding: "120px 40px 80px" }}>
      {/* Header */}
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "20px",
      }}>
        Our portfolio
      </p>
      <h1 style={{
        fontFamily: "var(--sr)",
        fontSize: "52px",
        fontWeight: 300,
        lineHeight: 1.06,
        letterSpacing: "-0.025em",
        color: "#FAFAF8",
        marginBottom: "56px",
      }}>
        Backed businesses.
      </h1>

      {/* Company cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {PORTFOLIO_COMPANIES.map((company) => (
          <div key={company.name} className="sda-portfolio-card" style={{ padding: "32px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr auto",
              gap: "32px",
              alignItems: "start",
            }}>
              {/* Initials circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#1A3D2F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--sr)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FAFAF8",
                flexShrink: 0,
              }}>
                {company.initials}
              </div>

              {/* Name + description + tags */}
              <div>
                <h2 style={{
                  fontFamily: "var(--sr)",
                  fontSize: "20px",
                  fontWeight: 300,
                  color: "#FAFAF8",
                  margin: "0 0 8px",
                }}>
                  {company.name}
                </h2>
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "15px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.55)",
                  margin: "0 0 16px",
                  maxWidth: "480px",
                }}>
                  {company.description}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {company.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: "#CF9A0A",
                        color: "#0A0A0A",
                        fontFamily: "var(--in)",
                        fontSize: "10px",
                        fontWeight: 500,
                        padding: "3px 10px",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sector + city */}
              <div style={{ textAlign: "right", paddingTop: "4px" }}>
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 4px",
                }}>
                  {company.sector}
                </p>
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.25)",
                  margin: 0,
                }}>
                  {company.city}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
