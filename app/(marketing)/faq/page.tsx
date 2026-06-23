import { Metadata } from "next";
import { AccordionGroup } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — SDA",
  description:
    "Frequently asked questions about applying for funding, investing through SDA, and how the platform works.",
  openGraph: {
    title: "FAQ — SDA",
    description:
      "Frequently asked questions about SDA micro angel investing.",
    url: "https://sda.ng/faq",
    siteName: "SDA",
    type: "website",
  },
};

const FAQ_GROUPS = [
  {
    title: "About SDA",
    items: [
      {
        question: "What is SDA?",
        answer:
          "SDA is a private capital platform connecting vetted investors with revenue-generating businesses through structured financing. We focus on businesses that are already operating and generating revenue, not early-stage ideas.",
      },
      {
        question: "Is SDA a crowdfunding platform?",
        answer:
          "No. SDA does not operate as a public crowdfunding platform. All opportunities are offered privately to approved participants within our network.",
      },
      {
        question: "Who can join SDA as an investor?",
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
        answer:
          "SDA offers different structures depending on the business and investor preference: revenue-based financing, fixed return financing, profit-sharing agreements, equity investments, and hybrid structures combining income and upside.",
      },
      {
        question: "How do investors make money?",
        answer:
          "Returns depend on the structure selected. Revenue-based financing provides periodic payments tied to business revenue. Fixed return financing offers structured repayments over time. Profit sharing provides payments linked to profitability. Equity offers long-term value through growth or exit.",
      },
      {
        question: "Do all investments rely on exits?",
        answer:
          "No. Only equity investments depend on future exits. Revenue-based, debt, and profit-sharing structures provide returns over time without requiring a sale of the business.",
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
        answer:
          "We only work with businesses that have verifiable revenue, can provide financial records and bank statements, demonstrate operational consistency, and show realistic potential for growth. This helps ensure opportunities are grounded in actual performance.",
      },
      {
        question: "What risks should I be aware of?",
        answer:
          "Key risks include business underperformance, delayed or reduced payments, and limited or no exit for equity investments. Investments should be made with a clear understanding of these risks.",
      },
    ],
  },
  {
    title: "Process",
    items: [
      {
        question: "How does the investment process work?",
        answer:
          "The process has five steps: investors apply and are onboarded, opportunities are shared privately, investors review deal details and structure, investment commitments are made, then funds are deployed and tracked.",
      },
      {
        question: "Can I choose which businesses to invest in?",
        answer:
          "Yes. Investors decide which opportunities to participate in. There is no obligation to invest in every deal.",
      },
      {
        question: "What is the minimum investment amount?",
        answer:
          "Minimum investment levels vary by opportunity, but SDA is structured to allow participation at relatively accessible levels.",
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
        answer:
          "Investors receive periodic updates including business performance, payment schedules and progress, and key developments.",
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
        answer:
          "We fund businesses that have at least 6 months of revenue, can provide financial records, have clear operational activity, and need structured capital to grow.",
      },
      {
        question: "What types of funding can I apply for?",
        answer:
          "Businesses can apply for revenue-based financing, fixed return financing, profit-sharing structures, equity, and hybrid funding.",
      },
      {
        question: "Why does SDA operate this model?",
        answer:
          "We believe capital should be structured around real business performance. By aligning funding with how businesses actually generate cash, we create a more disciplined and realistic investment environment for both sides.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main style={{ padding: "120px 40px 80px", maxWidth: "800px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "20px",
      }}>
        FAQ
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
        Common questions.
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
