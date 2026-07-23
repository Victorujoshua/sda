"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setApplicationUnderReview,
  approveApplication,
  rejectApplication,
  requestDocuments,
  blacklistUser,
  unblacklistUser,
  softDeleteApplication,
} from "@/app/actions/admin";

type Status = "draft" | "pending" | "under_review" | "approved" | "rejected" | "needs_documents";

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
  linkedDealId,
}: {
  applicationId: string;
  userId: string;
  currentStatus: Status;
  isBlacklisted: boolean;
  actorRole: string;
  linkedDealId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [showRequestDocs, setShowRequestDocs] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [docsNote, setDocsNote] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const isFinal = currentStatus === "approved" || currentStatus === "rejected";
  const isSuperAdmin = actorRole === "super_admin";
  // "Request documents" available when there is something to review but not already in that state
  const canRequestDocs = !isFinal && currentStatus !== "draft" && currentStatus !== "needs_documents";

  function closeAllForms() {
    setShowReject(false);
    setShowRequestDocs(false);
    setShowBlacklist(false);
    setShowDelete(false);
  }

  async function run(
    fn: () => Promise<{ error?: string }>,
    successMsg: string,
    redirectTo?: string
  ) {
    setError(null);
    setToast(null);
    startTransition(async () => {
      try {
        const result = await fn();
        if (result.error) {
          setError(result.error);
        } else {
          closeAllForms();
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            setToast(successMsg);
            router.refresh();
            setTimeout(() => setToast(null), 5000);
          }
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
      {/* Success toast — fixed position so it's visible regardless of scroll */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            maxWidth: 400,
            width: "calc(100vw - 48px)",
            backgroundColor: "var(--cream)",
            border: "1px solid var(--hairline)",
            borderLeft: "3px solid #16a34a",
            padding: "14px 44px 14px 18px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {toast}
          </p>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "rgba(17,17,17,0.35)",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

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
          {currentStatus !== "under_review" && currentStatus !== "needs_documents" && (
            <button
              onClick={() => run(() => setApplicationUnderReview(applicationId), "Application marked as under review.")}
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

          {currentStatus === "needs_documents" && (
            <button
              onClick={() => run(() => setApplicationUnderReview(applicationId), "Application marked as under review.")}
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
              onClick={() => run(() => approveApplication(applicationId), "Application approved for funding. The applicant has been notified.")}
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
              closeAllForms();
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

          {canRequestDocs && (
            <button
              onClick={() => {
                closeAllForms();
                setShowRequestDocs((v) => !v);
              }}
              disabled={isPending}
              style={{
                ...btnBase,
                backgroundColor: "var(--cream)",
                color: "var(--ink)",
              }}
            >
              Request documents
            </button>
          )}
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
                run(() => rejectApplication(applicationId, rejectionReason), "Application rejected. The applicant has been notified.")
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

      {/* Request documents form */}
      {showRequestDocs && (
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
            What documents are needed? (required — visible to applicant)
          </label>
          <textarea
            value={docsNote}
            onChange={(e) => setDocsNote(e.target.value)}
            rows={4}
            placeholder="e.g. Please upload your last 6 months of bank statements and a signed director's ID…"
            style={textareaStyle}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={() =>
                run(() => requestDocuments(applicationId, docsNote), "Document request sent. The applicant has been notified by email.")
              }
              disabled={isPending || !docsNote.trim()}
              style={{
                ...btnBase,
                backgroundColor: "var(--ink)",
                color: "var(--cream)",
                border: "none",
                opacity: !docsNote.trim() ? 0.5 : 1,
              }}
            >
              {isPending ? "Sending…" : "Send request"}
            </button>
            <button
              onClick={() => setShowRequestDocs(false)}
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

        {isSuperAdmin && (
          <button
            onClick={() => {
              closeAllForms();
              setShowDelete((v) => !v);
            }}
            disabled={isPending}
            style={{
              ...btnBase,
              backgroundColor: "var(--cream)",
              color: "var(--maroon)",
              border: "1px solid var(--maroon)",
              marginBottom: 20,
            }}
          >
            Delete application
          </button>
        )}

        {showDelete && (
          <div
            style={{
              border: "1px solid rgba(109,22,38,0.3)",
              backgroundColor: "rgba(109,22,38,0.04)",
              padding: "20px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 15,
                color: "var(--ink)",
                margin: "0 0 10px",
                lineHeight: 1.6,
              }}
            >
              This hides the application from all views immediately. The record
              remains in the database and can be recovered via SQL.
            </p>
            {linkedDealId && (
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 14,
                  color: "var(--maroon)",
                  margin: "0 0 14px",
                  lineHeight: 1.5,
                }}
              >
                Warning: this application has an active deal. Deleting it will
                not remove the deal — it will remain live and visible to investors.
              </p>
            )}
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
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={3}
              placeholder="Reason for deleting this application…"
              style={textareaStyle}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() =>
                  run(
                    () => softDeleteApplication(applicationId, deleteReason),
                    "Application deleted.",
                    "/admin/applications"
                  )
                }
                disabled={isPending || !deleteReason.trim()}
                style={{
                  ...btnBase,
                  backgroundColor: "var(--maroon)",
                  color: "var(--cream)",
                  border: "none",
                  opacity: !deleteReason.trim() ? 0.5 : 1,
                }}
              >
                {isPending ? "Deleting…" : "Confirm deletion"}
              </button>
              <button
                onClick={() => setShowDelete(false)}
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
              onClick={() => run(() => unblacklistUser(userId), "Blacklist removed. The applicant can now submit applications.")}
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
                closeAllForms();
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
                      run(() => blacklistUser(userId, blacklistReason), "Applicant has been blacklisted.")
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
