import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/deals", label: "Deals" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--in)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 216,
          borderRight: "1px solid var(--border)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--paper)",
          zIndex: 10,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "20px 24px 18px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--sr)",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            SDA
          </Link>
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 10,
              color: "var(--muted)",
              margin: "3px 0 0",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Admin portal
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "block",
                padding: "9px 24px",
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--ink)",
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 12,
              color: "var(--muted)",
              margin: "0 0 6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {profile?.full_name ?? user.email}
          </p>
          <form action={logout}>
            <button
              type="submit"
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
                background: "none",
                border: "none",
                color: "var(--muted)",
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

      {/* Main content */}
      <main style={{ marginLeft: 216, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
