"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Funding types", href: "/#funding-options" },
  { label: "Portfolio",     href: "/portfolio" },
  { label: "For investors", href: "/investors" },
  { label: "Insights",      href: "#" },
  { label: "About",         href: "/about" },
  { label: "Contact",       href: "#" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "transparent",
      }}>
        {/* Left: logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image
            src="/images/logo.png"
            alt="SDA"
            width={120}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* Desktop nav links + CTA — hidden on mobile */}
        <div className="sda-nav-desktop" style={{
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
                  className="sda-nav-link"
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: "16px",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/signup?role=applicant"
            className="sda-btn-nav-cta"
            style={{
              fontFamily: "var(--in)",
              fontSize: "12px",
              color: "#FAFAF8",
              padding: "9px 20px",
              textDecoration: "none",
              letterSpacing: "0.04em",
              display: "inline-block",
            }}
          >
            Apply for funding
          </Link>
        </div>

        {/* Hamburger button — visible only on mobile via CSS */}
        <button
          className="sda-nav-hamburger"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Full-screen mobile drawer */}
      <div className={isOpen ? "sda-nav-drawer sda-nav-drawer--open" : "sda-nav-drawer"}>
        {/* Top row: logo + close */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
        }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src="/images/logo.png"
              alt="SDA"
              width={100}
              height={34}
              style={{ objectFit: "contain" }}
            />
          </Link>
          <button
            className="sda-nav-close"
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

        {/* Apply CTA at bottom */}
        <div style={{ marginTop: "40px" }}>
          <Link
            href="/signup?role=applicant"
            onClick={() => setIsOpen(false)}
            className="sda-btn-nav-cta"
            style={{
              display: "block",
              textAlign: "center",
              fontFamily: "var(--in)",
              fontSize: "14px",
              color: "#FAFAF8",
              padding: "14px 20px",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            Apply for funding
          </Link>
        </div>
      </div>
    </>
  );
}
