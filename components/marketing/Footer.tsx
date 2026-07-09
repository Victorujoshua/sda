import Link from "next/link";
import Image from "next/image";

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const COLUMNS = [
  {
    header: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      // /contact omitted — route does not exist
    ],
  },
  {
    header: "For Businesses",
    links: [
      { label: "Funding types", href: "/#funding-options" },
      { label: "Apply", href: "/apply" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    header: "For Investors",
    links: [
      { label: "For investors", href: "/investors" },
      { label: "Opportunities", href: "/opportunities" },
    ],
  },
  {
    header: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Risk Disclosure", href: "/risk-disclosure" },
    ],
  },
];

const SOCIAL = [
  { label: "X (Twitter)", Icon: XIcon, href: "#" },
  { label: "Instagram", Icon: InstagramIcon, href: "#" },
  { label: "LinkedIn", Icon: LinkedInIcon, href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <style>{`
        .imani-ft-col-link {
          color: rgba(248,237,235,0.75);
          text-decoration: none;
          font-family: var(--in);
          font-size: 14px;
          line-height: 1.4;
          transition: color 150ms;
          display: inline-block;
        }
        .imani-ft-col-link:hover {
          color: #F8EDEB;
        }
        .imani-ft-social {
          color: rgba(248,237,235,0.60);
          display: flex;
          align-items: center;
          transition: color 150ms;
        }
        .imani-ft-social:hover {
          color: #B22329;
        }
        .imani-ft-main {
          display: flex;
          flex-direction: row;
          gap: 64px;
          margin-bottom: 48px;
        }
        .imani-ft-brand {
          flex: 0 0 38%;
        }
        .imani-ft-links {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        @media (max-width: 1023px) {
          .imani-ft-main {
            flex-direction: column;
            gap: 40px;
          }
          .imani-ft-brand {
            flex: unset;
            width: 100%;
          }
          .imani-ft-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 24px;
          }
        }
        @media (max-width: 479px) {
          .imani-ft-links {
            grid-template-columns: 1fr;
          }
          .imani-ft-bottom-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>

      <footer
        className="imani-footer"
        style={{
          backgroundColor: "#111111",
          padding: "100px 40px",
          borderTop: "1px solid rgba(248,237,235,0.08)",
        }}
      >
        <div className="imani-ft-main">
          {/* Brand column */}
          <div className="imani-ft-brand">
            <div style={{ marginBottom: "24px" }}>
              <Link href="/" style={{ display: "inline-flex", lineHeight: 0 }}>
                <Image
                  src="/images/white.png"
                  alt="Imani Ventures"
                  height={96}
                  width={384}
                  style={{ height: 96, width: "auto" }}
                  priority
                />
              </Link>
            </div>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "rgba(248,237,235,0.70)",
                margin: 0,
                maxWidth: "360px",
              }}
            >
              Imani Ventures is a micro angel investing platform backing revenue-generating Nigerian
              SMEs. We connect vetted investors with businesses that are already working through
              structured financing.
            </p>
          </div>

          {/* Four link columns */}
          <div className="imani-ft-links">
            {COLUMNS.map((col) => (
              <div key={col.header}>
                <p
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: "13px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#B22329",
                    margin: "0 0 16px 0",
                  }}
                >
                  {col.header}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="imani-ft-col-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Hairline divider */}
        <div
          style={{
            borderTop: "1px solid rgba(248,237,235,0.15)",
            marginBottom: "24px",
          }}
        />

        {/* Bottom row */}
        <div
          className="imani-ft-bottom-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: "13px",
              color: "rgba(248,237,235,0.60)",
              margin: 0,
            }}
          >
            © {currentYear} Imani Ventures. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {SOCIAL.map(({ label, Icon, href }) => (
              <a key={label} href={href} aria-label={label} className="imani-ft-social">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
