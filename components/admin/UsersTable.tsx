"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  blacklistUser,
  unblacklistUser,
  deactivateUser,
  reactivateUser,
  revokeMembership,
} from "@/app/actions/admin";

type User = {
  id: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  has_paid_membership: boolean;
  created_at: string;
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const pillBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "var(--sr)",
  fontSize: 11,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "4px 10px",
  borderRadius: "100px",
};

function UserRow({ user, actorRole }: { user: User; actorRole: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blacklistReason, setBlacklistReason] = useState("");
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [showRevoke, setShowRevoke] = useState(false);

  function run(fn: () => Promise<{ error?: string }>) {
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

  return (
    <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
      <td style={{ padding: "14px 12px", verticalAlign: "top" }}>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 16,
            color: "var(--ink)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {user.full_name ?? "—"}
        </p>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            color: "var(--muted)",
            margin: "3px 0 0",
          }}
        >
          {user.id.slice(0, 8)}…
        </p>
      </td>

      <td
        style={{
          padding: "14px 12px",
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          textTransform: "capitalize",
          verticalAlign: "top",
        }}
      >
        {user.role}
      </td>

      <td style={{ padding: "14px 12px", verticalAlign: "top" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Account status badge */}
          {!user.is_active ? (
            <span style={{ ...pillBase, backgroundColor: "rgba(17,17,17,0.06)", color: "rgba(17,17,17,0.65)" }}>
              Inactive
            </span>
          ) : user.is_blacklisted ? (
            <span style={{ ...pillBase, backgroundColor: "rgba(178,35,41,0.08)", color: "var(--maroon)" }}>
              Blacklisted
            </span>
          ) : (
            <span style={{ ...pillBase, backgroundColor: "rgba(17,17,17,0.06)", color: "var(--ink)" }}>
              Active
            </span>
          )}

          {/* Membership badge — investors only */}
          {user.role === "investor" && (
            user.has_paid_membership ? (
              <span style={{ ...pillBase, backgroundColor: "rgba(17,17,17,0.08)", color: "var(--ink)", gap: 6 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--terracotta)", flexShrink: 0 }} />
                Paid member
              </span>
            ) : (
              <span style={{ ...pillBase, backgroundColor: "rgba(17,17,17,0.06)", color: "rgba(17,17,17,0.65)" }}>
                Unpaid
              </span>
            )
          )}
        </div>
      </td>

      <td
        style={{
          padding: "14px 12px",
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          whiteSpace: "nowrap",
          verticalAlign: "top",
        }}
      >
        {fmtDate(user.created_at)}
      </td>

      <td style={{ padding: "14px 12px", verticalAlign: "top" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {error && (
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--maroon)",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* Active / Inactive toggle */}
            {user.is_active ? (
              <button
                onClick={() => run(() => deactivateUser(user.id))}
                disabled={isPending}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  color: "var(--muted)",
                  border: "1px solid var(--hairline)",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => run(() => reactivateUser(user.id))}
                disabled={isPending}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  color: "var(--ink)",
                  border: "1px solid var(--hairline)",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                Reactivate
              </button>
            )}

            {/* Blacklist toggle */}
            {user.is_blacklisted ? (
              <button
                onClick={() => run(() => unblacklistUser(user.id))}
                disabled={isPending}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  color: "var(--maroon)",
                  border: "1px solid var(--hairline)",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                Remove blacklist
              </button>
            ) : (
              <button
                onClick={() => setShowBlacklist((v) => !v)}
                disabled={isPending}
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  color: "var(--maroon)",
                  border: "1px solid var(--hairline)",
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                Blacklist
              </button>
            )}
          </div>

            {/* Revoke membership — super_admin only, investors with paid membership */}
            {actorRole === "super_admin" &&
              user.role === "investor" &&
              user.has_paid_membership && (
                <button
                  onClick={() => setShowRevoke((v) => !v)}
                  disabled={isPending}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    padding: "6px 12px",
                    backgroundColor: "transparent",
                    color: "var(--maroon)",
                    border: "1px solid var(--hairline)",
                    cursor: isPending ? "not-allowed" : "pointer",
                  }}
                >
                  Revoke membership
                </button>
              )}

          {/* Inline revoke form */}
          {showRevoke && (
            <div
              style={{
                border: "1px solid var(--hairline)",
                padding: "14px",
                maxWidth: 320,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  marginBottom: 8,
                }}
              >
                Reason (required)
              </label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                rows={2}
                placeholder="Reason for revocation…"
                style={{
                  width: "100%",
                  border: "1px solid var(--hairline)",
                  padding: "8px 12px",
                  fontFamily: "var(--in)",
                  fontSize: 15,
                  color: "var(--ink)",
                  backgroundColor: "var(--cream)",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => run(() => revokeMembership(user.id, revokeReason))}
                  disabled={isPending || !revokeReason.trim()}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    padding: "7px 14px",
                    backgroundColor: "var(--maroon)",
                    color: "var(--cream)",
                    border: "none",
                    cursor: !revokeReason.trim() ? "not-allowed" : "pointer",
                    opacity: !revokeReason.trim() ? 0.5 : 1,
                  }}
                >
                  Confirm revoke
                </button>
                <button
                  onClick={() => setShowRevoke(false)}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    padding: "7px 12px",
                    background: "none",
                    border: "1px solid var(--hairline)",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Inline blacklist form */}
          {showBlacklist && (
            <div
              style={{
                border: "1px solid var(--hairline)",
                padding: "14px",
                maxWidth: 320,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  marginBottom: 8,
                }}
              >
                Reason (required)
              </label>
              <textarea
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
                rows={2}
                placeholder="Reason for blacklisting…"
                style={{
                  width: "100%",
                  border: "1px solid var(--hairline)",
                  padding: "8px 12px",
                  fontFamily: "var(--in)",
                  fontSize: 15,
                  color: "var(--ink)",
                  backgroundColor: "var(--cream)",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{ display: "flex", gap: 8, marginTop: 10 }}
              >
                <button
                  onClick={() =>
                    run(() => blacklistUser(user.id, blacklistReason))
                  }
                  disabled={isPending || !blacklistReason.trim()}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    padding: "7px 14px",
                    backgroundColor: "var(--maroon)",
                    color: "var(--cream)",
                    border: "none",
                    cursor: !blacklistReason.trim() ? "not-allowed" : "pointer",
                    opacity: !blacklistReason.trim() ? 0.5 : 1,
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowBlacklist(false)}
                  style={{
                    fontFamily: "var(--in)",
                    fontSize: 13,
                    padding: "7px 12px",
                    background: "none",
                    border: "1px solid var(--hairline)",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Blacklist reason display */}
          {user.is_blacklisted && user.blacklist_reason && (
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 14,
                color: "var(--maroon)",
                margin: 0,
                maxWidth: 320,
              }}
            >
              {user.blacklist_reason}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function UsersTable({
  users,
  actorRole,
}: {
  users: User[];
  actorRole: string;
}) {
  if (users.length === 0) {
    return (
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
          No users found.
        </p>
      </div>
    );
  }

  return (
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
          {["Name / ID", "Role", "Status", "Joined", "Actions"].map((h) => (
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
        {users.map((u) => (
          <UserRow key={u.id} user={u} actorRole={actorRole} />
        ))}
      </tbody>
    </table>
  );
}
