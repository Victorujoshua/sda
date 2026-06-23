import { createAdminClient } from "@/lib/supabase/admin";
import PortfolioManager from "@/components/admin/PortfolioManager";

export default async function AdminPortfolioPage() {
  const db = createAdminClient();

  const { data: companies } = await db
    .from("portfolio_companies")
    .select(
      "id, name, description, display_order, is_published, detail_page_content, created_at"
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  const published = companies?.filter((c) => c.is_published).length ?? 0;
  const total = companies?.length ?? 0;

  return (
    <div style={{ padding: "48px 40px", maxWidth: 800 }}>
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
        Admin
      </p>
      <h1
        style={{
          fontFamily: "var(--sr)",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          margin: "0 0 8px",
        }}
      >
        Portfolio
      </h1>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          margin: "0 0 40px",
        }}
      >
        {published} published · {total} total
      </p>

      <PortfolioManager companies={companies ?? []} />
    </div>
  );
}
