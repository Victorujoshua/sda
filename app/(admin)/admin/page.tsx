import { createAdminClient } from "@/lib/supabase/admin";

function fmt(n: number) {
  return n.toLocaleString("en-NG");
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        padding: "24px 28px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--muted)",
          margin: "0 0 10px",
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
          color: "var(--ink)",
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 12,
            color: "var(--muted)",
            margin: "8px 0 0",
          }}
        >
          {sub}
        </p>
      )}
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
    db.from("applications").select("*", { count: "exact", head: true }),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "under_review"),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
    db
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected"),
    db
      .from("deals")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    db.from("profiles").select("*", { count: "exact", head: true }),
    db
      .from("applications")
      .select("funding_amount")
      .eq("status", "approved"),
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
          fontSize: 11,
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

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          backgroundColor: "var(--border)",
          marginBottom: 1,
        }}
      >
        <div style={{ backgroundColor: "var(--paper)" }}>
          <StatCard
            label="Total applications"
            value={fmt(total ?? 0)}
            sub={`${inQueue} awaiting review`}
          />
        </div>
        <div style={{ backgroundColor: "var(--paper)" }}>
          <StatCard
            label="Approval rate"
            value={`${approvalRate}%`}
            sub={`${approved ?? 0} approved · ${rejected ?? 0} rejected`}
          />
        </div>
        <div style={{ backgroundColor: "var(--paper)" }}>
          <StatCard
            label="Active deals"
            value={fmt(activeDeals ?? 0)}
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          backgroundColor: "var(--border)",
        }}
      >
        <div style={{ backgroundColor: "var(--paper)" }}>
          <StatCard
            label="Total funding approved"
            value={`₦${fmt(totalFunding)}`}
          />
        </div>
        <div style={{ backgroundColor: "var(--paper)" }}>
          <StatCard
            label="Registered users"
            value={fmt(totalUsers ?? 0)}
          />
        </div>
        <div style={{ backgroundColor: "var(--paper)" }}>
          <StatCard
            label="In queue"
            value={fmt(inQueue)}
            sub={`${pending ?? 0} pending · ${underReview ?? 0} under review`}
          />
        </div>
      </div>
    </div>
  );
}
