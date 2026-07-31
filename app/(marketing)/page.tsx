import { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import Intro from "@/components/marketing/Intro";
import WhatWeFund from "@/components/marketing/WhatWeFund";
import FundingOptions from "@/components/marketing/FundingOptions";
import WhatWeLookFor from "@/components/marketing/WhatWeLookFor";
import ForInvestors from "@/components/marketing/ForInvestors";
import PullQuote from "@/components/marketing/PullQuote";
import HowItWorks from "@/components/marketing/HowItWorks";
import PortfolioGrid from "@/components/marketing/PortfolioGrid";
import PortfolioFeature from "@/components/marketing/PortfolioFeature";
import HomeFAQ from "@/components/marketing/HomeFAQ";
import EmailSignup from "@/components/marketing/EmailSignup";

const TITLE = "Imani Ventures | Micro Angel Investing Platform in Africa";
const DESCRIPTION =
  "Imani Ventures connects vetted investors with revenue-generating MSMEs through structured financing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://imaniventures.org",
    siteName: "Imani Ventures",
    type: "website",
    locale: "en_NG",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <WhatWeFund />
      <FundingOptions />
      <WhatWeLookFor />
      <ForInvestors />
      <PullQuote />
      <HowItWorks />
      <PortfolioGrid />
      <PortfolioFeature />
      <HomeFAQ />
      <EmailSignup />
    </main>
  );
}
