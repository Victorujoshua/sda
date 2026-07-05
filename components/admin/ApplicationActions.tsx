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
  fontSize: 14,
  letterSpacing: "0.04em",
  padding: "9px 20px",
  border: "1px solid var(--hairline)",
  cursor: "pointer",
};

export default function ApplicationActions({
  applicationId,
  userId,
  currentStatus,
  isBlacklisted,
  actorRole,
}: {
  applicationId: string;
  userId: string;
  currentStatus: Status;
  isBlacklisted: boolean;
  actorRole: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isFinal = currentStatus === "approved" || currentStatus === "rejected";
  const isSuperAdmin = actorRole === "super_admin";

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
    border: "1px solid var(--hairline)",
    padding: "10px 14px",
    fontFamily: "var(--in)",
    fontSize: 16,
    color: "var(--ink)",
    backgroundColor: "var(--cream)",
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
            border: "1px solid rgba(178,35,41,0.3)",
            backgroundColor: "rgba(178,35,41,0.06)",
            padding: "10px 14px",
            marginBottom: 16,
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--maroon)",
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
                backgroundColor: "rgba(17,17,17,0.04)",
                color: "var(--ink)",
              }}
            >
              Mark under review
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => run(() => approveApplication(applicationId))}
              disabled={isPending}
              style={{
                ...btnBase,
                backgroundColor: "var(--crimson)",
                color: "var(--cream)",
                border: "none",
              }}
            >
              Approve for funding
            </button>
          )}

          <button
            onClick={() => {
              setShowBlacklist(false);
              setShowReject((v) => !v);
            }}
            disabled={isPending}
            style={{
              ...btnBase,
              backgroundColor: "var(--cream)",
              color: "var(--maroon)",
              border: "1px solid var(--maroon)",
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
            border: "1px solid var(--hairline)",
            padding: "20px",
            marginBottom: 16,
          }}
        >
          <label
            style={{
              fontFamily: "var(--in)",
              fontSize: 13,
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
                backgroundColor: "var(--maroon)",
                color: "var(--cream)",
                border: "none",
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
          borderTop: "1px solid var(--hairline)",
          paddingTop: 20,
          marginTop: 8,
        }}
      >
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
          Applicant account
        </p>

        {isBlacklisted ? (
          <div>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--maroon)",
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
                backgroundColor: "rgba(17,17,17,0.04)",
                color: "var(--ink)",
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
                backgroundColor: "var(--cream)",
                color: "var(--maroon)",
                border: "1px solid var(--maroon)",
              }}
            >
              Blacklist applicant
            </button>

            {showBlacklist && (
              <div
                style={{
                  border: "1px solid var(--hairline)",
                  padding: "20px",
                  marginTop: 14,
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
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
                      backgroundColor: "var(--maroon)",
                      color: "var(--cream)",
                      border: "none",
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
