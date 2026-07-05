import { Metadata } from "next";
import PortfolioView from "./PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio — Imani Ventures",
  description:
    "Meet the Nigerian businesses Imani Ventures has backed. Revenue-generating companies across technology, retail, agribusiness, services, and food & beverage.",
  openGraph: {
    title: "Portfolio — Imani Ventures",
    description: "Meet the Nigerian businesses Imani Ventures has backed.",
    url: "https://imaniventures.org/portfolio",
    siteName: "Imani Ventures",
    type: "website",
  },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
