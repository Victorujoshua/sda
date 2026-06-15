import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function fmt(n: number | null) {
  if (!n) return null;
  return `₦${n.toLocaleString("en-NG")}`;
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    industry?: string;
    min?: string;
    max?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Never select details_gated on the public list
  let query = supabase
    .from("deals")
    .select(
      "id, business_name, industry, revenue_to_date, funding_required, summary_public, created_at"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (params.industry) query = query.eq("industry", params.industry);
  if (params.min) query = query.gte("funding_required", parseFloat(params.min));
  if (params.max) query = query.lte("funding_required", parseFloat(params.max));

  const { data: deals } = await query;

  // Collect distinct industries for filter dropdown
  const { data: allDeals } = await supabase
    .from("deals")
    .select("industry")
    .eq("is_active", true);
  const industries = [
    ...new Set(
      (allDeals ?? []).map((d) => d.industry).filter(Boolean) as string[]
    ),
  ].sort();

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--border)",
    padding: "8px 12px",
    fontFamily: "var(--in)",
    fontSize: 13,
    color: "var(--ink)",
    backgroundColor: "#fff",
    outline: "none",
  };

  const hasFilters = params.industry || params.min || params.max;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "72px 40px" }}>
        {/* Header */}
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
          SDA · Investment opportunities
        </p>
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 42,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: "0 0 16px",
          }}
        >
          Open deals
        </h1>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--muted)",
            lineHeight: 1.7,
            margin: "0 0 48px",
            maxWidth: 520,
          }}
        >
          Businesses currently seeking capital from the SDA network. Sign in to
          view full details and express interest.
        </p>

        {/* Filters */}
        <form
          method="get"
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                marginBottom: 6,
              }}
            >
              Industry
            </label>
            <select
              name="industry"
              defaultValue={params.industry ?? ""}
              style={{ ...inputStyle, width: 180 }}
            >
              <option value="">All industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                marginBottom: 6,
              }}
            >
              Min ask (₦)
            </label>
            <input
              type="number"
              name="min"
              min={0}
              step="any"
              defaultValue={params.min ?? ""}
              placeholder="0"
              style={{ ...inputStyle, width: 120 }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                marginBottom: 6,
              }}
            >
              Max ask (₦)
            </label>
            <input
              type="number"
              name="max"
              min={0}
              step="any"
              defaultValue={params.max ?? ""}
              placeholder="5,000,000"
              style={{ ...inputStyle, width: 120 }}
            />
          </div>

          <button
            type="submit"
            style={{
              fontFamily: "var(--in)",
              fontSize: 12,
              letterSpacing: "0.04em",
              padding: "9px 20px",
              backgroundColor: "var(--accent)",
              color: "#FAFAF8",
              border: "none",
              cursor: "pointer",
            }}
          >
            Filter
          </button>

          {hasFilters && (
            <Link
              href="/opportunities"
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
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
            fontSize: 13,
            color: "var(--muted)",
            margin: "0 0 24px",
          }}
        >
          {deals?.length ?? 0} opportunit{deals?.length !== 1 ? "ies" : "y"}
        </p>

        {/* Empty state */}
        {!deals?.length ? (
          <div
            style={{
              border: "1px solid var(--border)",
              padding: "64px 40px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sr)",
                fontSize: 22,
                fontWeight: 300,
                color: "var(--ink)",
                margin: "0 0 12px",
              }}
            >
              No deals match your filters
            </p>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--muted)",
                margin: 0,
              }}
            >
              {hasFilters
                ? "Try removing some filters to see more opportunities."
                : "New deals are added regularly. Check back soon."}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 1,
              backgroundColor: "var(--border)",
            }}
          >
            {deals.map((deal) => (
              <div
                key={deal.id}
                style={{
                  backgroundColor: "var(--paper)",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Industry tag */}
                {deal.industry && (
                  <span
                    style={{
                      fontFamily: "var(--in)",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      padding: "3px 8px",
                      display: "inline-block",
                      marginBottom: 16,
                      alignSelf: "flex-start",
                    }}
                  >
                    {deal.industry}
                  </span>
                )}

                {/* Business name */}
                <p
                  style={{
                    fontFamily: "var(--sr)",
                    fontSize: 20,
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                    color: "var(--ink)",
                    margin: "0 0 12px",
                    lineHeight: 1.2,
                  }}
                >
                  {deal.business_name}
                </p>

                {/* Summary */}
                <p
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    color: "var(--muted)",
                    lineHeight: 1.7,
                    margin: "0 0 20px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {deal.summary_public}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    marginBottom: 24,
                    flexWrap: "wrap",
                  }}
                >
                  {deal.funding_required && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--in)",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--muted)",
                          margin: "0 0 3px",
                        }}
                      >
                        Seeking
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--sr)",
                          fontSize: 16,
                          fontWeight: 300,
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        {fmt(deal.funding_required)}
                      </p>
                    </div>
                  )}
                  {deal.revenue_to_date && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--in)",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--muted)",
                          margin: "0 0 3px",
                        }}
                      >
                        Revenue to date
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--sr)",
                          fontSize: 16,
                          fontWeight: 300,
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        {fmt(deal.revenue_to_date)}
                      </p>
                    </div>
                  )}

                </div>

                {/* CTA */}
                <Link
                  href={`/opportunities/${deal.id}`}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--in)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    padding: "10px 20px",
                    backgroundColor: "var(--ink)",
                    color: "#FAFAF8",
                    textDecoration: "none",
                    alignSelf: "flex-start",
                  }}
                >
                  View details →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Login nudge at bottom */}
        <div
          style={{
            marginTop: 56,
            borderTop: "1px solid var(--border)",
            paddingTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              color: "var(--muted)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Full deal details and investment terms are available to registered
            investors.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/login"
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
                letterSpacing: "0.04em",
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "var(--ink)",
                textDecoration: "none",
                border: "1px solid var(--border)",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/signup/investor"
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
                letterSpacing: "0.04em",
                padding: "10px 20px",
                backgroundColor: "var(--accent)",
                color: "#FAFAF8",
                textDecoration: "none",
              }}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
