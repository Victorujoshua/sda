import Image from "next/image";
import { PORTFOLIO_COMPANIES } from "@/lib/portfolio-data";

export default function PortfolioFeature() {
  return (
    <section className="imani-portfolio-feature">
      {/* Left — quote */}
      <div style={{
        padding: "56px 40px",
        borderRight: "1px solid var(--hairline)",
      }}>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "15px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "rgba(17,17,17,0.35)",
          marginBottom: "20px",
        }}>
          Portfolio feature
        </p>
        <blockquote style={{
          fontFamily: "var(--sr)",
          fontSize: "24px",
          fontWeight: 300,
          lineHeight: 1.5,
          color: "var(--ink)",
          fontStyle: "normal",
          margin: "0 0 20px",
        }}>
          &ldquo;The platform connects investors to businesses that are already operating
          and generating revenue. Each opportunity is selected based on traction,
          clarity, and growth potential.&rdquo;
        </blockquote>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "15px",
          color: "rgba(17,17,17,0.4)",
          letterSpacing: "0.04em",
        }}>
          Imani Ventures Investment Team
        </p>
      </div>

      {/* Right — company list */}
      <div style={{
        backgroundColor: "var(--ink)",
        padding: "40px",
      }}>
        <span style={{
          display: "inline-block",
          backgroundColor: "rgba(255,255,255,0.08)",
          fontFamily: "var(--in)",
          fontSize: "9px",
          color: "#FAFAF8",
          padding: "4px 10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}>
          Backed businesses
        </span>

        <div>
          {PORTFOLIO_COMPANIES.map((company) => (
            <div
              key={company.name}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid rgba(0,0,0,0.15)",
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--sr)",
                fontSize: "10px",
                fontWeight: 600,
                color: "#FAFAF8",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}>
                {company.image ? (
                  <Image
                    src={company.image}
                    alt={company.name}
                    fill
                    sizes="32px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  company.initials
                )}
              </div>
              <div>
                <p style={{
                  fontFamily: "var(--sr)",
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#FAFAF8",
                  margin: "0 0 2px",
                }}>
                  {company.name}
                </p>
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.35)",
                  margin: 0,
                }}>
                  {company.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
