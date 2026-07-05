import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type InterestedDeal = {
  id: string;
  business_name: string;
  industry: string | null;
  funding_required: number | null;
  summary_public: string;
};

function fmt(n: number | null) {
  if (!n) return null;
  return `₦${n.toLocaleString("en-NG")}`;
}

export default async function InvestorDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Guards — middleware is primary; these catch edge cases
  if (profile?.role === "admin" || profile?.role === "super_admin") {
    redirect("/admin");
  }
  if (profile?.role !== "investor") {
    redirect("/dashboard");
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  // Expressed interest notifications — each message stores the deal ID
  const { data: interestNotifs } = await supabase
    .from("notifications")
    .select("message")
    .eq("user_id", user.id)
    .eq("type", "investor_interest")
    .order("created_at", { ascending: false });

  let interestedDeals: InterestedDeal[] = [];
  if (interestNotifs && interestNotifs.length > 0) {
    const dealIds = interestNotifs.map((n) => n.message).filter(Boolean);
    const { data: deals } = await supabase
      .from("deals")
      .select("id, business_name, industry, funding_required, summary_public")
      .in("id", dealIds)
      .eq("is_active", true);
    interestedDeals = (deals as InterestedDeal[]) ?? [];
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--cream)",
        color: "var(--ink)",
        fontFamily: "var(--in)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px" }}>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: "0 0 16px",
          }}
        >
          Investment activity
        </p>
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "var(--ink)",
            margin: "0 0 48px",
          }}
        >
          Good to see you, {firstName}.
        </h1>

        {/* Browse CTA */}
        <div
          style={{
            border: "1px solid var(--hairline)",
            padding: "28px",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--muted)",
                margin: "0 0 8px",
              }}
            >
              Investment opportunities
            </p>
            <p
              style={{
                fontFamily: "var(--sr)",
                fontSize: 20,
                fontWeight: 300,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Browse open deals
            </p>
          </div>
          <Link
            href="/opportunities"
            style={{
              display: "inline-block",
              fontFamily: "var(--in)",
              fontSize: 14,
              letterSpacing: "0.04em",
              padding: "10px 22px",
              backgroundColor: "var(--crimson)",
              color: "var(--cream)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Browse opportunities →
          </Link>
        </div>

        {/* Expressed interests */}
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: "0 0 16px",
          }}
        >
          Your expressed interests
          {interestedDeals.length > 0 && (
            <span
              style={{
                marginLeft: 8,
                fontFamily: "var(--in)",
                fontSize: 13,
                color: "var(--ink)",
              }}
            >
              ({interestedDeals.length})
            </span>
          )}
        </p>

        {interestedDeals.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--hairline)",
              padding: "40px 28px",
              backgroundColor: "rgba(17,17,17,0.03)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sr)",
                fontSize: 18,
                fontWeight: 300,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              No interests yet
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
              Browse open opportunities and express interest in businesses you
              want to support.
            </p>
            <Link
              href="/opportunities"
              style={{
                display: "inline-block",
                fontFamily: "var(--in)",
                fontSize: 14,
                letterSpacing: "0.04em",
                padding: "10px 22px",
                backgroundColor: "var(--crimson)",
                color: "var(--cream)",
                textDecoration: "none",
              }}
            >
              Browse opportunities →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "var(--hairline)",
            }}
          >
            {interestedDeals.map((deal) => (
              <div
                key={deal.id}
                style={{
                  backgroundColor: "var(--cream)",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--sr)",
                        fontSize: 17,
                        fontWeight: 300,
                        color: "var(--ink)",
                        margin: 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {deal.business_name}
                    </p>
                    {deal.industry && (
                      <span
                        style={{
                          fontFamily: "var(--in)",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--muted)",
                          border: "1px solid var(--hairline)",
                          padding: "2px 6px",
                          flexShrink: 0,
                        }}
                      >
                        {deal.industry}
                      </span>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--in)",
                        fontSize: 15,
                        color: "var(--muted)",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {deal.summary_public}
                    </p>
                    {deal.funding_required && (
                      <span
                        style={{
                          fontFamily: "var(--in)",
                          fontSize: 14,
                          color: "var(--ink)",
                          flexShrink: 0,
                        }}
                      >
                        {fmt(deal.funding_required)}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/opportunities/${deal.id}`}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 14,
                    letterSpacing: "0.04em",
                    color: "var(--crimson)",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
