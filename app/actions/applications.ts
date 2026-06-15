"use server";

import { createClient } from "@/lib/supabase/server";
import { fullApplicationSchema } from "@/lib/validations/application";
import { sendEmail, TEMPLATES } from "@/lib/email/loops";

type DraftPayload = {
  business_name?: string;
  founder_name?: string;
  contact_email?: string;
  contact_phone?: string | null;
  business_description?: string;
  monthly_revenue?: number | null;
  funding_amount?: number | null;
  funding_type?: "equity" | "debt" | "asset" | "revenue_based" | null;
};

export async function saveDraft(
  formData: DraftPayload,
  applicationId?: string
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const payload = {
    user_id: user.id,
    status: "draft" as const,
    business_name: formData.business_name ?? "",
    founder_name: formData.founder_name ?? "",
    contact_email: formData.contact_email ?? "",
    contact_phone: formData.contact_phone ?? null,
    business_description: formData.business_description ?? "",
    monthly_revenue: formData.monthly_revenue ?? null,
    funding_amount: formData.funding_amount ?? null,
    funding_type: formData.funding_type ?? null,
  };

  if (applicationId) {
    const { data, error } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", applicationId)
      .eq("user_id", user.id)
      .select("id")
      .single();
    if (error) return { error: error.message };
    return { id: data.id };
  }

  const { data, error } = await supabase
    .from("applications")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function submitApplication(
  applicationId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: app, error: fetchError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();
  if (fetchError || !app) return { error: "Application not found." };

  const parsed = fullApplicationSchema.safeParse({
    business_name: app.business_name,
    founder_name: app.founder_name,
    contact_email: app.contact_email,
    contact_phone: app.contact_phone,
    business_description: app.business_description,
    monthly_revenue: app.monthly_revenue,
    funding_amount: app.funding_amount,
    funding_type: app.funding_type,
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: `${first.path.join(".")}: ${first.message}` };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_blacklisted, full_name")
    .eq("id", user.id)
    .single();
  if (profile?.is_blacklisted) {
    return {
      error:
        "Your account has been restricted. Contact support for assistance.",
    };
  }

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["pending", "under_review"])
    .neq("id", applicationId)
    .maybeSingle();
  if (existing) {
    return {
      error:
        "You already have an application under review. Wait for a decision before submitting again.",
    };
  }

  const submittedAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("applications")
    .update({ status: "pending", submitted_at: submittedAt })
    .eq("id", applicationId)
    .eq("user_id", user.id);
  if (updateError) return { error: updateError.message };

  const submittedDate = new Date(submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Confirmation email to applicant
  await sendEmail(
    TEMPLATES.APPLICATION_SUBMITTED,
    app.contact_email,
    {
      applicant_name: profile?.full_name ?? app.founder_name,
      business_name: app.business_name,
      submitted_date: submittedDate,
    }
  );

  // New application alert to admin
  const adminEmail = process.env.LOOPS_ADMIN_EMAIL;
  if (adminEmail) {
    const fundingAmount = app.funding_amount
      ? `₦${Number(app.funding_amount).toLocaleString("en-NG")}`
      : "Not specified";
    const adminLink = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/admin/applications/${applicationId}`;

    await sendEmail(
      TEMPLATES.NEW_APPLICATION_ADMIN,
      adminEmail,
      {
        applicant_name: profile?.full_name ?? app.founder_name,
        business_name: app.business_name,
        funding_amount: fundingAmount,
        submitted_date: submittedDate,
        admin_link: adminLink,
      }
    );
  }

  return {};
}

export async function saveDocumentRecord(
  applicationId: string,
  filePath: string,
  documentType: "financials" | "bank_statement"
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: app } = await supabase
    .from("applications")
    .select("id")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();
  if (!app) return { error: "Application not found." };

  const { error } = await supabase.from("application_documents").insert({
    application_id: applicationId,
    document_type: documentType,
    file_path: filePath,
  });
  if (error) return { error: error.message };
  return {};
}
