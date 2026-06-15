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

  if (params.resume) {
    const { data } = await supabase
      .from("applications")
      .select(
        "id, business_name, founder_name, contact_email, contact_phone, business_description, monthly_revenue, funding_amount, funding_type, status"
      )
      .eq("id", params.resume)
      .eq("user_id", user.id)
      .eq("status", "draft")
      .single();

    if (data) {
      initialData = data;
      initialApplicationId = data.id;
    }
  }

  const startStep = detectStartStep(initialData);

  return (
    <ApplyForm
      initialData={initialData}
      initialApplicationId={initialApplicationId}
      startStep={startStep}
      userId={user.id}
    />
  );
}
