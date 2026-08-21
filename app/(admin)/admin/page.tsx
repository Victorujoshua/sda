import type { ReactNode } from "react";
import { createAdminClient } from "@/lib/supabase/admin";

function fmt(n: number) {
  return n.toLocaleString("en-NG");
}

function StatCard({
  label,
  value,
  sub,
  hero = false,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  hero?: boolean;
}) {
  return (
    <div
      className="imani-admin-stat-card"
      style={{
        backgroundColor: hero ? "var(--crimson)" : "var(--cream)",
        border: hero ? "none" : "1px solid var(--hairline)",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 160,
      }}
    >
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: hero ? "rgba(248,237,235,0.65)" : "rgba(17,17,17,0.4)",
          margin: "0 0 16px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--sr)",
          fontSize: 36,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: hero ? "var(--cream)" : "var(--ink)",
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 14,
          color: hero ? "rgba(248,237,235,0.60)" : "rgba(17,17,17,0.45)",
          margin: "12px 0 0",
          minHeight: 20,
        }}
      >
        {sub ?? ""}
      </p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const db = createAdminClient();

  const [
    { count: total },
    { count: pending },
    { count: underReview },
    { count: approved },
    { count: rejected },
    { count: activeDeals },
    { count: totalUsers },
    { data: approvedFunding },
  ] = await Promise.all([
    db.from("applications").select("*", { count: "exact", head: true }).neq("status", "draft" as never).is("deleted_at" as never, null),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at" as never, null),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "under_review")
      .is("deleted_at" as never, null),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")
      .is("deleted_at" as never, null),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected")
      .is("deleted_at" as never, null),
    db
      .from("deals")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    db.from("profiles").select("*", { count: "exact", head: true }),
    db
      .from("applications")
      .select("funding_amount")
      .eq("status", "approved")
      .is("deleted_at" as never, null),
  ]);

  const totalFunding =
    approvedFunding?.reduce((s, a) => s + (a.funding_amount ?? 0), 0) ?? 0;
  const approvalRate =
    total && approved ? Math.round((approved / total) * 100) : 0;
  const inQueue = (pending ?? 0) + (underReview ?? 0);

  return (
    <div style={{ padding: "48px 40px" }}>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--muted)",
          margin: "0 0 12px",
        }}
      >
        Overview
      </p>
      <h1
        style={{
          fontFamily: "var(--sr)",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          margin: "0 0 40px",
        }}
      >
        Dashboard
      </h1>

      {/* Single unified 3×2 stats grid */}
      <div className="imani-admin-stats-grid">
        <StatCard
          label="Total applications"
          value={fmt(total ?? 0)}
          sub={`${inQueue} awaiting review`}
          hero
        />
        <StatCard
          label="Approval rate"
          value={`${approvalRate}%`}
          sub={`${approved ?? 0} approved · ${rejected ?? 0} rejected`}
        />
        <StatCard
          label="Active deals"
          value={fmt(activeDeals ?? 0)}
        />
        <StatCard
          label="Total funding approved"
          value={<><span style={{ fontFamily: "'Aileron', system-ui, sans-serif", textDecoration: "none" }}>₦</span>{fmt(totalFunding)}</>}
        />
        <StatCard
          label="Registered users"
          value={fmt(totalUsers ?? 0)}
        />
        <StatCard
          label="In queue"
          value={fmt(inQueue)}
          sub={`${pending ?? 0} pending · ${underReview ?? 0} under review`}
        />
      </div>
    </div>
  );
}
