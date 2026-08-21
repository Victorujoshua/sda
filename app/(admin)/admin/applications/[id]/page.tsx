import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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
  needs_documents: "Documents requested",
};

const STATUS_COLOR: Record<string, string> = {
  draft: "var(--muted)",
  pending: "#B26A00",
  under_review: "#1A5A9A",
  approved: "#16843B",
  rejected: "var(--maroon)",
  needs_documents: "#7A4A00",
};

const STATUS_BG: Record<string, string> = {
  draft: "rgba(107,107,107,0.08)",
  pending: "rgba(178,106,0,0.08)",
  under_review: "rgba(26,90,154,0.08)",
  approved: "rgba(22,132,59,0.08)",
  rejected: "rgba(109,22,38,0.08)",
  needs_documents: "rgba(122,74,0,0.08)",
};

function fmt(n: number | null) {
  if (!n) return "—";
  return (
    <>
      <span style={{ fontFamily: "var(--in)" }}>₦</span>
      {n.toLocaleString("en-NG")}
    </>
  );
}

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtDateShort(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function docBucket(type: string): string {
  if (type === "financials") return "financial-records";
  if (type === "bank_statement") return "bank-statements";
  return "supporting-documents";
}

function fileName(filePath: string): string {
  return filePath.split("/").pop() ?? filePath;
}

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "heic"]);

function isImage(filePath: string): boolean {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTS.has(ext);
}

// Card wrapper — white bg, hairline border, no radius, no shadow
function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid var(--hairline)",
        padding: "20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--in)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--muted)",
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        borderBottom: "1px solid var(--hairline)",
        padding: "10px 0",
      }}
    >
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "var(--muted)",
          flexShrink: 0,
          width: 140,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 15,
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
  const supabase = await createClient();

  const {
    data: { user: actor },
  } = await supabase.auth.getUser();
  const { data: actorProfile } = actor
    ? await db.from("profiles").select("role").eq("id", actor.id).single()
    : { data: null };
  const actorRole = actorProfile?.role ?? "admin";

  const [{ data: rawApp }, { data: docs }] = await Promise.all([
    db
      .from("applications")
      .select("*")
      .eq("id", id)
      .is("deleted_at" as never, null)
      .single(),
    db
      .from("application_documents")
      .select("*")
      .eq("application_id", id)
      .order("uploaded_at", { ascending: true }),
  ]);

  if (!rawApp) notFound();

  const { data: linkedDeal } = await db
    .from("deals")
    .select("id")
    .eq("source_application_id", id)
    .eq("is_active", true)
    .maybeSingle();
  const linkedDealId = linkedDeal?.id ?? undefined;

  const app = rawApp as unknown as {
    id: string;
    user_id: string;
    status: "draft" | "pending" | "under_review" | "approved" | "rejected" | "needs_documents";
    business_name: string;
    founder_name: string;
    contact_email: string;
    contact_phone: string | null;
    business_description: string;
    monthly_revenue: number | null;
    funding_amount: number | null;
    funding_type: string | null;
    submitted_at: string | null;
    admin_notes: string | null;
    rejection_reason: string | null;
    documents_requested_note: string | null;
  };

  const { data: profile } = await db
    .from("profiles")
    .select("is_blacklisted, blacklist_reason, full_name")
    .eq("id", app.user_id)
    .single();

  // Generate signed URLs — one createSignedUrls call per bucket, parallel
  const bucketPaths = new Map<string, string[]>();
  for (const doc of docs ?? []) {
    const bucket = docBucket(doc.document_type);
    if (!bucketPaths.has(bucket)) bucketPaths.set(bucket, []);
    bucketPaths.get(bucket)!.push(doc.file_path);
  }
  const signedMap = new Map<string, string | null>();
  await Promise.all(
    Array.from(bucketPaths.entries()).map(async ([bucket, paths]) => {
      const { data: urls } = await db.storage.from(bucket).createSignedUrls(paths, 600);
      if (urls) {
        for (let i = 0; i < paths.length; i++) {
          signedMap.set(paths[i], urls[i]?.signedUrl ?? null);
        }
      }
    })
  );

  const docsWithUrls = (docs ?? []).map((doc) => ({
    ...doc,
    signedUrl: signedMap.get(doc.file_path) ?? null,
    isImage: isImage(doc.file_path),
    name: fileName(doc.file_path),
  }));

  const FUNDING_LABELS: Record<string, string> = {
    equity: "Equity",
    debt: "Debt",
    asset: "Asset",
    revenue_based: "Revenue share",
  };

  const docGroups = [
    {
      key: "financials",
      label: "Financial statements",
      docs: docsWithUrls.filter((d) => (d.document_type as string) === "financials"),
    },
    {
      key: "bank_statement",
      label: "Bank statements",
      docs: docsWithUrls.filter((d) => (d.document_type as string) === "bank_statement"),
    },
    {
      key: "supporting",
      label: "Supporting documents",
      docs: docsWithUrls.filter((d) => (d.document_type as string) === "supporting"),
    },
  ].filter((g) => g.docs.length > 0);

  const totalDocs = docsWithUrls.length;

  return (
    <div
      style={{
        padding: "40px 40px 64px",
        maxWidth: 1100,
        backgroundColor: "var(--cream)",
        minHeight: "100vh",
      }}
    >
      {/* Back */}
      <Link
        href="/admin/applications"
        style={{
          fontFamily: "var(--in)",
          fontSize: 14,
          color: "var(--muted)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 28,
          letterSpacing: "0.02em",
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
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: STATUS_COLOR[app.status] ?? "var(--muted)",
                backgroundColor: STATUS_BG[app.status] ?? "transparent",
                padding: "3px 10px",
              }}
            >
              {STATUS_LABEL[app.status] ?? app.status}
            </span>
            {profile?.is_blacklisted && (
              <span
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--maroon)",
                  backgroundColor: "rgba(109,22,38,0.08)",
                  padding: "3px 10px",
                }}
              >
                Blacklisted
              </span>
            )}
          </div>
          <h1
            style={{
              fontFamily: "var(--sr)",
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              margin: "0 0 6px",
            }}
          >
            {app.business_name}
          </h1>
          {app.submitted_at && (
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--muted)",
                margin: 0,
              }}
            >
              Submitted {fmtDate(app.submitted_at)}
            </p>
          )}
        </div>

        {app.status === "approved" && actorRole === "super_admin" && (
          <Link
            href={`/admin/applications/${id}/promote`}
            style={{
              display: "inline-block",
              fontFamily: "var(--in)",
              fontSize: 13,
              letterSpacing: "0.05em",
              padding: "9px 20px",
              backgroundColor: "var(--crimson)",
              color: "var(--cream)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Promote to deal →
          </Link>
        )}
      </div>

      {/* Decision strip — the 4 numbers that drive approve/reject */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          backgroundColor: "var(--hairline)",
          marginBottom: 32,
          border: "1px solid var(--hairline)",
        }}
      >
        {[
          {
            label: "Funding ask",
            value: app.funding_amount
              ? `₦${app.funding_amount.toLocaleString("en-NG")}`
              : "—",
          },
          {
            label: "Monthly revenue",
            value: app.monthly_revenue
              ? `₦${app.monthly_revenue.toLocaleString("en-NG")}`
              : "—",
          },
          {
            label: "Structure",
            value: app.funding_type
              ? (FUNDING_LABELS[app.funding_type] ?? app.funding_type)
              : "—",
          },
          {
            label: "Documents",
            value: totalDocs === 0 ? "None uploaded" : `${totalDocs} file${totalDocs !== 1 ? "s" : ""}`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#fff",
              padding: "16px 20px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--muted)",
                margin: "0 0 6px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: "var(--sr)",
                fontSize: 20,
                fontWeight: 500,
                color: "var(--ink)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Body — two columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Documents */}
          <Card>
            <CardLabel>
              Documents{totalDocs > 0 ? ` · ${totalDocs} file${totalDocs !== 1 ? "s" : ""}` : ""}
            </CardLabel>

            {docsWithUrls.length === 0 ? (
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 15,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                No documents uploaded yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {docGroups.map((group) => (
                  <div key={group.key}>
                    <p
                      style={{
                        fontFamily: "var(--in)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--muted)",
                        margin: "0 0 10px",
                        paddingBottom: 6,
                        borderBottom: "1px solid var(--hairline)",
                      }}
                    >
                      {group.label} ({group.docs.length})
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {group.docs.map((doc) => (
                        <div
                          key={doc.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 14,
                            padding: "10px 14px",
                            backgroundColor: "rgba(17,17,17,0.02)",
                            border: "1px solid var(--hairline)",
                          }}
                        >
                          {/* Image thumbnail */}
                          {doc.isImage && doc.signedUrl && (
                            <a
                              href={doc.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ flexShrink: 0 }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={doc.signedUrl}
                                alt={doc.name}
                                style={{
                                  width: 64,
                                  height: 64,
                                  objectFit: "cover",
                                  display: "block",
                                  border: "1px solid var(--hairline)",
                                }}
                              />
                            </a>
                          )}

                          {/* File icon for non-images */}
                          {!doc.isImage && (
                            <div
                              style={{
                                flexShrink: 0,
                                width: 40,
                                height: 40,
                                backgroundColor: "rgba(17,17,17,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--in)",
                                  fontSize: 10,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                  color: "var(--muted)",
                                }}
                              >
                                {doc.name.split(".").pop()?.toUpperCase() ?? "FILE"}
                              </span>
                            </div>
                          )}

                          {/* Name + date + link */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontFamily: "var(--in)",
                                fontSize: 14,
                                color: "var(--ink)",
                                margin: "0 0 2px",
                                wordBreak: "break-all",
                              }}
                            >
                              {doc.name}
                            </p>
                            <p
                              style={{
                                fontFamily: "var(--in)",
                                fontSize: 12,
                                color: "var(--muted)",
                                margin: 0,
                              }}
                            >
                              Uploaded {fmtDateShort(doc.uploaded_at)}
                            </p>
                          </div>

                          {/* View link */}
                          {doc.signedUrl ? (
                            <a
                              href={doc.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontFamily: "var(--in)",
                                fontSize: 13,
                                letterSpacing: "0.04em",
                                padding: "6px 14px",
                                backgroundColor: "var(--crimson)",
                                color: "var(--cream)",
                                textDecoration: "none",
                                flexShrink: 0,
                                alignSelf: "center",
                              }}
                            >
                              View
                            </a>
                          ) : (
                            <span
                              style={{
                                fontFamily: "var(--in)",
                                fontSize: 13,
                                color: "var(--muted)",
                                flexShrink: 0,
                                alignSelf: "center",
                              }}
                            >
                              Unavailable
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Business description — bounded so it can't dominate the page */}
          <Card>
            <CardLabel>Business description</CardLabel>
            <div
              style={{
                maxHeight: 220,
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 15,
                  color: "var(--ink)",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {app.business_description}
              </p>
            </div>
          </Card>

          {/* Business info */}
          <Card>
            <CardLabel>Business & contact</CardLabel>
            <div style={{ borderTop: "1px solid var(--hairline)" }}>
              <InfoRow label="Business name" value={app.business_name} />
              <InfoRow label="Founder" value={app.founder_name} />
              <InfoRow label="Email" value={app.contact_email} />
              <InfoRow label="Phone" value={app.contact_phone ?? "—"} />
            </div>
          </Card>

          {/* Documents-requested notice */}
          {app.status === "needs_documents" && app.documents_requested_note && (
            <div
              style={{
                border: "1px solid rgba(122,74,0,0.25)",
                backgroundColor: "rgba(122,74,0,0.05)",
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#7A4A00",
                  margin: "0 0 8px",
                }}
              >
                Documents requested — note sent to applicant
              </p>
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 15,
                  color: "var(--ink)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {app.documents_requested_note}
              </p>
            </div>
          )}

          {/* Rejection reason */}
          {app.status === "rejected" && app.rejection_reason && (
            <div
              style={{
                border: "1px solid rgba(109,22,38,0.25)",
                backgroundColor: "rgba(109,22,38,0.04)",
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--maroon)",
                  margin: "0 0 8px",
                }}
              >
                Rejection reason
              </p>
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 15,
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

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Actions */}
          <Card>
            <CardLabel>Actions</CardLabel>
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
                  | "needs_documents"
              }
              isBlacklisted={profile?.is_blacklisted ?? false}
              actorRole={actorRole}
              linkedDealId={linkedDealId}
            />
          </Card>

          {/* Applicant */}
          <Card>
            <CardLabel>Applicant</CardLabel>
            <p
              style={{
                fontFamily: "var(--sr)",
                fontSize: 16,
                fontWeight: 400,
                color: "var(--ink)",
                margin: "0 0 4px",
              }}
            >
              {profile?.full_name ?? app.founder_name}
            </p>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--muted)",
                margin: "0 0 2px",
              }}
            >
              {app.contact_email}
            </p>
            {app.contact_phone && (
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 14,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                {app.contact_phone}
              </p>
            )}
            {profile?.is_blacklisted && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  backgroundColor: "rgba(109,22,38,0.06)",
                  border: "1px solid rgba(109,22,38,0.2)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    color: "var(--maroon)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Blacklisted
                  {profile.blacklist_reason ? `: ${profile.blacklist_reason}` : ""}
                </p>
              </div>
            )}
          </Card>

          {/* Internal notes */}
          <Card>
            <AdminNotesForm
              applicationId={id}
              initialNotes={app.admin_notes ?? null}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
