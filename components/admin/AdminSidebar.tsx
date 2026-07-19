"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Briefcase,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logout } from "@/app/actions/auth";
import Wordmark from "@/components/brand/Wordmark";

const NAV: { href: string; label: string; icon: LucideIcon; exact?: boolean }[] = [
  { href: "/admin",              label: "Overview",     icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/deals",        label: "Deals",        icon: TrendingUp },
  { href: "/admin/portfolio",    label: "Portfolio",    icon: Briefcase },
  { href: "/admin/users",        label: "Users",        icon: Users },
];

export default function AdminSidebar({
  userName,
}: {
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 216,
        borderRight: "1px solid var(--hairline)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--cream)",
        zIndex: 10,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <Wordmark height={44} />
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 10,
            color: "var(--muted)",
            margin: "6px 0 0",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Admin portal
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 24px",
                fontFamily: "var(--in)",
                fontSize: 15,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--ink)" : "rgba(17,17,17,0.42)",
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.6} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            color: "var(--muted)",
            margin: "0 0 6px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {userName}
        </p>
        <form action={logout}>
          <button
            type="submit"
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              background: "none",
              border: "none",
              color: "var(--crimson)",
              cursor: "pointer",
              padding: 0,
              letterSpacing: "0.02em",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
