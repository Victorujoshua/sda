"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDeal, deactivateDeal } from "@/app/actions/admin";

type Deal = {
  id: string;
  business_name: string;
  summary_public: string;
  details_gated: string | null;
  industry: string | null;
  revenue_to_date: number | null;
  funding_required: number | null;
  is_active: boolean;
  created_at: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  padding: "8px 12px",
  fontFamily: "var(--in)",
  fontSize: 14,
  color: "var(--ink)",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

function DealRow({ deal }: { deal: Deal }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [summaryPublic, setSummaryPublic] = useState(deal.summary_public);
  const [detailsGated, setDetailsGated] = useState(deal.details_gated ?? "");
  const [industry, setIndustry] = useState(deal.industry ?? "");
  const [fundingRequired, setFundingRequired] = useState(
    deal.funding_required != null ? String(deal.funding_required) : ""
  );
  const [revenueToDate, setRevenueToDate] = useState(
    deal.revenue_to_date != null ? String(deal.revenue_to_date) : ""
  );

  function run(fn: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await fn();
        if (result.error) {
          setError(result.error);
        } else {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
          router.refresh();
        }
      } catch {
        setError("An unexpected error occurred.");
      }
    });
  }

  function handleSave() {
    run(() =>
      updateDeal(deal.id, {
        summary_public: summaryPublic,
        details_gated: detailsGated.trim() || null,
        industry: industry.trim() || null,
        funding_required: fundingRequired
          ? parseFloat(fundingRequired) || null
          : null,
        revenue_to_date: revenueToDate
          ? parseFloat(revenueToDate) || null
          : null,
      })
    );
  }

  function handleDeactivate() {
    run(() => deactivateDeal(deal.id));
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        marginBottom: 12,
      }}
    >
      {/* Row header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          cursor: "pointer",
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--ink)",
                fontWeight: 500,
              }}
            >
              {deal.business_name}
            </span>
            <span
              style={{
                fontFamily: "var(--in)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: deal.is_active ? "var(--success)" : "var(--muted)",
              }}
            >
              {deal.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          {deal.industry && (
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
                color: "var(--muted)",
                margin: "4px 0 0",
              }}
            >
              {deal.industry}
            </p>
          )}
        </div>
        <span
          style={{
            fontFamily: "var(--in)",
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "24px 20px",
          }}
        >
          {error && (
            <div
              style={{
                border: "1px solid var(--danger)",
                padding: "10px 14px",
                marginBottom: 20,
                fontFamily: "var(--in)",
                fontSize: 13,
                color: "var(--danger)",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
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
              Public summary
            </label>
            <textarea
              value={summaryPublic}
              onChange={(e) => setSummaryPublic(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
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
              Gated details (logged-in investors only)
            </label>
            <textarea
              value={detailsGated}
              onChange={(e) => setDetailsGated(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 24,
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
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={inputStyle}
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
                Funding required (₦)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={fundingRequired}
                onChange={(e) => setFundingRequired(e.target.value)}
                style={inputStyle}
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
                Revenue to date (₦)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={revenueToDate}
                onChange={(e) => setRevenueToDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={handleSave}
              disabled={isPending}
              style={{
                fontFamily: "var(--in)",
                fontSize: 12,
                letterSpacing: "0.04em",
                padding: "9px 20px",
                backgroundColor: "var(--ink)",
                color: "#FAFAF8",
                border: "none",
                cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>

            {saved && (
              <span
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  color: "var(--success)",
                }}
              >
                Saved
              </span>
            )}

            {deal.is_active && (
              <button
                onClick={handleDeactivate}
                disabled={isPending}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  padding: "9px 20px",
                  backgroundColor: "transparent",
                  color: "var(--danger)",
                  border: "1px solid var(--border)",
                  cursor: isPending ? "not-allowed" : "pointer",
                  marginLeft: "auto",
                }}
              >
                Deactivate deal
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DealsManager({ deals }: { deals: Deal[] }) {
  return (
    <div>
      {deals.length === 0 ? (
        <div
          style={{
            border: "1px solid var(--border)",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "var(--muted)",
              margin: 0,
            }}
          >
            No deals yet. Approve an application and promote it.
          </p>
        </div>
      ) : (
        deals.map((d) => <DealRow key={d.id} deal={d} />)
      )}
    </div>
  );
}
