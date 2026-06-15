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
    title: "Applying for funding",
    items: [
      {
        question: "Who can apply?",
        answer:
          "Any Nigerian-registered business that has been operating for at least 6 months and is generating revenue. We do not fund pre-revenue ideas or concepts without an operating track record.",
      },
      {
        question: "What stage do you invest at?",
        answer:
          "Early stage — typically pre-Series A. We look for businesses that have cleared initial market risk: you have customers, you understand your unit economics, and you have a clear path to the next milestone.",
      },
      {
        question: "How much can I apply for?",
        answer:
          "This depends on the instrument. Equity investments typically range from ₦2M to ₦15M. Debt facilities from ₦500K to ₦5M. Asset financing varies based on the asset value. Revenue-based facilities are sized against monthly revenue.",
      },
      {
        question: "How long does the process take?",
        answer:
          "Initial review takes 5–10 business days. If your application progresses, you will be invited to a call. Total time from application to term sheet is typically 3–6 weeks.",
      },
      {
        question: "Do I need a pitch deck?",
        answer:
          "No. We ask for clear answers to structured questions and supporting financials — bank statements, management accounts, and basic projections. A deck is optional.",
      },
      {
        question: "Is there a fee to apply?",
        answer: "No. Application is free. We do not charge any upfront fees.",
      },
    ],
  },
  {
    title: "Funding instruments",
    items: [
      {
        question: "What is the difference between equity and debt?",
        answer:
          "Equity means we take a minority ownership stake in your business in exchange for capital. Debt means you borrow a fixed amount and repay it on an agreed schedule with interest. Equity is permanent capital; debt is temporary capital.",
      },
      {
        question: "What is revenue-based financing?",
        answer:
          "You receive capital upfront and repay it as a fixed percentage of your monthly revenue until you have paid back an agreed total amount (principal + a flat fee). There is no fixed monthly repayment — slower months mean lower payments.",
      },
      {
        question: "What is asset financing?",
        answer:
          "We fund the purchase of a specific asset — equipment, a delivery vehicle, inventory, or machinery. The asset typically serves as security. This is faster to close than equity because the underwriting focuses on the asset rather than the entire business.",
      },
      {
        question: "Can I apply for more than one instrument?",
        answer:
          "Each application is for one instrument. If after reviewing your application we believe a different instrument is more appropriate, we will tell you and you can reapply.",
      },
    ],
  },
  {
    title: "For investors",
    items: [
      {
        question: "Who can invest through SDA?",
        answer:
          "Any registered user. We do not restrict to accredited investors for deal viewing. However, before any investment commitment is finalised, we conduct a brief background check on new investors.",
      },
      {
        question: "How do I access full deal details?",
        answer:
          "Create an account and log in. Deal summaries are public; full documentation — financials, due diligence notes, term sheet templates — is available only to logged-in investors.",
      },
      {
        question: "Do I invest through the platform?",
        answer:
          "In V1, SDA facilitates introductions and term discussions. No money moves through this platform. Investment commitments are recorded offline and formalised through direct agreements.",
      },
      {
        question: "What fees does SDA charge investors?",
        answer:
          "Details are provided at the time of investment. We do not charge investors to browse or express interest.",
      },
      {
        question: "Can I co-invest with other investors?",
        answer:
          "Yes. SDA supports syndicate structures where multiple investors participate in the same deal. This is coordinated through the SDA team after you express interest.",
      },
      {
        question: "How will I track my investments?",
        answer:
          "Investors will have access to updates and reporting on startup performance, key milestones, and funding rounds and developments.",
      },
      {
        question: "Can I invest in multiple startups?",
        answer:
          "Yes, and we strongly encourage diversification across multiple deals to manage risk.",
      },
      {
        question: "Is there a community aspect to the platform?",
        answer:
          "Yes. SDA fosters a collaborative investor community where members share insights, discuss deals, co-invest, and learn from experienced angels.",
      },
      {
        question: "How are investments structured?",
        answer:
          "Investments are typically structured through pooled investment vehicles or special purpose vehicles (SPVs), allowing multiple investors to invest collectively in a single deal.",
      },
      {
        question: "What happens after I invest?",
        answer:
          "After investing, funds are deployed into the startup, you receive confirmation and documentation, and ongoing updates are shared periodically.",
      },
      {
        question: "Why choose SDA over other angel platforms?",
        answer:
          "Lower barrier to entry through micro-investing, curated high-quality deal flow, a strong community and co-investment network, and a focus on emerging markets and high-growth sectors.",
      },
    ],
  },
  {
    title: "Platform and security",
    items: [
      {
        question: "How are documents stored?",
        answer:
          "All uploaded documents are stored in private, encrypted buckets. No document is ever publicly accessible. Documents are served via temporary signed URLs that expire after 10 minutes, generated server-side for authorised users only.",
      },
      {
        question: "Who can see my application documents?",
        answer:
          "Only SDA admin team members. Investors cannot access raw application documents — they see curated deal summaries prepared by the SDA team.",
      },
      {
        question: "Is my financial information safe?",
        answer:
          "Yes. Financial documents are stored in private Supabase Storage buckets with row-level security. We follow standard data protection practices and do not share your data with third parties without consent.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes. Contact the SDA team to request account deletion. We will remove your personal data in accordance with our Privacy Policy.",
      },
      {
        question: "What happens if my application is rejected?",
        answer:
          "You will receive a notification with a brief reason. You may reapply after 90 days if your circumstances change. A rejection is not a blacklist — it reflects the application at that point in time.",
      },
      {
        question: "What is a blacklisted user?",
        answer:
          "A user who has been flagged by the SDA admin team for misrepresentation, fraud, or policy violation. Blacklisted users cannot submit new applications. This is an administrative action, not an automatic outcome of rejection.",
      },
    ],
  },
  {
    title: "Risks and returns",
    items: [
      {
        question: "What are the risks involved?",
        answer:
          "Angel investing is high risk. Startups can fail, and investors should be prepared for the possibility of losing their entire investment.",
      },
      {
        question: "What kind of returns can I expect?",
        answer:
          "Returns are not guaranteed. However, successful startup investments can generate significant returns over time through acquisitions, IPOs, or secondary sales. Investors should take a portfolio approach to improve their chances of success.",
      },
      {
        question: "How long does it take to see returns?",
        answer:
          "Startup investments are illiquid and long-term. Typical holding periods range from 3 to 10 years, depending on the company's growth and exit opportunities.",
      },
      {
        question: "Can I exit my investment early?",
        answer:
          "Early exits are generally not guaranteed. Liquidity typically occurs only during acquisition events, secondary sales, or public listings.",
      },
    ],
  },
  {
    title: "For founders",
    items: [
      {
        question: "Can founders apply for funding?",
        answer:
          "Yes. Founders can submit their startups for consideration through our application process. Selected startups go through screening and due diligence before being presented to investors.",
      },
      {
        question: "How often are new deals shared?",
        answer:
          "Deal frequency varies, but we aim to provide a consistent pipeline of vetted opportunities throughout the year.",
      },
      {
        question: "Do you support beginner investors?",
        answer:
          "Yes. We offer educational resources, investment guides, webinars, and community discussions to support investors at every level.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main style={{ padding: "120px 40px 80px", maxWidth: "800px" }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "11px",
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
