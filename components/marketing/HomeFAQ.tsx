"use client";

import { useState } from "react";
import Link from "next/link";

const PREVIEW_ITEMS = [
  {
    question: "What is SDA Micro Angel Investing?",
    answer:
      "SDA Micro Angel Investing is a platform that enables individuals to invest smaller ticket sizes into carefully vetted early-stage startups, alongside experienced angels and ecosystem leaders.",
  },
  {
    question: "Who can join the platform?",
    answer:
      "Our platform is open to both new and experienced investors who meet our onboarding and compliance requirements. We particularly welcome first-time angel investors, professionals seeking exposure to startups, and experienced angels interested in co-investment opportunities.",
  },
  {
    question: "Do you charge fees?",
    answer:
      "Yes, we charge a combination of diligence and administrative fees to investors who are accepted onto the platform. These fees cover deal sourcing, vetting, documentation, and ongoing operational support.",
  },
  {
    question: "How are startups chosen?",
    answer:
      "Startups are selected based on SDA's investment thesis, market opportunity and scalability, founding team strength, and alignment with investor interests. We also factor in the sector and geographic preferences of our investor community to ensure relevant deal flow.",
  },
  {
    question: "What are the risks involved?",
    answer:
      "Angel investing is high risk. Startups can fail, and investors should be prepared for the possibility of losing their entire investment.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        backgroundColor: "#0A0A0A",
        padding: "80px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "32px",
          }}
        >
          FAQ
        </p>

        <h2
          style={{
            fontFamily: "var(--sr)",
            fontSize: "42px",
            fontWeight: 300,
            color: "#FAFAF8",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            marginBottom: "48px",
          }}
        >
          Frequently asked questions.
        </h2>

        <div>
          {PREVIEW_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: "16px",
                      fontWeight: 400,
                      color: isOpen ? "#CF9A0A" : "#FAFAF8",
                    }}
                  >
                    {item.question}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: "20px",
                      color: "#CF9A0A",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: "15px",
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.65)",
                      paddingBottom: "20px",
                      maxWidth: "720px",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Link
          href="/faq"
          style={{
            display: "inline-block",
            marginTop: "40px",
            fontFamily: "var(--in)",
            fontSize: "16px",
            fontWeight: 500,
            color: "#CF9A0A",
            textDecoration: "none",
            borderBottom: "1px solid #CF9A0A",
            paddingBottom: "2px",
          }}
        >
          View all questions →
        </Link>
      </div>
    </section>
  );
}
