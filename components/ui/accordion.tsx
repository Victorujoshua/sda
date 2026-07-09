"use client";
import React, { useState } from "react";

interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

interface AccordionGroupProps {
  title: string;
  items: AccordionItem[];
}

export function AccordionGroup({ title, items }: AccordionGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ marginBottom: "48px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "15px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--crimson)",
        marginBottom: "16px",
      }}>
        {title}
      </p>
      <div style={{ borderTop: "1px solid var(--hairline)" }}>
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{ borderBottom: "1px solid var(--hairline)" }}>
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
                  fontFamily: "var(--in)",
                  fontSize: "18px",
                  fontWeight: 400,
                  color: isOpen ? "var(--crimson)" : "var(--ink)",
                  textAlign: "left",
                  gap: "16px",
                }}
              >
                <span>{item.question}</span>
                <span style={{
                  fontFamily: "var(--in)",
                  fontSize: "20px",
                  color: "var(--crimson)",
                  flexShrink: 0,
                  lineHeight: 1,
                  display: "inline-block",
                  transition: "transform 200ms",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}>
                  +
                </span>
              </button>
              {isOpen && (
                <div style={{
                  paddingBottom: "20px",
                  fontFamily: "var(--in)",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "rgba(17,17,17,0.65)",
                  maxWidth: "640px",
                }}>
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
