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
  | "application.documents_requested"
  | "user.blacklisted"
  | "user.unblacklisted"
  | "user.deactivated"
  | "user.reactivated"
  | "deal.created"
  | "deal.updated"
  | "deal.deactivated"
  | "portfolio.created"
  | "portfolio.updated"
  | "admin.invited"
  | "admin.accepted_invite"
  | "admin.removed"
  | "membership.paid"
  | "membership.revoked";

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
  if (profile?.role !== "admin" && profile?.role !== "super_admin")
    throw new Error("Not authorized");

  return user;
}

async function getSuperAdminUser() {
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
  if (profile?.role !== "super_admin") throw new Error("Not authorized");

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

  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name")
    .eq("id", applicationId)
    .single();

  if (app) {
    const emailResult = await sendEmail(
      TEMPLATES.APPLICATION_UNDER_REVIEW,
      app.contact_email,
      {
        applicant_name: app.founder_name,
        business_name: app.business_name,
      }
    );
    if (emailResult.error) {
      console.error("[setApplicationUnderReview] email send FAILED:", emailResult.error);
    }
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  return {};
}

export async function approveApplication(
  applicationId: string
): Promise<{ error?: string }> {
  const user = await getSuperAdminUser();
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

  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name")
    .eq("id", applicationId)
    .single();

  if (app) {
    const emailResult = await sendEmail(
      TEMPLATES.APPLICATION_APPROVED,
      app.contact_email,
      {
        applicant_name: app.founder_name,
        business_name: app.business_name,
      }
    );
    if (emailResult.error) {
      console.error("[approveApplication] email send FAILED:", emailResult.error);
    }
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

  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name")
    .eq("id", applicationId)
    .single();

  if (app) {
    const emailResult = await sendEmail(
      TEMPLATES.APPLICATION_REJECTED,
      app.contact_email,
      {
        applicant_name: app.founder_name,
        business_name: app.business_name,
        rejection_reason: rejectionReason.trim(),
      }
    );
    if (emailResult.error) {
      console.error("[rejectApplication] email send FAILED:", emailResult.error);
    }
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  return {};
}

export async function requestDocuments(
  applicationId: string,
  note: string
): Promise<{ error?: string }> {
  if (!note.trim()) return { error: "A note explaining what is needed is required." };

  const user = await getAdminUser();
  const db = createAdminClient();

  const { data: app } = await db
    .from("applications")
    .select("contact_email, founder_name, business_name, status")
    .eq("id", applicationId)
    .single();

  if (!app) return { error: "Application not found." };
  if (app.status === "approved" || app.status === "rejected") {
    return { error: "Cannot request documents on a finalised application." };
  }

  const { error } = await db
    .from("applications")
    .update({
      status: "needs_documents" as never,
      documents_requested_note: note.trim() as never,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);
  if (error) return { error: error.message };

  await writeAudit(
    user.id,
    "application.documents_requested",
    "application",
    applicationId,
    { note: note.trim() }
  );

  const emailResult = await sendEmail(
    TEMPLATES.DOCUMENTS_REQUESTED,
    app.contact_email,
    {
      applicant_name: app.founder_name,
      business_name: app.business_name,
      documents_note: note.trim(),
    }
  );
  if (emailResult.error) {
    console.error("[requestDocuments] email send FAILED:", emailResult.error);
  }

  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
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

  const actor = await getSuperAdminUser();
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

// ── Admin team management ────────────────────────────────────────────────────

export async function inviteAdmin(
  email: string
): Promise<{ error?: string }> {
  console.log("[inviteAdmin] START — raw email:", email);
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) return { error: "Email is required." };

  // STEP 1 — auth guard
  let actor: { id: string };
  try {
    actor = await getSuperAdminUser();
    console.log("[inviteAdmin] STEP 1 OK — actor id:", actor.id);
  } catch (e) {
    console.error("[inviteAdmin] STEP 1 FAIL — getSuperAdminUser threw:", e);
    throw e;
  }

  const db = createAdminClient();

  // STEP 2 — check for existing admin
  console.log("[inviteAdmin] STEP 2 — checking auth.users for:", trimmedEmail);
  const { data: authUsers, error: listErr } = await db.auth.admin.listUsers();
  if (listErr) console.warn("[inviteAdmin] STEP 2 WARN — listUsers error:", listErr.message);
  const existingUser = authUsers?.users.find((u) => u.email === trimmedEmail);
  if (existingUser) {
    console.log("[inviteAdmin] STEP 2 — existing auth user found, id:", existingUser.id);
    const { data: existingProfile } = await db
      .from("profiles")
      .select("role")
      .eq("id", existingUser.id)
      .single();
    console.log("[inviteAdmin] STEP 2 — existing profile role:", existingProfile?.role ?? "null (no profile row)");
    if (
      existingProfile?.role === "admin" ||
      existingProfile?.role === "super_admin"
    ) {
      return { error: "This email already has an admin account." };
    }
  } else {
    console.log("[inviteAdmin] STEP 2 — no existing auth user found");
  }

  // STEP 3 — insert invite row
  console.log("[inviteAdmin] STEP 3 — inserting admin_invite for:", trimmedEmail, "| invited_by:", actor.id);
  const { data: invite, error: inviteError } = await db
    .from("admin_invites")
    .insert({ email: trimmedEmail, invited_by: actor.id })
    .select("token")
    .single();
  if (inviteError) {
    console.error("[inviteAdmin] STEP 3 FAIL — insert error code:", inviteError.code, "| message:", inviteError.message);
    if (inviteError.code === "23505") {
      return { error: "An invite has already been sent to this email." };
    }
    return { error: inviteError.message };
  }
  console.log("[inviteAdmin] STEP 3 OK — token:", invite.token);

  // STEP 4 — fetch actor profile for email copy
  console.log("[inviteAdmin] STEP 4 — fetching actor profile, id:", actor.id);
  const { data: actorProfile, error: profileErr } = await db
    .from("profiles")
    .select("full_name")
    .eq("id", actor.id)
    .single();
  if (profileErr) console.warn("[inviteAdmin] STEP 4 WARN — profile fetch error:", profileErr.message);
  console.log("[inviteAdmin] STEP 4 — full_name:", actorProfile?.full_name ?? "null → fallback 'Imani Ventures'");

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${invite.token}`;
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // STEP 5 — Loops send
  const templateId = TEMPLATES.ADMIN_INVITE;
  console.log("[inviteAdmin] STEP 5 — preparing Loops send");
  console.log("[inviteAdmin] STEP 5 — templateId:", templateId || "(EMPTY — LOOPS_TEMPLATE_ADMIN_INVITE not set in env!)");
  console.log("[inviteAdmin] STEP 5 — LOOPS_API_KEY present:", !!process.env.LOOPS_API_KEY);
  console.log("[inviteAdmin] STEP 5 — to:", trimmedEmail);
  console.log("[inviteAdmin] STEP 5 — dataVariables:", {
    invite_link: inviteLink,
    invited_by_name: actorProfile?.full_name ?? "Imani Ventures",
    expires_at: expiresAt,
  });

  const emailResult = await sendEmail(templateId, trimmedEmail, {
    invite_link: inviteLink,
    invited_by_name: actorProfile?.full_name ?? "Imani Ventures",
    expires_at: expiresAt,
  });

  if (emailResult.error) {
    console.error("[inviteAdmin] STEP 5 FAIL — Loops returned error:", emailResult.error);
  } else {
    console.log("[inviteAdmin] STEP 5 OK — Loops send succeeded");
  }

  // STEP 6 — audit log
  await writeAudit(actor.id, "admin.invited", "admin_invite", invite.token as never, {
    email: trimmedEmail,
  });

  console.log("[inviteAdmin] DONE — returning success");
  revalidatePath("/admin/users");
  return {};
}

export async function acceptAdminInvite(
  token: string,
  fullName: string,
  password: string
): Promise<{ error?: string }> {
  const trimmedName = fullName.trim();
  if (!trimmedName) return { error: "Full name is required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const db = createAdminClient();

  // Validate token
  const { data: invite, error: fetchError } = await db
    .from("admin_invites")
    .select("*")
    .eq("token", token)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (fetchError || !invite) {
    return { error: "This invite link is invalid or has expired." };
  }

  // Create auth user
  const { data: newUser, error: createError } = await db.auth.admin.createUser({
    email: invite.email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin", full_name: trimmedName },
  });
  if (createError) return { error: createError.message };

  // Insert profile (trigger may also run — use upsert to be safe)
  await db.from("profiles").upsert({
    id: newUser.user.id,
    role: "admin",
    full_name: trimmedName,
  });

  // Mark invite accepted
  await db
    .from("admin_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  await writeAudit(
    newUser.user.id,
    "admin.accepted_invite",
    "admin_invite",
    invite.id,
    { email: invite.email }
  );

  return {};
}

export async function updateUserName(
  userId: string,
  fullName: string
): Promise<{ error?: string }> {
  await getAdminUser();
  const db = createAdminClient();
  const trimmed = fullName.trim();
  const { error } = await db
    .from("profiles")
    .update({ full_name: trimmed || null })
    .eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return {};
}

// ── Membership ───────────────────────────────────────────────────────────────

export async function revokeMembership(
  userId: string,
  reason: string
): Promise<{ error?: string }> {
  if (!reason.trim()) return { error: "Revocation reason is required." };

  const actor = await getSuperAdminUser();
  const db = createAdminClient();

  const { data: target } = await db
    .from("profiles")
    .select("role, has_paid_membership")
    .eq("id", userId)
    .single();

  if (!target) return { error: "User not found." };
  if (target.role !== "investor") return { error: "User is not an investor." };
  if (!target.has_paid_membership) return { error: "No active membership to revoke." };

  const { error } = await db
    .from("profiles")
    .update({ has_paid_membership: false })
    .eq("id", userId);
  if (error) return { error: error.message };

  // Mark the most recent successful payment as refunded
  const { data: latestPayment } = await db
    .from("membership_payments")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "success")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestPayment) {
    await db
      .from("membership_payments")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
        refund_reason: reason.trim(),
      })
      .eq("id", latestPayment.id);
  }

  await writeAudit(actor.id, "membership.revoked", "user", userId, { reason });

  revalidatePath("/admin/users");
  return {};
}

export async function removeAdmin(
  userId: string
): Promise<{ error?: string }> {
  const actor = await getSuperAdminUser();
  const db = createAdminClient();

  // Confirm target is admin (not super_admin — never remove super_admin via UI)
  const { data: target } = await db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (!target) return { error: "User not found." };
  if (target.role === "super_admin") return { error: "Cannot remove a super admin." };
  if (target.role !== "admin") return { error: "This user is not an admin." };

  const { error } = await db
    .from("profiles")
    .update({ role: "applicant" })
    .eq("id", userId);
  if (error) return { error: error.message };

  await writeAudit(actor.id, "admin.removed", "user", userId);

  revalidatePath("/admin/users");
  return {};
}
