import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ExpressInterestButton from "@/components/investor/ExpressInterestButton";

function fmt(n: number | null) {
  if (!n) return "—";
  return `₦${n.toLocaleString("en-NG")}`;
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
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          flexShrink: 0,
          width: 160,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--in)",
          fontSize: 16,
          color: "var(--ink)",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth — two separate queries to ensure details_gated is never sent to unauthenticated users
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { role: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const isInvestor = profile?.role === "investor";

  // Path A — no session or non-investor: NEVER select details_gated
  if (!user || !isInvestor) {
    const { data: deal } = await supabase
      .from("deals")
      .select(
        "id, business_name, industry, revenue_to_date, funding_required, summary_public, created_at"
      )
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (!deal) notFound();

    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "72px 40px" }}>
          <Link
            href="/opportunities"
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "var(--muted)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 32,
            }}
          >
            ← All opportunities
          </Link>

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
              }}
            >
              {deal.industry}
            </span>
          )}

          <h1
            style={{
              fontFamily: "var(--sr)",
              fontSize: 38,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: "0 0 24px",
            }}
          >
            {deal.business_name}
          </h1>

          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 17,
              color: "var(--muted)",
              lineHeight: 1.7,
              margin: "0 0 32px",
            }}
          >
            {deal.summary_public}
          </p>

          <div style={{ borderTop: "1px solid var(--border)", marginBottom: 40 }}>
            {deal.funding_required && (
              <Field label="Seeking" value={fmt(deal.funding_required)} />
            )}
            {deal.revenue_to_date && (
              <Field label="Revenue to date" value={fmt(deal.revenue_to_date)} />
            )}
          </div>

          {/* Login gate */}
          <div
            style={{
              border: "1px solid var(--border)",
              padding: "32px",
              backgroundColor: "var(--surface)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sr)",
                fontSize: 20,
                fontWeight: 300,
                color: "var(--ink)",
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
              }}
            >
              Full details available to registered investors
            </p>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 16,
                color: "var(--muted)",
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}
            >
              Sign in or create an investor account to view the full business
              case, financials, and express interest in this opportunity.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <Link
                href={`/login?redirectTo=/opportunities/${id}`}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  padding: "10px 22px",
                  backgroundColor: "var(--accent)",
                  color: "#FAFAF8",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/signup/investor"
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  padding: "10px 22px",
                  backgroundColor: "transparent",
                  color: "var(--ink)",
                  textDecoration: "none",
                  border: "1px solid var(--border)",
                }}
              >
                Create investor account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Path B — authenticated investor: fetch WITH details_gated
  const { data: deal } = await supabase
    .from("deals")
    .select(
      "id, business_name, industry, revenue_to_date, funding_required, summary_public, details_gated, created_at"
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!deal) notFound();

  // Check if this investor has already expressed interest
  const { data: existingInterest } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", user.id)
    .eq("type", "investor_interest")
    .eq("message", id)
    .maybeSingle();

  const alreadyExpressed = !!existingInterest;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 40px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            gap: 16,
          }}
        >
          <Link
            href="/opportunities"
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            ← All opportunities
          </Link>
          <Link
            href="/dashboard"
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
        </div>

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
            }}
          >
            {deal.industry}
          </span>
        )}

        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "var(--ink)",
            margin: "0 0 32px",
          }}
        >
          {deal.business_name}
        </h1>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginBottom: 40,
            paddingBottom: 32,
            borderBottom: "1px solid var(--border)",
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
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  margin: "0 0 4px",
                }}
              >
                Seeking
              </p>
              <p
                style={{
                  fontFamily: "var(--sr)",
                  fontSize: 24,
                  fontWeight: 300,
                  color: "var(--ink)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", textDecoration: "none" }}>₦</span>{deal.funding_required.toLocaleString("en-NG")}
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
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  margin: "0 0 4px",
                }}
              >
                Revenue to date
              </p>
              <p
                style={{
                  fontFamily: "var(--sr)",
                  fontSize: 24,
                  fontWeight: 300,
                  color: "var(--ink)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", textDecoration: "none" }}>₦</span>{deal.revenue_to_date.toLocaleString("en-NG")}
              </p>
            </div>
          )}

        </div>

        {/* Public summary */}
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--muted)",
            margin: "0 0 12px",
          }}
        >
          Overview
        </p>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 17,
            color: "var(--ink)",
            lineHeight: 1.8,
            margin: "0 0 40px",
          }}
        >
          {deal.summary_public}
        </p>

        {/* Gated details — investor only */}
        {deal.details_gated && (
          <div style={{ marginBottom: 48 }}>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                margin: "0 0 12px",
              }}
            >
              Full details
            </p>
            <div
              style={{
                border: "1px solid var(--border)",
                padding: "28px 32px",
                backgroundColor: "var(--surface)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 17,
                  color: "var(--ink)",
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {deal.details_gated}
              </p>
            </div>
          </div>
        )}

        {/* Express interest */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 40,
          }}
        >
          <p
            style={{
              fontFamily: "var(--sr)",
              fontSize: 22,
              fontWeight: 300,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              margin: "0 0 8px",
            }}
          >
            Interested in this opportunity?
          </p>
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 16,
              color: "var(--muted)",
              lineHeight: 1.7,
              margin: "0 0 24px",
            }}
          >
            Let us know and our team will follow up with next steps. This is not
            a financial commitment.
          </p>
          <ExpressInterestButton
            dealId={deal.id}
            dealName={deal.business_name}
            initialExpressed={alreadyExpressed}
          />
        </div>
      </div>
    </div>
  );
}
