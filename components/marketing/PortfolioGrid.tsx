import Image from "next/image";
import { HOMEPAGE_PORTFOLIO } from "@/lib/portfolio-data";

export default function PortfolioGrid() {
  const companies = HOMEPAGE_PORTFOLIO;

  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      {/* heading */}
      <div style={{
        padding: "48px 40px 0",
        overflow: "hidden",
        display: "flex",
        alignItems: "baseline",
        gap: "0",
      }}>
        <span style={{
          fontFamily: "var(--sr)",
          fontSize: "64px",
          fontWeight: 300,
          color: "rgba(17,17,17,0.06)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginRight: "8px",
        }}>
        </span>
        <span style={{
          fontFamily: "var(--sr)",
          fontSize: "38px",
          fontWeight: 300,
          color: "var(--ink)",
          letterSpacing: "-0.02em",
        }}>
          Our portfolio.
        </span>
      </div>

      {/* 3-col grid */}
      <div className="imani-portfolio-grid">
        {companies.map((company, i) => (
          <div
            key={company.name}
            style={{
              borderRight: i < companies.length - 1
                ? "1px solid var(--hairline)"
                : "none",
            }}
          >
            {/* Photo area */}
            <div style={{
              height: "200px",
              backgroundColor: "#5B0D1B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              {company.image ? (
                <>
                  <Image
                    src={company.image}
                    alt={company.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  {/* gradient so name + sector badge read against the photo */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                    zIndex: 1,
                  }} />
                </>
              ) : (
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--sr)",
                  fontSize: "20px",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.5)",
                }}>
                  {company.initials}
                </div>
              )}
              <span style={{
                position: "absolute",
                bottom: "10px",
                left: "12px",
                fontFamily: "var(--in)",
                fontSize: "9px",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
                padding: "3px 8px",
                zIndex: 2,
              }}>
                {company.sector}
              </span>
            </div>

            {/* Info area */}
            <div style={{ padding: "20px 24px" }}>
              <p style={{
                fontFamily: "var(--sr)",
                fontSize: "18px",
                fontWeight: 400,
                color: "var(--ink)",
                marginBottom: "4px",
              }}>
                {company.name}
              </p>
              <p style={{
                fontFamily: "var(--in)",
                fontSize: "15px",
                color: "rgba(17,17,17,0.45)",
                marginBottom: "10px",
              }}>
                {company.sector} · {company.city}
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {company.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      border: "1px solid var(--hairline)",
                      fontFamily: "var(--in)",
                      fontSize: "10px",
                      color: "rgba(17,17,17,0.45)",
                      padding: "3px 8px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
