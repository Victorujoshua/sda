import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import PromoteForm from "@/components/admin/PromoteForm";

export default async function PromotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = createAdminClient();

  const { data: app } = await db
    .from("applications")
    .select(
      "id, business_name, status, funding_amount, business_description, funding_type"
    )
    .eq("id", id)
    .single();

  if (!app || app.status !== "approved") notFound();

  return (
    <div style={{ padding: "48px 40px", maxWidth: 800 }}>
      <Link
        href={`/admin/applications/${id}`}
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          color: "var(--muted)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 24,
        }}
      >
        ← {app.business_name}
      </Link>

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
        Promote to deal
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
        {app.business_name}
      </h1>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 14,
          color: "var(--muted)",
          margin: "0 0 40px",
          lineHeight: 1.6,
        }}
      >
        This will create a new deal record on the opportunities page. Fill in
        the public-facing content below.
      </p>

      <PromoteForm
        applicationId={id}
        businessName={app.business_name}
        prefill={{
          funding_amount: app.funding_amount,
          business_description: app.business_description,
          funding_type: app.funding_type,
        }}
      />
    </div>
  );
}
