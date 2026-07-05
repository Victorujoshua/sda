import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
};

type BadgeStyle = { bg: string; color: string };

const STATUS_BADGE: Record<string, BadgeStyle> = {
  draft:        { bg: "rgba(17,17,17,0.06)", color: "rgba(17,17,17,0.65)" },
  pending:      { bg: "rgba(17,17,17,0.06)", color: "rgba(17,17,17,0.65)" },
  under_review: { bg: "rgba(17,17,17,0.08)", color: "var(--ink)" },
  approved:     { bg: "rgba(17,17,17,0.06)", color: "var(--ink)" },
  rejected:     { bg: "rgba(178,35,41,0.08)", color: "var(--maroon)" },
};

const FUNDING_LABEL: Record<string, string> = {
  equity: "Equity",
  debt: "Debt",
  asset: "Asset",
  revenue_based: "Rev. share",
};

function fmt(n: number | null) {
  if (!n) return "—";
  return `₦${n.toLocaleString("en-NG")}`;
}

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    funding_type?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const db = createAdminClient();

  let query = db
    .from("applications")
    .select(
      "id, business_name, founder_name, contact_email, funding_amount, funding_type, status, submitted_at, created_at, user_id"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.status) query = query.eq("status", params.status as never);
  if (params.funding_type) query = query.eq("funding_type", params.funding_type as never);
  if (params.search) {
    const s = params.search.trim();
    query = query.or(
      `business_name.ilike.%${s}%,founder_name.ilike.%${s}%,contact_email.ilike.%${s}%`
    );
  }

  const { data: applications } = await query;

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--hairline)",
    padding: "8px 12px",
    fontFamily: "var(--in)",
    fontSize: 15,
    color: "var(--ink)",
    backgroundColor: "var(--cream)",
    outline: "none",
    width: 200,
  };

  return (
    <div style={{ padding: "48px 40px" }}>
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
          margin: "0 0 32px",
        }}
      >
        Applications
      </h1>

      {/* Filters */}
      <form
        method="get"
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 32,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Search
          </label>
          <input
            name="search"
            type="text"
            defaultValue={params.search ?? ""}
            placeholder="Name, founder, email…"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Status
          </label>
          <select
            name="status"
            defaultValue={params.status ?? ""}
            style={{ ...inputStyle, width: 160 }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Funding type
          </label>
          <select
            name="funding_type"
            defaultValue={params.funding_type ?? ""}
            style={{ ...inputStyle, width: 160 }}
          >
            <option value="">All types</option>
            <option value="equity">Equity</option>
            <option value="debt">Debt</option>
            <option value="asset">Asset</option>
            <option value="revenue_based">Revenue share</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "9px 20px",
            backgroundColor: "var(--crimson)",
            color: "var(--cream)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Filter
        </button>

        {(params.status || params.funding_type || params.search) && (
          <Link
            href="/admin/applications"
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              color: "var(--muted)",
              textDecoration: "none",
              padding: "9px 0",
            }}
          >
            Clear
          </Link>
        )}
      </form>

      {/* Count */}
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          margin: "0 0 16px",
        }}
      >
        {applications?.length ?? 0} application
        {applications?.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      {!applications?.length ? (
        <div
          style={{
            border: "1px solid var(--hairline)",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 17,
              color: "var(--muted)",
              margin: 0,
            }}
          >
            No applications found.
          </p>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--in)",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
              {[
                "Business",
                "Founder",
                "Funding ask",
                "Type",
                "Status",
                "Submitted",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontFamily: "var(--sr)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--ink)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                style={{ borderBottom: "1px solid var(--hairline)" }}
              >
                <td style={{ padding: "12px 12px" }}>
                  <Link
                    href={`/admin/applications/${app.id}`}
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: 16,
                      color: "var(--ink)",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {app.business_name}
                  </Link>
                  <p
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: 14,
                      color: "var(--muted)",
                      margin: "2px 0 0",
                    }}
                  >
                    {app.contact_email}
                  </p>
                </td>
                <td
                  style={{ padding: "12px 12px", color: "var(--ink)" }}
                >
                  {app.founder_name}
                </td>
                <td
                  style={{ padding: "12px 12px", color: "var(--ink)" }}
                >
                  {fmt(app.funding_amount)}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--muted)",
                    textTransform: "capitalize",
                  }}
                >
                  {app.funding_type
                    ? FUNDING_LABEL[app.funding_type] ?? app.funding_type
                    : "—"}
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {(() => {
                    const badge = STATUS_BADGE[app.status] ?? STATUS_BADGE.draft;
                    return (
                      <span
                        style={{
                          display: "inline-block",
                          fontFamily: "var(--sr)",
                          fontSize: 11,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          padding: "4px 10px",
                          borderRadius: "100px",
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {STATUS_LABEL[app.status] ?? app.status}
                      </span>
                    );
                  })()}
                </td>
                <td
                  style={{
                    padding: "12px 12px",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmtDate(app.submitted_at ?? app.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
