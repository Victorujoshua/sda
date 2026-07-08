import Link from "next/link";
import Wordmark from "@/components/brand/Wordmark";

const FOOTER_NAV = [
  { label: "Funding types", href: "/#funding-options" },
  { label: "Portfolio",     href: "/portfolio" },
  { label: "For investors", href: "/investors" },
  { label: "About",         href: "/about" },
  { label: "Apply",         href: "/apply" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="imani-footer" style={{
      backgroundColor: "#5B0D1B",
      padding: "32px 40px 24px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Top row: logotype left, nav right */}
      <div className="imani-footer-top" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div className="imani-footer-logo-wrap">
          <Wordmark variant="inverse" height={200} />
        </div>
        <nav style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingTop: "8px",
        }}>
          {FOOTER_NAV.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="imani-footer-link"
              style={{
                fontFamily: "var(--in)",
                fontSize: "15px",
                letterSpacing: "0.04em",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom row: legal left, social right */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        marginTop: "24px",
        paddingTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <p style={{
          fontFamily: "var(--in)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          margin: 0,
        }}>
          © {currentYear} Imani Ventures. All rights reserved.{" "}
          <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
          {" · "}
          <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
          {" · "}
          <Link href="/risk-disclosure" style={{ color: "inherit", textDecoration: "none" }}>Risk Disclosure</Link>
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          {["LinkedIn", "Twitter", "Instagram"].map((social) => (
            <a
              key={social}
              href="#"
              style={{
                fontFamily: "var(--in)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.25)",
                textDecoration: "none",
              }}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
