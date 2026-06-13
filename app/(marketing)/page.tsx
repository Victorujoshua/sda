import { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import TickerStrip from "@/components/marketing/TickerStrip";
import Intro from "@/components/marketing/Intro";
import FundingOptions from "@/components/marketing/FundingOptions";
import WhatWeLookFor from "@/components/marketing/WhatWeLookFor";
import ForInvestors from "@/components/marketing/ForInvestors";
import PullQuote from "@/components/marketing/PullQuote";
import PortfolioGrid from "@/components/marketing/PortfolioGrid";
import PortfolioFeature from "@/components/marketing/PortfolioFeature";
import EmailSignup from "@/components/marketing/EmailSignup";

export const metadata: Metadata = {
  title: "SDA — Micro Angel Investing in Nigeria",
  description:
    "SDA backs early-stage Nigerian businesses with traction. Equity, debt, asset financing, and revenue-based funding for founders who are already doing the work.",
  openGraph: {
    title: "SDA — Micro Angel Investing in Nigeria",
    description:
      "SDA backs early-stage Nigerian businesses with traction. Apply for funding or explore our portfolio.",
    url: "https://sda.ng",
    siteName: "SDA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDA — Micro Angel Investing in Nigeria",
    description:
      "SDA backs early-stage Nigerian businesses with traction.",
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TickerStrip />
      <Intro />
      <FundingOptions />
      <WhatWeLookFor />
      <ForInvestors />
      <PullQuote />
      <PortfolioGrid />
      <PortfolioFeature />
      <EmailSignup />
    </main>
  );
}
