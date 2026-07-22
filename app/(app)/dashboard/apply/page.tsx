import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ApplyForm from "./ApplyForm";

function detectStartStep(data: {
  funding_type: string | null;
  funding_amount: number | null;
  business_description: string;
  business_name: string;
} | null): number {
  if (!data) return 1;
  if (data.funding_type && data.funding_amount) return 4;
  if (data.business_description && data.business_description.length >= 50) return 3;
  if (data.business_name) return 2;
  return 1;
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ resume?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let initialData = null;
  let initialApplicationId: string | undefined = undefined;
  let documentsNote: string | null = null;

  if (params.resume) {
    // Cast to unknown first — documents_requested_note and needs_documents status
    // aren't in generated types until migration 20260722000002 types are regenerated.
    const { data: rawData } = await supabase
      .from("applications")
      .select(
        "id, business_name, founder_name, contact_email, contact_phone, business_description, monthly_revenue, funding_amount, funding_type, status, documents_requested_note"
      )
      .eq("id", params.resume)
      .eq("user_id", user.id)
      .in("status", ["draft", "needs_documents"] as never[])
      .single() as unknown as {
        data: {
          id: string;
          business_name: string;
          founder_name: string;
          contact_email: string;
          contact_phone: string | null;
          business_description: string;
          monthly_revenue: number | null;
          funding_amount: number | null;
          funding_type: "equity" | "debt" | "asset" | "revenue_based" | null;
          status: string;
          documents_requested_note: string | null;
        } | null;
        error: unknown;
      };

    if (rawData) {
      initialData = rawData;
      initialApplicationId = rawData.id;
      documentsNote = rawData.documents_requested_note ?? null;
    }
  }

  const isDocumentsMode = !!(initialData && (initialData as { status: string }).status === "needs_documents");
  const startStep = isDocumentsMode ? 4 : detectStartStep(initialData);

  return (
    <ApplyForm
      initialData={initialData}
      initialApplicationId={initialApplicationId}
      startStep={startStep}
      userId={user.id}
      documentsNote={documentsNote}
      isDocumentsMode={isDocumentsMode}
    />
  );
}
