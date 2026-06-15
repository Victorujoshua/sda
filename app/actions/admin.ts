"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendEmail, TEMPLATES } from "@/lib/email/loops";

type AuditAction =
  | "application.submitted"
  | "application.approved"
  | "application.rejected"
  | "application.under_review"
  | "user.blacklisted"
  | "user.unblacklisted"
  | "user.deactivated"
  | "user.reactivated"
  | "deal.created"
  | "deal.updated"
  | "deal.deactivated"
  | "portfolio.created"
  | "portfolio.updated";

async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Not authorized");

  return user;
}

async function writeAudit(
  actorId: string,
  action: AuditAction,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>
) {
  const db = createAdminClient();
  await db.from("audit_log").insert({
    actor_id: actorId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata: (metadata ?? null) as never,
  });
}

// ── Application status actions ───────────────────────────────────────────────

export async function setApplicationUnderReview(
  applicationId: string
): Promise<{ error?: string }> {
  const user = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("applications")
    .update({
      status: "under_review",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);
  if (error) return { error: error.message };

  await writeAudit(user.id, "application.under_review", "application", applicationId);

  // Fetch application data for email
  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name")
    .eq("id", applicationId)
    .single();

  if (app) {
    await sendEmail(
      TEMPLATES.APPLICATION_UNDER_REVIEW,
      app.contact_email,
      {
        applicant_name: app.founder_name,
        business_name: app.business_name,
      }
    );
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  return {};
}

export async function approveApplication(
  applicationId: string
): Promise<{ error?: string }> {
  const user = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("applications")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);
  if (error) return { error: error.message };

  await writeAudit(user.id, "application.approved", "application", applicationId);

  // Fetch application data for email
  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name")
    .eq("id", applicationId)
    .single();

  if (app) {
    await sendEmail(
      TEMPLATES.APPLICATION_APPROVED,
      app.contact_email,
      {
        applicant_name: app.founder_name,
        business_name: app.business_name,
      }
    );
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return {};
}

export async function rejectApplication(
  applicationId: string,
  rejectionReason: string
): Promise<{ error?: string }> {
  if (!rejectionReason.trim()) return { error: "Rejection reason is required." };

  const user = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("applications")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason.trim(),
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);
  if (error) return { error: error.message };

  await writeAudit(user.id, "application.rejected", "application", applicationId, {
    rejection_reason: rejectionReason,
  });

  // Fetch application data for email
  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name")
    .eq("id", applicationId)
    .single();

  if (app) {
    await sendEmail(
      TEMPLATES.APPLICATION_REJECTED,
      app.contact_email,
      {
        applicant_name: app.founder_name,
        business_name: app.business_name,
        rejection_reason: rejectionReason.trim(),
      }
    );
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return {};
}

export async function saveAdminNotes(
  applicationId: string,
  notes: string
): Promise<{ error?: string }> {
  await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("applications")
    .update({ admin_notes: notes })
    .eq("id", applicationId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/applications/${applicationId}`);
  return {};
}

// ── User management ──────────────────────────────────────────────────────────

export async function blacklistUser(
  userId: string,
  reason: string
): Promise<{ error?: string }> {
  if (!reason.trim()) return { error: "Blacklist reason is required." };

  const actor = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("profiles")
    .update({ is_blacklisted: true, blacklist_reason: reason.trim() })
    .eq("id", userId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "user.blacklisted", "user", userId, { reason });

  revalidatePath("/admin/users");
  revalidatePath("/admin/applications");
  return {};
}

export async function unblacklistUser(userId: string): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("profiles")
    .update({ is_blacklisted: false, blacklist_reason: null })
    .eq("id", userId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "user.unblacklisted", "user", userId);

  revalidatePath("/admin/users");
  revalidatePath("/admin/applications");
  return {};
}

export async function deactivateUser(userId: string): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("profiles")
    .update({ is_active: false })
    .eq("id", userId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "user.deactivated", "user", userId);

  revalidatePath("/admin/users");
  return {};
}

export async function reactivateUser(userId: string): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("profiles")
    .update({ is_active: true })
    .eq("id", userId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "user.reactivated", "user", userId);

  revalidatePath("/admin/users");
  return {};
}

// ── Deals ────────────────────────────────────────────────────────────────────

type DealPayload = {
  summary_public: string;
  details_gated?: string | null;
  industry?: string | null;
  revenue_to_date?: number | null;
  funding_required?: number | null;
  is_active?: boolean;
};

export async function promoteToDeals(
  applicationId: string,
  businessName: string,
  data: DealPayload
): Promise<{ id?: string; error?: string }> {
  if (!data.summary_public.trim()) return { error: "Public summary is required." };

  const actor = await getAdminUser();
  const db = createAdminClient();

  const { data: deal, error } = await db
    .from("deals")
    .insert({
      source_application_id: applicationId,
      business_name: businessName,
      summary_public: data.summary_public.trim(),
      details_gated: data.details_gated ?? null,
      industry: data.industry ?? null,
      revenue_to_date: data.revenue_to_date ?? null,
      funding_required: data.funding_required ?? null,
      is_active: data.is_active ?? true,
      created_by: actor.id,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await writeAudit(actor.id, "deal.created", "deal", deal.id, {
    source_application_id: applicationId,
    business_name: businessName,
  });

  revalidatePath("/admin/deals");
  revalidatePath("/admin/applications");
  revalidatePath("/opportunities");
  return { id: deal.id };
}

export async function updateDeal(
  dealId: string,
  data: Partial<DealPayload>
): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  const db = createAdminClient();

  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  if (payload.summary_public) {
    payload.summary_public = (payload.summary_public as string).trim();
  }

  const { error } = await db.from("deals").update(payload as never).eq("id", dealId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "deal.updated", "deal", dealId, payload);

  revalidatePath("/admin/deals");
  revalidatePath("/opportunities");
  return {};
}

export async function deactivateDeal(dealId: string): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  const db = createAdminClient();

  const { error } = await db
    .from("deals")
    .update({ is_active: false })
    .eq("id", dealId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "deal.deactivated", "deal", dealId);

  revalidatePath("/admin/deals");
  revalidatePath("/opportunities");
  return {};
}

// ── Portfolio ────────────────────────────────────────────────────────────────

type PortfolioPayload = {
  name: string;
  description?: string | null;
  display_order?: number;
  is_published?: boolean;
  detail_page_content?: string | null;
};

export async function createPortfolioCompany(
  data: PortfolioPayload
): Promise<{ id?: string; error?: string }> {
  if (!data.name.trim()) return { error: "Company name is required." };

  const actor = await getAdminUser();
  const db = createAdminClient();

  const { data: company, error } = await db
    .from("portfolio_companies")
    .insert({
      name: data.name.trim(),
      description: data.description ?? null,
      display_order: data.display_order ?? 0,
      is_published: data.is_published ?? false,
      detail_page_content: data.detail_page_content ?? null,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await writeAudit(actor.id, "portfolio.created", "portfolio_company", company.id, {
    name: data.name,
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  return { id: company.id };
}

export async function updatePortfolioCompany(
  id: string,
  data: Partial<PortfolioPayload>
): Promise<{ error?: string }> {
  const actor = await getAdminUser();
  const db = createAdminClient();

  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  if (payload.name) payload.name = (payload.name as string).trim();

  const { error } = await db.from("portfolio_companies").update(payload as never).eq("id", id);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "portfolio.updated", "portfolio_company", id, payload);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  return {};
}
