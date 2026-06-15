import { createAdminClient } from "@/lib/supabase/admin";
import DealsManager from "@/components/admin/DealsManager";
import Link from "next/link";

export default async function DealsPage() {
  const db = createAdminClient();

  const { data: deals } = await db
    .from("deals")
    .select(
      "id, business_name, summary_public, details_gated, industry, revenue_to_date, funding_required, is_active, created_at"
    )
    .order("created_at", { ascending: false });

  const active = deals?.filter((d) => d.is_active).length ?? 0;
  const total = deals?.length ?? 0;

  return (
    <div style={{ padding: "48px 40px", maxWidth: 960 }}>
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
        Admin
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 8,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Deals
        </h1>
      </div>

      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          color: "var(--muted)",
          margin: "0 0 32px",
        }}
      >
        {active} active · {total} total — Promote approved applications from{" "}
        <Link
          href="/admin/applications?status=approved"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          Applications
        </Link>
      </p>

      <DealsManager deals={deals ?? []} />
    </div>
  );
}
