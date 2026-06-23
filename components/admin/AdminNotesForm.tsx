"use client";

import { useState, useTransition } from "react";
import { saveAdminNotes } from "@/app/actions/admin";

export default function AdminNotesForm({
  applicationId,
  initialNotes,
}: {
  applicationId: string;
  initialNotes: string | null;
}) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleBlur() {
    startTransition(async () => {
      await saveAdminNotes(applicationId, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
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
          Internal notes
        </label>
        <span
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            color: isPending
              ? "var(--muted)"
              : saved
              ? "var(--success)"
              : "transparent",
          }}
        >
          {isPending ? "Saving…" : "Saved"}
        </span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        rows={5}
        placeholder="Notes visible to admins only…"
        style={{
          width: "100%",
          border: "1px solid var(--border)",
          padding: "10px 14px",
          fontFamily: "var(--in)",
          fontSize: 16,
          color: "var(--ink)",
          backgroundColor: "#fff",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
