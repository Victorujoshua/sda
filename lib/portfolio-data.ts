export interface PortfolioCompany {
  name: string;
  description: string;
  sector: string;
  city: string;
  initials: string;
  tags: string[];
  image?: string;
}

// Fallback data — replace with Supabase query after Section 1 migration is applied
// Query: SELECT * FROM portfolio_companies WHERE is_published = true ORDER BY display_order
export const PORTFOLIO_COMPANIES: PortfolioCompany[] = [
  {
    name: "Fundora HQ",
    description: "Financial infrastructure for small businesses",
    sector: "Fintech",
    city: "Lagos",
    initials: "FH",
    tags: ["Equity", "Active"],
    image: "/images/fundora portfolio.png",
  },
  {
    name: "Kidcode",
    description: "Tech education for the next generation",
    sector: "Edtech",
    city: "Abuja",
    initials: "KC",
    tags: ["Revenue-based", "Active"],
    image: "/images/kidcode portfolio.png",
  },
  {
    name: "Rent & Rig Limited",
    description: "Equipment rental and logistics",
    sector: "Logistics",
    city: "Lagos",
    initials: "RR",
    tags: ["Debt", "Active"],
    image: "/images/Rent and rig portfolio.png",
  },
];

// Homepage grid shows first 3 only (spec: MLBS omitted from 3-col grid)
export const HOMEPAGE_PORTFOLIO = PORTFOLIO_COMPANIES.slice(0, 3);
