"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function expressInterest(
  dealId: string,
  dealName: string
): Promise<{ error?: string; alreadyExpressed?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to express interest." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "investor") {
    return { error: "Only investors can express interest in deals." };
  }

  // Prevent duplicate expressions for the same deal
  const { data: existing } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", user.id)
    .eq("type", "investor_interest")
    .eq("message", dealId)
    .maybeSingle();

  if (existing) return { alreadyExpressed: true };

  const { error } = await supabase.from("notifications").insert({
    user_id: user.id,
    type: "investor_interest",
    message: dealId,
  });
  if (error) return { error: error.message };

  // TODO [Section 7]: Send admin notification email for new investor interest
  console.log("TODO [Section 7]: Notify admin of investor interest", {
    dealId,
    dealName,
    investorEmail: user.email,
    investorName: profile?.full_name,
  });

  revalidatePath(`/opportunities/${dealId}`);
  revalidatePath("/dashboard");
  return {};
}
