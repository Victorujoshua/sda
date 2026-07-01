import { Metadata } from "next";
import PortfolioView from "./PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio — SDA",
  description:
    "Meet the Nigerian businesses SDA has backed. Revenue-generating companies across technology, retail, agribusiness, services, and food & beverage.",
  openGraph: {
    title: "Portfolio — SDA",
    description: "Meet the Nigerian businesses SDA has backed.",
    url: "https://sda.ng/portfolio",
    siteName: "SDA",
    type: "website",
  },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
