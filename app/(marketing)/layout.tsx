import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#0A0A0A", color: "#FAFAF8", minHeight: "100vh" }}>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
