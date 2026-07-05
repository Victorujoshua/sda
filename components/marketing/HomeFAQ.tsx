"use client";

import { useState } from "react";
import Link from "next/link";

const PREVIEW_ITEMS = [
  {
    question: "What is Imani Ventures?",
    answer:
      "Imani Ventures is a private capital platform connecting vetted investors with revenue-generating businesses through structured financing. We focus on businesses that are already operating and generating revenue, not early-stage ideas.",
  },
  {
    question: "Is Imani Ventures a crowdfunding platform?",
    answer:
      "No. Imani Ventures does not operate as a public crowdfunding platform. All opportunities are offered privately to approved participants within our network.",
  },
  {
    question: "What types of investments are available?",
    answer:
      "Imani Ventures offers different structures depending on the business and investor preference: revenue-based financing, fixed return financing, profit-sharing agreements, equity investments, and hybrid structures combining income and upside.",
  },
  {
    question: "Are returns guaranteed?",
    answer:
      "No. There are no guaranteed returns. All investments carry risk, including the potential loss of capital.",
  },
  {
    question: "How does the investment process work?",
    answer:
      "The process has five steps: investors apply and are onboarded, opportunities are shared privately, investors review deal details and structure, investment commitments are made, then funds are deployed and tracked.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        backgroundColor: "var(--cream)",
        padding: "80px 40px",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
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
          FAQ
        </p>

        <h2
          style={{
            fontFamily: "var(--sr)",
            fontSize: "42px",
            fontWeight: 300,
            color: "var(--ink)",
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
                style={{ borderBottom: "1px solid var(--hairline)" }}
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
                      fontSize: "18px",
                      fontWeight: 400,
                      color: isOpen ? "var(--crimson)" : "var(--ink)",
                    }}
                  >
                    {item.question}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: "20px",
                      color: "var(--crimson)",
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
                      fontSize: "17px",
                      lineHeight: 1.75,
                      color: "rgba(17,17,17,0.65)",
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
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--crimson)",
            textDecoration: "none",
            borderBottom: "1px solid var(--crimson)",
            paddingBottom: "2px",
          }}
        >
          View all questions →
        </Link>
      </div>
    </section>
  );
}
