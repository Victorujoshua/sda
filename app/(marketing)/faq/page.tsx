import { Metadata } from "next";
import { AccordionGroup } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — Imani Ventures",
  description:
    "Frequently asked questions about applying for funding, investing through Imani Ventures, and how the platform works.",
  openGraph: {
    title: "FAQ — Imani Ventures",
    description:
      "Frequently asked questions about Imani Ventures micro angel investing.",
    url: "https://imaniventures.org/faq",
    siteName: "Imani Ventures",
    type: "website",
  },
};

const ul = (items: string[]) => (
  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <span style={{
          display: "inline-block",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "var(--crimson)",
          flexShrink: 0,
          marginTop: "2px",
        }} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const FAQ_GROUPS = [
  {
    title: "About Imani Ventures",
    items: [
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
        question: "Who can join Imani Ventures as an investor?",
        answer:
          "Investors apply to join the platform and are onboarded before gaining access to opportunities. We work with individuals who are looking to allocate capital in a disciplined and informed way.",
      },
    ],
  },
  {
    title: "Investment Options",
    items: [
      {
        question: "What types of investments are available?",
        answer: ul([
          "Revenue-based financing",
          "Fixed return financing",
          "Profit-sharing agreements",
          "Equity investments",
          "Hybrid structures combining income and upside",
        ]),
      },
      {
        question: "How do investors make money?",
        answer: ul([
          "Revenue-based financing — periodic payments tied to business revenue",
          "Fixed return financing — structured repayments over time",
          "Profit sharing — payments linked to profitability",
          "Equity — long-term value through growth or exit",
        ]),
      },
      {
        question: "Do all investments rely on exits?",
        answer:
          "No. Only equity investments depend on future exits. </br>Revenue-based, debt, and profit-sharing structures provide returns over time without requiring a sale of the business.",
      },
      {
        question: "What is revenue-based financing?",
        answer:
          "Revenue-based financing allows investors to receive a percentage of a business's revenue until a predefined return amount is achieved.",
      },
      {
        question: "What kind of returns can I expect?",
        answer:
          "Returns vary depending on the structure and business performance. Some investments are designed for steady income, while others are structured for long-term growth. All returns are variable and depend on actual performance.",
      },
    ],
  },
  {
    title: "Risk and Transparency",
    items: [
      {
        question: "Are returns guaranteed?",
        answer:
          "No. There are no guaranteed returns. All investments carry risk, including the potential loss of capital.",
      },
      {
        question: "How are businesses selected?",
        answer: ul([
          "Verifiable revenue",
          "Financial records and bank statements",
          "Demonstrated operational consistency",
          "Realistic potential for growth",
        ]),
      },
      {
        question: "What risks should I be aware of?",
        answer: ul([
          "Business underperformance",
          "Delayed or reduced payments",
          "Limited or no exit for equity investments",
        ]),
      },
    ],
  },
  {
    title: "Process",
    items: [
      {
        question: "How does the investment process work?",
        answer: ul([
          "Investors apply and are onboarded",
          "Opportunities are shared privately",
          "Investors review deal details and structure",
          "Investment commitments are made",
          "Funds are deployed and tracked",
        ]),
      },
      {
        question: "Is there a fee to access full deal details?",
        answer:
          "Yes. After your investor account is approved, a one-time diligence and administrative fee of ₦10,000 unlocks permanent access to full gated deal details across all active opportunities on the platform. This fee covers deal sourcing, vetting, documentation, and ongoing operational support. You are never charged again.",
      },
      {
        question: "Can I choose which businesses to invest in?",
        answer:
          "Yes. Investors decide which opportunities to participate in. There is no obligation to invest in every deal.",
      },
      {
        question: "What is the minimum investment amount?",
        answer:
          "Minimum investment levels vary by opportunity, but Imani Ventures is structured to allow participation at relatively accessible levels.",
      },
    ],
  },
  {
    title: "Returns and Liquidity",
    items: [
      {
        question: "How long does it take to receive returns?",
        answer:
          "Timelines vary by structure. Revenue-based and fixed return deals may generate periodic payments. Profit-sharing depends on business performance. Equity investments may take several years.",
      },
      {
        question: "Can I exit my investment early?",
        answer:
          "Most investments are not designed for early exit. Liquidity typically depends on the structure and may be limited.",
      },
    ],
  },
  {
    title: "After Investment",
    items: [
      {
        question: "How do I track my investments?",
        answer: ul([
          "Business performance reports",
          "Payment schedules and progress",
          "Key developments",
        ]),
      },
      {
        question: "What happens if a business fails?",
        answer:
          "If a business underperforms or fails, investors may recover less than their initial investment or lose it entirely.",
      },
    ],
  },
  {
    title: "For Businesses",
    items: [
      {
        question: "Who qualifies for funding?",
        answer: ul([
          "At least 6 months of revenue",
          "Financial records available",
          "Clear operational activity",
          "Need for structured capital to grow",
        ]),
      },
      {
        question: "What types of funding can I apply for?",
        answer: ul([
          "Revenue-based financing",
          "Fixed return financing",
          "Profit-sharing structures",
          "Equity",
          "Hybrid funding",
        ]),
      },
      {
        question: "Why does Imani Ventures operate this model?",
        answer:
          "We believe capital should be structured around real business performance. By aligning funding with how businesses actually generate cash, we create a more disciplined and realistic investment environment for both sides.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="imani-page-main" style={{ padding: "120px 40px 80px", maxWidth: "800px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(17,17,17,0.35)",
        marginBottom: "20px",
      }}>
        FAQ
      </p>
      <h1 className="imani-page-h1" style={{
        fontFamily: "var(--sr)",
        fontSize: "52px",
        fontWeight: 300,
        lineHeight: 1.06,
        letterSpacing: "-0.025em",
        color: "var(--ink)",
        marginBottom: "56px",
      }}>
        Frequently Asked Questions.
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {FAQ_GROUPS.map((group) => (
          <AccordionGroup
            key={group.title}
            title={group.title}
            items={group.items}
          />
        ))}
      </div>
    </main>
  );
}
