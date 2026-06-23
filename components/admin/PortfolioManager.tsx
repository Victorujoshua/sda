"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createPortfolioCompany,
  updatePortfolioCompany,
} from "@/app/actions/admin";

type Company = {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_published: boolean;
  detail_page_content: string | null;
  created_at: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  padding: "8px 12px",
  fontFamily: "var(--in)",
  fontSize: 16,
  color: "var(--ink)",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--muted)",
  marginBottom: 6,
};

function CompanyRow({ company }: { company: Company }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(company.name);
  const [description, setDescription] = useState(company.description ?? "");
  const [displayOrder, setDisplayOrder] = useState(String(company.display_order));
  const [isPublished, setIsPublished] = useState(company.is_published);
  const [detailContent, setDetailContent] = useState(
    company.detail_page_content ?? ""
  );

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await updatePortfolioCompany(company.id, {
          name,
          description: description.trim() || null,
          display_order: parseInt(displayOrder) || 0,
          is_published: isPublished,
          detail_page_content: detailContent.trim() || null,
        });
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

  return (
    <div style={{ border: "1px solid var(--border)", marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          cursor: "pointer",
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 17,
              color: "var(--ink)",
              fontWeight: 500,
            }}
          >
            {company.name}
          </span>
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: company.is_published ? "var(--success)" : "var(--muted)",
            }}
          >
            {company.is_published ? "Published" : "Draft"}
          </span>
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              color: "var(--muted)",
            }}
          >
            Order: {company.display_order}
          </span>
        </div>
        <span
          style={{ fontFamily: "var(--in)", fontSize: 14, color: "var(--muted)" }}
        >
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "20px" }}>
          {error && (
            <div
              style={{
                border: "1px solid var(--danger)",
                padding: "10px 14px",
                marginBottom: 20,
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--danger)",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Company name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Display order</label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Short description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Detail page content</label>
            <textarea
              value={detailContent}
              onChange={(e) => setDetailContent(e.target.value)}
              rows={6}
              placeholder="Extended content for the company detail page (optional)"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 16,
                  color: "var(--ink)",
                }}
              >
                Published (visible on /portfolio)
              </span>
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={handleSave}
              disabled={isPending}
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                letterSpacing: "0.04em",
                padding: "9px 20px",
                backgroundColor: "var(--ink)",
                color: "#FAFAF8",
                border: "none",
                cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            {saved && (
              <span
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 15,
                  color: "var(--success)",
                }}
              >
                Saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddCompanyForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isPublished, setIsPublished] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const result = await createPortfolioCompany({
          name,
          description: description.trim() || null,
          display_order: parseInt(displayOrder) || 0,
          is_published: isPublished,
        });
        if (result.error) {
          setError(result.error);
        } else {
          router.refresh();
          onDone();
        }
      } catch {
        setError("An unexpected error occurred.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid var(--accent)",
        padding: "24px",
        marginBottom: 24,
      }}
    >
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 15,
          fontWeight: 500,
          color: "var(--ink)",
          margin: "0 0 20px",
        }}
      >
        Add portfolio company
      </p>

      {error && (
        <div
          style={{
            border: "1px solid var(--danger)",
            padding: "10px 14px",
            marginBottom: 16,
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <label style={labelStyle}>
            Company name <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Order</label>
          <input
            type="number"
            min={0}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Short description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)" }}>
            Publish immediately
          </span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "9px 20px",
            backgroundColor: "var(--accent)",
            color: "#FAFAF8",
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Creating…" : "Create company"}
        </button>
        <button
          type="button"
          onClick={onDone}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "9px 16px",
            backgroundColor: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function PortfolioManager({
  companies,
}: {
  companies: Company[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div>
      {!adding && (
        <button
          onClick={() => setAdding(true)}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "9px 20px",
            backgroundColor: "var(--accent)",
            color: "#FAFAF8",
            border: "none",
            cursor: "pointer",
            marginBottom: 24,
          }}
        >
          + Add company
        </button>
      )}

      {adding && <AddCompanyForm onDone={() => setAdding(false)} />}

      {companies.length === 0 && !adding ? (
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
              fontSize: 17,
              color: "var(--muted)",
              margin: 0,
            }}
          >
            No portfolio companies yet.
          </p>
        </div>
      ) : (
        companies.map((c) => <CompanyRow key={c.id} company={c} />)
      )}
    </div>
  );
}
