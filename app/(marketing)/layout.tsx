import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "var(--cream)", color: "var(--ink)", minHeight: "100vh" }}>
      <Nav />
      <div className="imani-page-content">
        {children}
      </div>
      <Footer />
    </div>
  );
}
