"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setApplicationUnderReview,
  approveApplication,
  rejectApplication,
  blacklistUser,
  unblacklistUser,
} from "@/app/actions/admin";

type Status = "draft" | "pending" | "under_review" | "approved" | "rejected";

const btnBase: React.CSSProperties = {
  fontFamily: "var(--in)",
  fontSize: 12,
  letterSpacing: "0.04em",
  padding: "9px 20px",
  border: "none",
  cursor: "pointer",
};

export default function ApplicationActions({
  applicationId,
  userId,
  currentStatus,
  isBlacklisted,
}: {
  applicationId: string;
  userId: string;
  currentStatus: Status;
  isBlacklisted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isFinal = currentStatus === "approved" || currentStatus === "rejected";

  async function run(fn: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await fn();
        if (result.error) {
          setError(result.error);
        } else {
          router.refresh();
        }
      } catch {
        setError("An unexpected error occurred.");
      }
    });
  }

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid var(--border)",
    padding: "10px 14px",
    fontFamily: "var(--in)",
    fontSize: 14,
    color: "var(--ink)",
    backgroundColor: "#fff",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    marginTop: 10,
    lineHeight: 1.6,
  };

  return (
    <div>
      {error && (
        <div
          style={{
            border: "1px solid var(--danger)",
            padding: "10px 14px",
            marginBottom: 16,
            fontFamily: "var(--in)",
            fontSize: 13,
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      )}

      {/* Status actions */}
      {!isFinal && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {currentStatus !== "under_review" && (
            <button
              onClick={() => run(() => setApplicationUnderReview(applicationId))}
              disabled={isPending}
              style={{
                ...btnBase,
                backgroundColor: "var(--surface)",
                color: "var(--ink)",
                border: "1px solid var(--border)",
              }}
            >
              Mark under review
            </button>
          )}

          <button
            onClick={() => run(() => approveApplication(applicationId))}
            disabled={isPending}
            style={{
              ...btnBase,
              backgroundColor: "var(--success)",
              color: "#FAFAF8",
            }}
          >
            Approve
          </button>

          <button
            onClick={() => {
              setShowBlacklist(false);
              setShowReject((v) => !v);
            }}
            disabled={isPending}
            style={{
              ...btnBase,
              backgroundColor: "var(--danger)",
              color: "#FAFAF8",
            }}
          >
            Reject
          </button>
        </div>
      )}

      {/* Reject form */}
      {showReject && (
        <div
          style={{
            border: "1px solid var(--border)",
            padding: "20px",
            marginBottom: 16,
          }}
        >
          <label
            style={{
              fontFamily: "var(--in)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--muted)",
            }}
          >
            Rejection reason (required, visible to applicant)
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            placeholder="Explain why this application cannot proceed…"
            style={textareaStyle}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={() =>
                run(() => rejectApplication(applicationId, rejectionReason))
              }
              disabled={isPending || !rejectionReason.trim()}
              style={{
                ...btnBase,
                backgroundColor: "var(--danger)",
                color: "#FAFAF8",
                opacity: !rejectionReason.trim() ? 0.5 : 1,
              }}
            >
              {isPending ? "Rejecting…" : "Confirm rejection"}
            </button>
            <button
              onClick={() => setShowReject(false)}
              style={{
                ...btnBase,
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--ink)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Blacklist actions */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 20,
          marginTop: 8,
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
          Applicant account
        </p>

        {isBlacklisted ? (
          <div>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 13,
                color: "var(--danger)",
                margin: "0 0 12px",
              }}
            >
              This applicant is currently blacklisted.
            </p>
            <button
              onClick={() => run(() => unblacklistUser(userId))}
              disabled={isPending}
              style={{
                ...btnBase,
                backgroundColor: "var(--surface)",
                color: "var(--ink)",
                border: "1px solid var(--border)",
              }}
            >
              Remove blacklist
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setShowReject(false);
                setShowBlacklist((v) => !v);
              }}
              disabled={isPending}
              style={{
                ...btnBase,
                backgroundColor: "var(--surface)",
                color: "var(--danger)",
                border: "1px solid var(--border)",
              }}
            >
              Blacklist applicant
            </button>

            {showBlacklist && (
              <div
                style={{
                  border: "1px solid var(--border)",
                  padding: "20px",
                  marginTop: 14,
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                  }}
                >
                  Reason (required, internal only)
                </label>
                <textarea
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  rows={3}
                  placeholder="Reason for blacklisting this applicant…"
                  style={textareaStyle}
                />
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button
                    onClick={() =>
                      run(() => blacklistUser(userId, blacklistReason))
                    }
                    disabled={isPending || !blacklistReason.trim()}
                    style={{
                      ...btnBase,
                      backgroundColor: "var(--danger)",
                      color: "#FAFAF8",
                      opacity: !blacklistReason.trim() ? 0.5 : 1,
                    }}
                  >
                    {isPending ? "Saving…" : "Confirm blacklist"}
                  </button>
                  <button
                    onClick={() => setShowBlacklist(false)}
                    style={{
                      ...btnBase,
                      background: "none",
                      border: "1px solid var(--border)",
                      color: "var(--ink)",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
