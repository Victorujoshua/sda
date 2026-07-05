import Nav from "@/components/marketing/Nav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="imani-page-content">
        {children}
      </div>
    </>
  );
}
