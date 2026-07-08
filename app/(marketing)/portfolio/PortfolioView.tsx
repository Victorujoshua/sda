"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const INDUSTRIES = [
  "All",
  "Services",
  "Technology",
] as const;

type Industry = (typeof INDUSTRIES)[number];
type FundingType = "Equity" | "Revenue-based" | "Debt" | "Asset Financing" | "Hybrid";
type Status = "Active" | "Exited";

interface Company {
  name: string;
  initials: string;
  industry: Industry;
  shortDescription: string;
  description: string;
  status: Status;
  fundingType: FundingType;
  location: string;
  fundingAmount: string;
  image?: string;
  logo?: string;
}

const COMPANIES: Company[] = [
  {
    name: "Fundora HQ",
    initials: "FH",
    image: "/images/portfolio-fundora.png",
    logo: "/images/Fundora white.png",
    industry: "Technology",
    shortDescription: "Financial infrastructure for small businesses",
    description:
      "Fundora HQ is the cornerstone of our portfolio and a bold step toward redefining wealth creation in Africa. As a fintech marketplace for investment and insurance products, Fundora provides Nigerians with seamless access to both local and global capital market opportunities, democratising financial access in a way that has historically been limited. Built on the vision of financial inclusion and long-term prosperity, Fundora goes beyond access. It empowers individuals and families to build, preserve, and grow wealth across generations. With a clear ambition to shape Africa’s next generation of wealthy families, Fundora sits at the intersection of technology, finance, and opportunity, creating a smarter, more inclusive financial future.",
    status: "Active",
    fundingType: "Equity",
    location: "Lagos",
    fundingAmount: "₦3,500,000",
  },
  {
    name: "Kidcode",
    initials: "KC",
    image: "/images/portfolio-Kidcode.png",
    logo: "/images/Kidcode white.png",
    industry: "Technology",
    shortDescription: "Technology education for children aged 7–17",
    description:
      "Kidcode redefines children’s fashion through the lens of identity and expression. Rooted in the belief that every child possesses a distinct creative code, the brand designs refined, high-quality clothing that enables freedom of movement, imagination, and self-discovery. Serving children aged 2–11, Kidcode seamlessly balances sophistication, comfort, and durability. It is not simply apparel, it is a considered approach to nurturing confidence, individuality, and style from the earliest years.",
    status: "Active",
    fundingType: "Revenue-based",
    location: "Abuja",
    fundingAmount: "₦2,000,000",
  },
  {
    name: "Rent & Rig Limited",
    initials: "RR",
    image: "/images/portfolio-rent and rig.png",
    logo: "/images/rent and rig white.png",
    industry: "Services",
    shortDescription: "Equipment rental and logistics for construction and events",
    description:
      "Rent & Rig elevates event experiences through cutting-edge visual technology. Specialising in high-quality LED screen rentals for corporate events, the business delivers seamless, impactful display solutions designed to engage audiences and enhance brand presence. From conferences and product launches to large-scale corporate gatherings, Rent & Rig ensures every visual moment is delivered with precision and clarity. Built on reliability, technical expertise, and a commitment to excellence, Rent & Rig transforms spaces into immersive environments, where content isn’t just seen, but experienced.",
    status: "Active",
    fundingType: "Debt",
    location: "Lagos",
    fundingAmount: "₦4,500,000",
  },
];

function badgeLabel(company: Company): string {
  if (company.status === "Exited") return "EXITED";
  return company.fundingType.toUpperCase();
}

export default function PortfolioView() {
  const [activeIndustry, setActiveIndustry] = useState<Industry>("All");
  const [selected, setSelected] = useState<Company | null>(null);

  const closeModal = useCallback(() => setSelected(null), []);

  // ESC to close + scroll lock
  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [selected, closeModal]);

  const filtered =
    activeIndustry === "All"
      ? COMPANIES
      : COMPANIES.filter((c) => c.industry === activeIndustry);

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="imani-pf-hero"
        style={{
          backgroundColor: "var(--cream)",
          marginTop: "-80px",
          paddingTop: "140px",
          paddingBottom: "56px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: "48px",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            margin: "0 0 16px",
          }}
        >
          Businesses we have funded
        </h1>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: "16px",
            color: "rgba(17,17,17,0.5)",
            margin: "0 0 48px",
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          Revenue-generating Nigerian businesses funded through structured financing.
        </p>
        <div style={{ height: "2px", backgroundColor: "var(--crimson)", width: "100%" }} />
      </section>

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "var(--cream)", borderBottom: "1px solid var(--hairline)" }}>
        <div
          className="imani-pf-filter-outer"
          style={{ padding: "20px 40px", display: "flex", alignItems: "center", gap: "16px" }}
        >
          <div className="imani-pf-filter-wrap" style={{ flex: 1 }}>
            <div className="imani-pf-filter-bar">
              {INDUSTRIES.map((industry) => {
                const active = industry === activeIndustry;
                return (
                  <button
                    key={industry}
                    onClick={() => setActiveIndustry(industry)}
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: "12px",
                      letterSpacing: "0.02em",
                      padding: "6px 16px",
                      borderRadius: "999px",
                      border: active ? "none" : "1px solid var(--crimson)",
                      backgroundColor: active ? "var(--crimson)" : "transparent",
                      color: active ? "#FAFAF8" : "var(--crimson)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontWeight: active ? 500 : 400,
                      transition: "background-color 120ms, color 120ms",
                    }}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </div>
          {activeIndustry !== "All" && (
            <button
              onClick={() => setActiveIndustry("All")}
              style={{
                fontFamily: "var(--in)",
                fontSize: "12px",
                color: "rgba(17,17,17,0.45)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* ── Card grid ─────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 40px 80px" }}>
        {filtered.length === 0 && (
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: "15px",
              color: "rgba(17,17,17,0.4)",
              padding: "8px 0 48px",
            }}
          >
            No businesses in this category yet.
          </p>
        )}

        <div className="imani-pf-grid">
          {filtered.map((company) => (
            <button
              key={company.name}
              onClick={() => setSelected(company)}
              className="imani-pf-card"
              aria-label={`View details for ${company.name}`}
              style={{
                position: "relative",
                backgroundColor: "#1C1A18",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                width: "100%",
                padding: 0,
                display: "block",
                aspectRatio: "4 / 3",
              }}
            >
              {/* Status / funding badge — top right */}
              <span
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  fontFamily: "var(--in)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  zIndex: 2,
                }}
              >
                {badgeLabel(company)}
              </span>

              {/* Image or initials placeholder */}
              {company.image ? (
                <>
                  <Image
                    src={company.image}
                    alt={company.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  {/* gradient so name reads against the photo */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)",
                    zIndex: 1,
                  }} />
                  <span style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "16px",
                    fontFamily: "var(--sr)",
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#FAFAF8",
                    letterSpacing: "-0.01em",
                    zIndex: 2,
                  }}>
                    {company.name}
                  </span>
                </>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--sr)",
                      fontSize: "40px",
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {company.initials}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {selected && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              border: "1px solid rgba(255,255,255,0.12)",
              maxWidth: "1100px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
          >
            {/* Left column — image + logo */}
            <div
              style={{
                flex: "0 0 42%",
                position: "relative",
                minHeight: "480px",
                backgroundColor: "#1C1A18",
                overflow: "hidden",
              }}
            >
              {selected.image ? (
                <>
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    sizes="400px"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.4) 100%)",
                  }} />
                </>
              ) : (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "var(--sr)",
                    fontSize: "56px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.15)",
                  }}>
                    {selected.initials}
                  </span>
                </div>
              )}
              {/* Logo pinned top-left over image */}
              {selected.logo && (
                <div style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  zIndex: 2,
                  width: "150px",
                  height: "48px",
                }}>
                  <Image
                    src={selected.logo}
                    alt={`${selected.name} logo`}
                    fill
                    sizes="150px"
                    style={{ objectFit: "contain", objectPosition: "left center" }}
                  />
                </div>
              )}
            </div>

            {/* Right column — all info */}
            <div style={{
              flex: 1,
              backgroundColor: "#5B0D1B",
              overflowY: "auto",
              padding: "24px 28px 28px",
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Close button */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    fontSize: "22px",
                    lineHeight: 1,
                    padding: "2px 4px",
                    transition: "color 120ms",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Name + location */}
              <h2 style={{
                fontFamily: "var(--sr)",
                fontSize: "24px",
                fontWeight: 300,
                letterSpacing: "-0.015em",
                color: "#FAFAF8",
                margin: "0 0 6px",
              }}>
                {selected.name}
              </h2>
              <p style={{
                fontFamily: "var(--in)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0 0 24px",
              }}>
                {selected.location}, Nigeria
              </p>

              {/* Tags row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                <span style={{
                  fontFamily: "var(--in)",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "4px 10px",
                }}>
                  {selected.industry}
                </span>
                <span style={{
                  fontFamily: "var(--in)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(178,35,41,0.3)",
                  padding: "4px 10px",
                  color: "var(--crimson)",
                }}>
                  {selected.fundingType}
                </span>
                <span style={{
                  fontFamily: "var(--in)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "4px 10px",
                  color: selected.status === "Active" ? "var(--crimson)" : "rgba(255,255,255,0.3)",
                  border: selected.status === "Active" ? "1px solid rgba(178,35,41,0.3)" : "1px solid rgba(255,255,255,0.1)",
                }}>
                  ● {selected.status}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: "var(--in)",
                fontSize: "15px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.65)",
                margin: "0 0 28px",
                flex: 1,
              }}>
                {selected.description}
              </p>

              {/* Funding amount */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "20px" }}>
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  margin: "0 0 6px",
                }}>
                  Funding amount
                </p>
                <p style={{
                  fontFamily: "var(--in)",
                  fontSize: "22px",
                  fontWeight: 500,
                  color: "var(--crimson)",
                  margin: 0,
                }}>
                  {selected.fundingAmount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
