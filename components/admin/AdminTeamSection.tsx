"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { inviteAdmin, removeAdmin, updateUserName } from "@/app/actions/admin";

type AdminMember = {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

const btnBase: React.CSSProperties = {
  fontFamily: "var(--in)",
  fontSize: 13,
  letterSpacing: "0.04em",
  padding: "6px 12px",
  border: "1px solid var(--border)",
  backgroundColor: "transparent",
  cursor: "pointer",
};

function RoleBadge({ role }: { role: string }) {
  const isSuperAdmin = role === "super_admin";
  return (
    <span
      style={{
        fontFamily: "var(--in)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "3px 8px",
        backgroundColor: isSuperAdmin ? "#CF9A0A" : "rgba(0,0,0,0.06)",
        color: isSuperAdmin ? "#0A0A0A" : "var(--ink)",
      }}
    >
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
}

function AdminRow({
  member,
  canRemove,
}: {
  member: AdminMember;
  canRemove: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Inline name edit state
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(member.full_name ?? "");
  const [nameSaved, setNameSaved] = useState(false);
  const [namePending, startNameTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commitEdit() {
    setEditing(false);
    startNameTransition(async () => {
      const result = await updateUserName(member.id, nameValue);
      if (!result.error) {
        setNameSaved(true);
        setTimeout(() => setNameSaved(false), 2000);
        router.refresh();
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
    if (e.key === "Escape") { setNameValue(member.full_name ?? ""); setEditing(false); }
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const result = await removeAdmin(member.id);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  const hasName = nameValue.trim().length > 0;

  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      <td style={{ padding: "14px 12px", verticalAlign: "middle" }}>
        {editing ? (
          <input
            ref={inputRef}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: "var(--in)",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--ink)",
              border: "1px solid var(--border)",
              padding: "4px 8px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "#fff",
            }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              onClick={startEdit}
              title="Click to edit name"
              style={{
                fontFamily: "var(--in)",
                fontSize: 16,
                fontWeight: hasName ? 500 : 400,
                color: hasName ? "var(--ink)" : "var(--muted)",
                cursor: "pointer",
                borderBottom: "1px dashed transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "var(--muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              {hasName ? nameValue : "Unnamed admin"}
            </span>
            {nameSaved && (
              <span style={{ fontFamily: "var(--in)", fontSize: 13, color: "var(--success)" }}>
                Saved
              </span>
            )}
            {namePending && (
              <span style={{ fontFamily: "var(--in)", fontSize: 13, color: "var(--muted)" }}>
                Saving…
              </span>
            )}
          </div>
        )}
      </td>
      <td style={{ padding: "14px 12px", verticalAlign: "middle" }}>
        <RoleBadge role={member.role} />
      </td>
      <td
        style={{
          padding: "14px 12px",
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          verticalAlign: "middle",
          whiteSpace: "nowrap",
        }}
      >
        {new Date(member.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td style={{ padding: "14px 12px", verticalAlign: "middle" }}>
        {canRemove && (
          <div>
            <button
              onClick={handleRemove}
              disabled={isPending}
              style={{ ...btnBase, color: "var(--danger)" }}
            >
              {isPending ? "Removing…" : "Remove admin"}
            </button>
            {error && (
              <p
                style={{
                  fontFamily: "var(--in)",
                  fontSize: 14,
                  color: "var(--danger)",
                  margin: "6px 0 0",
                }}
              >
                {error}
              </p>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

function InviteForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await inviteAdmin(email);
      if (res.error) {
        setResult({ error: res.error });
      } else {
        setResult({ success: `Invite sent to ${email}` });
        setEmail("");
      }
    });
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        padding: "20px",
        marginTop: 16,
        maxWidth: 440,
      }}
    >
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          margin: "0 0 14px",
        }}
      >
        Invite admin
      </p>

      {result?.success && (
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--success)",
            margin: "0 0 12px",
          }}
        >
          {result.success}
        </p>
      )}
      {result?.error && (
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--danger)",
            margin: "0 0 12px",
          }}
        >
          {result.error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 10, alignItems: "flex-end" }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="admin@example.com"
          style={{
            flex: 1,
            border: "1px solid var(--border)",
            padding: "9px 12px",
            fontFamily: "var(--in)",
            fontSize: 15,
            color: "var(--ink)",
            backgroundColor: "#fff",
            outline: "none",
          }}
        />
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
            flexShrink: 0,
          }}
        >
          {isPending ? "Sending…" : "Send invite"}
        </button>
        <button
          type="button"
          onClick={onDone}
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            padding: "9px 14px",
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default function AdminTeamSection({
  members,
  actorRole,
}: {
  members: AdminMember[];
  actorRole: string;
}) {
  const isSuperAdmin = actorRole === "super_admin";
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: 0,
          }}
        >
          Admin team
        </p>
        {isSuperAdmin && (
          <button
            onClick={() => setShowInvite((v) => !v)}
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              letterSpacing: "0.04em",
              padding: "7px 16px",
              backgroundColor: "#CF9A0A",
              color: "#0A0A0A",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Invite admin
          </button>
        )}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid var(--border)",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
            {["Name", "Role", "Joined", "Actions"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontFamily: "var(--in)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  fontWeight: 400,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: "24px 12px",
                  fontFamily: "var(--in)",
                  fontSize: 16,
                  color: "var(--muted)",
                  textAlign: "center",
                }}
              >
                No admin accounts found.
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <AdminRow
                key={m.id}
                member={m}
                canRemove={isSuperAdmin && m.role === "admin"}
              />
            ))
          )}
        </tbody>
      </table>

      {showInvite && <InviteForm onDone={() => setShowInvite(false)} />}
    </div>
  );
}
