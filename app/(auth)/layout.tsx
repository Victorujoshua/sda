import Nav from "@/components/marketing/Nav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="sda-page-content">
        {children}
      </div>
    </>
  );
}
