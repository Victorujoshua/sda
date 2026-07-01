"use client";

import { useState, useEffect, useCallback } from "react";

const INDUSTRIES = [
  "All",
  "Food & Beverage",
  "Retail",
  "Agribusiness",
  "Manufacturing",
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
}

const COMPANIES: Company[] = [
  {
    name: "Fundora HQ",
    initials: "FH",
    industry: "Technology",
    shortDescription: "Financial infrastructure for small businesses",
    description:
      "Fundora HQ builds payment and financial management tools for Nigerian SMEs, enabling merchants to accept payments, manage invoices, and access working capital. The business serves over 800 active merchants across Lagos and Abuja.",
    status: "Active",
    fundingType: "Equity",
    location: "Lagos",
    fundingAmount: "₦3,500,000",
  },
  {
    name: "Kidcode",
    initials: "KC",
    industry: "Technology",
    shortDescription: "Technology education for children aged 7–17",
    description:
      "Kidcode runs after-school and weekend coding bootcamps across Abuja, covering Python, web development, and robotics. Over 1,200 students have completed at least one term since the programme launched in 2023.",
    status: "Active",
    fundingType: "Revenue-based",
    location: "Abuja",
    fundingAmount: "₦2,000,000",
  },
  {
    name: "Rent & Rig Limited",
    initials: "RR",
    industry: "Services",
    shortDescription: "Equipment rental and logistics for construction and events",
    description:
      "Rent & Rig provides short-term rental of generators, scaffolding, and earthmoving equipment across Lagos. The business operates a fleet of over 40 units serving construction contractors and event management companies.",
    status: "Active",
    fundingType: "Debt",
    location: "Lagos",
    fundingAmount: "₦4,500,000",
  },
  {
    name: "My Little Big Surprise",
    initials: "ML",
    industry: "Retail",
    shortDescription: "Curated gifting and experience boxes for individuals and corporates",
    description:
      "My Little Big Surprise curates themed gift boxes sourced from Nigerian artisans and small producers. The business fulfils orders across 12 states and serves both personal milestone gifting and corporate gifting programmes.",
    status: "Active",
    fundingType: "Equity",
    location: "Lagos",
    fundingAmount: "₦1,500,000",
  },
  {
    name: "AgriPrime Foods",
    initials: "AF",
    industry: "Agribusiness",
    shortDescription: "Grain processing and distribution for northern Nigerian markets",
    description:
      "AgriPrime Foods processes and packages maize, millet, and sorghum sourced directly from smallholder farmers in Kano and Kaduna states. The business supplies supermarkets, schools, and institutional buyers from a 500-tonne-per-month processing facility.",
    status: "Active",
    fundingType: "Asset Financing",
    location: "Kano",
    fundingAmount: "₦5,000,000",
  },
  {
    name: "Maidstone Bakery",
    initials: "MB",
    industry: "Food & Beverage",
    shortDescription: "Artisanal baked goods for retail and food-service clients",
    description:
      "Maidstone Bakery produced premium breads, pastries, and celebration cakes sold through two Lagos retail outlets and a wholesale channel serving hotels and restaurants. The business completed its debt facility in full and exited in Q3 2024.",
    status: "Exited",
    fundingType: "Debt",
    location: "Lagos",
    fundingAmount: "₦2,500,000",
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
    <main style={{ backgroundColor: "#14171A", minHeight: "100vh" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="sda-pf-hero"
        style={{
          backgroundColor: "#14171A",
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
            color: "#FAFAF8",
            margin: "0 0 16px",
          }}
        >
          Businesses we&apos;ve backed.
        </h1>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 48px",
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          Revenue-generating Nigerian businesses funded through structured financing.
        </p>
        <div style={{ height: "2px", backgroundColor: "#CF9A0A", width: "100%" }} />
      </section>

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#14171A", borderBottom: "1px solid #2A2E32" }}>
        <div
          className="sda-pf-filter-outer"
          style={{ padding: "20px 40px", display: "flex", alignItems: "center", gap: "16px" }}
        >
          <div className="sda-pf-filter-wrap" style={{ flex: 1 }}>
            <div className="sda-pf-filter-bar">
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
                      border: active ? "none" : "1px solid #CF9A0A",
                      backgroundColor: active ? "#CF9A0A" : "transparent",
                      color: active ? "#14171A" : "#CF9A0A",
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
                color: "rgba(255,255,255,0.35)",
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
              color: "rgba(255,255,255,0.3)",
              padding: "8px 0 48px",
            }}
          >
            No businesses in this category yet.
          </p>
        )}

        <div className="sda-pf-grid">
          {filtered.map((company) => (
            <button
              key={company.name}
              onClick={() => setSelected(company)}
              className="sda-pf-card"
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
                }}
              >
                {badgeLabel(company)}
              </span>

              {/* Initials — centered */}
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
              backgroundColor: "#14171A",
              border: "1px solid #2A2E32",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "24px 28px 20px",
                borderBottom: "1px solid #2A2E32",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: "24px",
                    fontWeight: 300,
                    letterSpacing: "-0.015em",
                    color: "#FAFAF8",
                    margin: "0 0 6px",
                  }}
                >
                  {selected.name}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: 0,
                  }}
                >
                  {selected.location}, Nigeria
                </p>
              </div>
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
                  flexShrink: 0,
                  transition: "color 120ms",
                }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "24px 28px 28px" }}>

              {/* Tags row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "4px 10px",
                  }}
                >
                  {selected.industry}
                </span>
                <span
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    border: "1px solid rgba(207,154,10,0.3)",
                    padding: "4px 10px",
                    color: "#CF9A0A",
                  }}
                >
                  {selected.fundingType}
                </span>
                <span
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "4px 10px",
                    color:
                      selected.status === "Active"
                        ? "#CF9A0A"
                        : "rgba(255,255,255,0.3)",
                    border:
                      selected.status === "Active"
                        ? "1px solid rgba(207,154,10,0.3)"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  ● {selected.status}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: "15px",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.65)",
                  margin: "0 0 28px",
                }}
              >
                {selected.description}
              </p>

              {/* Funding amount */}
              <div
                style={{
                  borderTop: "1px solid #2A2E32",
                  paddingTop: "20px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 6px",
                  }}
                >
                  Funding amount
                </p>
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: "#CF9A0A",
                    margin: 0,
                  }}
                >
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
