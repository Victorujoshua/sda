"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import NavAuthSlot from "./NavAuthSlot";
import Wordmark from "@/components/brand/Wordmark";

const NAV_LINKS = [
  { label: "Funding types", href: "/#funding-options" },
  { label: "Portfolio",     href: "/portfolio" },
  { label: "For investors", href: "/investors" },
  { label: "About",         href: "/about" },
];

const ROLE_DESTINATIONS: Record<string, { label: string; href: string }> = {
  applicant:   { label: "Dashboard",     href: "/dashboard" },
  investor:    { label: "Opportunities", href: "/opportunities" },
  admin:       { label: "Admin",         href: "/admin" },
  super_admin: { label: "Admin",         href: "/admin" },
};

type AuthState =
  | { status: "loading" }
  | { status: "out" }
  | { status: "in"; role: string | null; email: string; initial: string };

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    if (!isHomepage) return;
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  useEffect(() => {
    const supabase = createClient();

    async function resolve(userId: string, userEmail: string) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      const initial = (userEmail[0] ?? "?").toUpperCase();
      setAuth({ status: "in", role: data?.role ?? null, email: userEmail, initial });
    }

    // Hydrate from existing session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        resolve(session.user.id, session.user.email ?? "");
      } else {
        setAuth({ status: "out" });
      }
    });

    // Stay reactive to login / logout events regardless of layout cache
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        resolve(session.user.id, session.user.email ?? "");
      } else {
        setAuth({ status: "out" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isDark = !isHomepage || scrolled;
  const navBg = isDark ? "#0A0A0A" : "transparent";
  const navShadow = isDark ? "0 1px 0 rgba(255,255,255,0.08)" : "none";

  const mobileDest =
    auth.status === "in" && auth.role
      ? (ROLE_DESTINATIONS[auth.role] ?? { label: "Dashboard", href: "/dashboard" })
      : null;

  async function handleMobileLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 40px",
        backgroundColor: navBg,
        boxShadow: navShadow,
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      }}>
        {/* Left: wordmark */}
        <Wordmark variant="inverse" height={51} />

        {/* Desktop nav links + auth slot — hidden on mobile */}
        <div className="imani-nav-desktop" style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}>
          <ul style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="imani-nav-link"
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "18px",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <NavAuthSlot
            role={auth.status === "in" ? auth.role : null}
            email={auth.status === "in" ? auth.email : null}
            initial={auth.status === "in" ? auth.initial : ""}
            loading={auth.status === "loading"}
          />
        </div>

        {/* Hamburger button — visible only on mobile via CSS */}
        <button
          className="imani-nav-hamburger"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Full-screen mobile drawer */}
      <div className={isOpen ? "imani-nav-drawer imani-nav-drawer--open" : "imani-nav-drawer"}>
        {/* Top row: logo + close */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
        }}>
          <Wordmark variant="inverse" height={51} />
          <button
            className="imani-nav-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((link) => (
              <li key={link.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--sr)",
                    fontSize: "32px",
                    fontWeight: 300,
                    fontStyle: "normal",
                    color: "#FAFAF8",
                    textDecoration: "none",
                    padding: "20px 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile CTA — loading: spacer; out: Apply Now; in: role button + Log out */}
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: 12 }}>
          {auth.status === "loading" && (
            <div style={{ height: 54 }} />
          )}
          {auth.status === "out" && (
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="imani-btn-nav-cta"
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "var(--in)",
                fontSize: "18px",
                color: "#FAFAF8",
                padding: "14px 20px",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              Apply Now
            </Link>
          )}
          {auth.status === "in" && mobileDest && (
            <>
              <Link
                href={mobileDest.href}
                onClick={() => setIsOpen(false)}
                className="imani-btn-nav-cta"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "var(--in)",
                  fontSize: "18px",
                  color: "#FAFAF8",
                  padding: "14px 20px",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                {mobileDest.label}
              </Link>
              <button
                onClick={handleMobileLogout}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.45)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 0",
                  textAlign: "center",
                  letterSpacing: "0.02em",
                }}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
