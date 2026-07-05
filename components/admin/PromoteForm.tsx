"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { promoteToDeals } from "@/app/actions/admin";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--hairline)",
  padding: "10px 14px",
  fontFamily: "var(--in)",
  fontSize: 16,
  color: "var(--ink)",
  backgroundColor: "var(--cream)",
  outline: "none",
  boxSizing: "border-box",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--muted)",
  marginBottom: 8,
};

export default function PromoteForm({
  applicationId,
  businessName,
  prefill,
}: {
  applicationId: string;
  businessName: string;
  prefill: {
    funding_amount: number | null;
    business_description: string | null;
    funding_type: string | null;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [summaryPublic, setSummaryPublic] = useState(
    prefill.business_description?.slice(0, 500) ?? ""
  );
  const [detailsGated, setDetailsGated] = useState("");
  const [industry, setIndustry] = useState("");
  const [fundingRequired, setFundingRequired] = useState(
    prefill.funding_amount ? String(prefill.funding_amount) : ""
  );
  const [revenueToDate, setRevenueToDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!summaryPublic.trim()) {
      setError("Public summary is required.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await promoteToDeals(applicationId, businessName, {
          summary_public: summaryPublic,
          details_gated: detailsGated.trim() || null,
          industry: industry.trim() || null,
          funding_required: fundingRequired
            ? parseFloat(fundingRequired) || null
            : null,
          revenue_to_date: revenueToDate
            ? parseFloat(revenueToDate) || null
            : null,
          is_active: isActive,
        });

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/deals");
        }
      } catch {
        setError("An unexpected error occurred.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
      {error && (
        <div
          style={{
            border: "1px solid rgba(178,35,41,0.3)",
            backgroundColor: "rgba(178,35,41,0.06)",
            padding: "12px 16px",
            marginBottom: 28,
            fontFamily: "var(--in)",
            fontSize: 16,
            color: "var(--maroon)",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>
          Public summary <span style={{ color: "var(--maroon)" }}>*</span>
        </label>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            color: "var(--muted)",
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}
        >
          Visible to all visitors on the opportunities page. No confidential
          information.
        </p>
        <textarea
          value={summaryPublic}
          onChange={(e) => setSummaryPublic(e.target.value)}
          rows={5}
          required
          placeholder="A short public-facing description of this opportunity…"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Gated details (logged-in investors only)</label>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            color: "var(--muted)",
            margin: "0 0 8px",
            lineHeight: 1.5,
          }}
        >
          Full business case, financials, founder details. Only visible after
          login. Leave blank to use the public summary only.
        </p>
        <textarea
          value={detailsGated}
          onChange={(e) => setDetailsGated(e.target.value)}
          rows={6}
          placeholder="Full details for registered investors…"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div>
          <label style={labelStyle}>Industry / sector</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Fintech, Agritech…"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Funding required (₦)</label>
          <input
            type="number"
            min={0}
            step="any"
            value={fundingRequired}
            onChange={(e) => setFundingRequired(e.target.value)}
            placeholder="Amount in naira"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Revenue to date (₦)</label>
        <input
          type="number"
          min={0}
          step="any"
          value={revenueToDate}
          onChange={(e) => setRevenueToDate(e.target.value)}
          placeholder="Total revenue earned so far"
          style={{ ...inputStyle, maxWidth: 320 }}
        />
      </div>

      <div style={{ marginBottom: 40 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 16,
              color: "var(--ink)",
            }}
          >
            Publish deal immediately (visible on /opportunities)
          </span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "11px 28px",
            backgroundColor: "var(--crimson)",
            color: "var(--cream)",
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Creating deal…" : "Create deal"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "11px 20px",
            backgroundColor: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--hairline)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
