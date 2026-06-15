import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import ApplicationActions from "@/components/admin/ApplicationActions";
import AdminNotesForm from "@/components/admin/AdminNotesForm";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_COLOR: Record<string, string> = {
  draft: "var(--muted)",
  pending: "var(--warning)",
  under_review: "var(--accent)",
  approved: "var(--success)",
  rejected: "var(--danger)",
};

function fmt(n: number | null) {
  if (!n) return "—";
  return `₦${n.toLocaleString("en-NG")}`;
}

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "14px 0",
        display: "flex",
        gap: 24,
      }}
    >
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          flexShrink: 0,
          width: 180,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 14,
          color: "var(--ink)",
          lineHeight: 1.6,
          wordBreak: "break-word",
          flex: 1,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = createAdminClient();

  const [{ data: app }, { data: docs }, ] = await Promise.all([
    db
      .from("applications")
      .select("*")
      .eq("id", id)
      .single(),
    db
      .from("application_documents")
      .select("*")
      .eq("application_id", id),
  ]);

  if (!app) notFound();

  // Fetch profile separately
  const { data: profile } = await db
    .from("profiles")
    .select("is_blacklisted, blacklist_reason, full_name")
    .eq("id", app.user_id)
    .single();

  // Generate signed URLs for documents (10 minutes = 600s)
  const docsWithUrls = await Promise.all(
    (docs ?? []).map(async (doc) => {
      const bucket =
        doc.document_type === "financials" ? "financial-records" : "bank-statements";
      const { data: signed } = await db.storage
        .from(bucket)
        .createSignedUrl(doc.file_path, 600);
      console.log(`[Admin] Signed URL generated for doc ${doc.id}, expires 600s`);
      return { ...doc, signedUrl: signed?.signedUrl ?? null };
    })
  );

  const FUNDING_LABELS: Record<string, string> = {
    equity: "Equity",
    debt: "Debt",
    asset: "Asset",
    revenue_based: "Revenue share",
  };

  return (
    <div style={{ padding: "48px 40px", maxWidth: 900 }}>
      {/* Back */}
      <Link
        href="/admin/applications"
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          color: "var(--muted)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 24,
        }}
      >
        ← Applications
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 40,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: STATUS_COLOR[app.status] ?? "var(--muted)",
              margin: "0 0 10px",
            }}
          >
            {STATUS_LABEL[app.status] ?? app.status}
          </p>
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
            {app.business_name}
          </h1>
          {app.submitted_at && (
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 13,
                color: "var(--muted)",
                margin: "8px 0 0",
              }}
            >
              Submitted {fmtDate(app.submitted_at)}
            </p>
          )}
        </div>

        {/* Promote link — only if approved */}
        {app.status === "approved" && (
          <Link
            href={`/admin/applications/${id}/promote`}
            style={{
              display: "inline-block",
              fontFamily: "var(--in)",
              fontSize: 12,
              letterSpacing: "0.04em",
              padding: "9px 20px",
              backgroundColor: "var(--accent)",
              color: "#FAFAF8",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Promote to deal →
          </Link>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* Left: application data */}
        <div>
          {/* Business info */}
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              margin: "0 0 4px",
            }}
          >
            Business information
          </p>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <Field label="Business name" value={app.business_name} />
            <Field label="Founder" value={app.founder_name} />
            <Field label="Contact email" value={app.contact_email} />
            <Field label="Phone" value={app.contact_phone ?? "—"} />
            <Field label="Description" value={app.business_description} />
            <Field
              label="Monthly revenue"
              value={app.monthly_revenue != null ? fmt(app.monthly_revenue) : "—"}
            />
          </div>

          {/* Funding */}
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              margin: "32px 0 4px",
            }}
          >
            Funding ask
          </p>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <Field label="Amount requested" value={fmt(app.funding_amount)} />
            <Field
              label="Structure"
              value={
                app.funding_type
                  ? FUNDING_LABELS[app.funding_type] ?? app.funding_type
                  : "—"
              }
            />
          </div>

          {/* Documents */}
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              margin: "32px 0 12px",
            }}
          >
            Documents
          </p>
          {docsWithUrls.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--muted)",
              }}
            >
              No documents uploaded.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {docsWithUrls.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    border: "1px solid var(--border)",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--in)",
                        fontSize: 13,
                        color: "var(--ink)",
                        margin: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {doc.document_type === "financials"
                        ? "Financial statements"
                        : "Bank statements"}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--in)",
                        fontSize: 11,
                        color: "var(--muted)",
                        margin: "3px 0 0",
                      }}
                    >
                      Uploaded{" "}
                      {new Date(doc.uploaded_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {doc.signedUrl ? (
                    <a
                      href={doc.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--in)",
                        fontSize: 12,
                        letterSpacing: "0.04em",
                        padding: "7px 16px",
                        backgroundColor: "var(--surface)",
                        color: "var(--ink)",
                        textDecoration: "none",
                        border: "1px solid var(--border)",
                        flexShrink: 0,
                      }}
                    >
                      View (10 min)
                    </a>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--in)",
                        fontSize: 12,
                        color: "var(--muted)",
                      }}
                    >
                      Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rejection reason (if rejected) */}
          {app.status === "rejected" && app.rejection_reason && (
            <div
              style={{
                border: "1px solid var(--danger)",
                padding: "16px 20px",
                marginTop: 32,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--danger)",
                  margin: "0 0 8px",
                }}
              >
                Rejection reason
              </p>
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 14,
                  color: "var(--ink)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {app.rejection_reason}
              </p>
            </div>
          )}
        </div>

        {/* Right: actions + notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Applicant info */}
          <div
            style={{
              border: "1px solid var(--border)",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                margin: "0 0 12px",
              }}
            >
              Applicant
            </p>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--ink)",
                margin: "0 0 4px",
              }}
            >
              {profile?.full_name ?? app.founder_name}
            </p>
            {profile?.is_blacklisted && (
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 12,
                  color: "var(--danger)",
                  margin: "4px 0 0",
                }}
              >
                Blacklisted
                {profile.blacklist_reason
                  ? `: ${profile.blacklist_reason}`
                  : ""}
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            style={{
              border: "1px solid var(--border)",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                margin: "0 0 16px",
              }}
            >
              Actions
            </p>
            <ApplicationActions
              applicationId={id}
              userId={app.user_id}
              currentStatus={
                app.status as
                  | "draft"
                  | "pending"
                  | "under_review"
                  | "approved"
                  | "rejected"
              }
              isBlacklisted={profile?.is_blacklisted ?? false}
            />
          </div>

          {/* Admin notes */}
          <div
            style={{
              border: "1px solid var(--border)",
              padding: "20px",
            }}
          >
            <AdminNotesForm
              applicationId={id}
              initialNotes={app.admin_notes ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
