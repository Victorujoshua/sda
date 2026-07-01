"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ROLE_DESTINATIONS: Record<string, { label: string; href: string }> = {
  applicant:   { label: "Dashboard",     href: "/dashboard" },
  investor:    { label: "Opportunities", href: "/opportunities" },
  admin:       { label: "Admin",         href: "/admin" },
  super_admin: { label: "Admin",         href: "/admin" },
};

export default function NavAuthSlot({
  role,
  email,
  initial,
  loading = false,
}: {
  role: string | null;
  email: string | null;
  initial: string;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function outside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // Neutral spacer while session resolves — prevents "Apply Now" flash for logged-in users.
  // Matches approximate width × height of the "Apply Now" button so the nav doesn't jump.
  if (loading) {
    return <div style={{ display: "inline-block", width: 100, height: 38, flexShrink: 0 }} />;
  }

  if (!role) {
    return (
      <Link
        href="/signup"
        className="sda-btn-nav-cta"
        style={{
          fontFamily: "var(--in)",
          fontSize: "16px",
          color: "#FAFAF8",
          padding: "9px 20px",
          textDecoration: "none",
          letterSpacing: "0.04em",
          display: "inline-block",
        }}
      >
        Apply Now
      </Link>
    );
  }

  const dest = ROLE_DESTINATIONS[role] ?? { label: "Dashboard", href: "/dashboard" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Link
        href={dest.href}
        className="sda-btn-nav-cta"
        style={{
          fontFamily: "var(--in)",
          fontSize: "16px",
          color: "#FAFAF8",
          padding: "9px 20px",
          textDecoration: "none",
          letterSpacing: "0.04em",
          display: "inline-block",
        }}
      >
        {dest.label}
      </Link>

      <div ref={wrapRef} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Account menu"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#0f2744",
            color: "#CF9A0A",
            fontFamily: "var(--sr)",
            fontSize: 13,
            fontWeight: 600,
            fontStyle: "normal",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {initial}
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 180,
              backgroundColor: "#FAFAF8",
              borderRadius: 4,
              boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
              overflow: "hidden",
              zIndex: 200,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                fontFamily: "var(--in)",
                fontSize: 12,
                color: "var(--muted)",
                borderBottom: "1px solid var(--border)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email}
            </div>
            <button onClick={handleLogout} className="sda-nav-dropdown-logout">
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
