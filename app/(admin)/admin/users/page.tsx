import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import UsersTable from "@/components/admin/UsersTable";
import AdminTeamSection from "@/components/admin/AdminTeamSection";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const params = await searchParams;
  const db = createAdminClient();
  const supabase = await createClient();

  // Get current actor's role for permission-gated UI
  const { data: { user: actor } } = await supabase.auth.getUser();
  const { data: actorProfile } = actor
    ? await db.from("profiles").select("role").eq("id", actor.id).single()
    : { data: null };
  const actorRole = actorProfile?.role ?? "admin";

  // Fetch admin team separately (shown above the main table)
  const { data: adminMembers } = await db
    .from("profiles")
    .select("id, full_name, role, created_at")
    .in("role", ["admin", "super_admin"] as never[])
    .order("created_at", { ascending: true });

  // Main user table — applicants and investors only
  let query = db
    .from("profiles")
    .select("id, full_name, role, is_active, is_blacklisted, blacklist_reason, has_paid_membership, created_at")
    .in("role", ["applicant", "investor"] as never[])
    .order("created_at", { ascending: false })
    .limit(300);

  if (params.role && ["applicant", "investor"].includes(params.role)) {
    query = query.eq("role", params.role as never);
  }
  if (params.search) {
    const s = params.search.trim();
    query = query.ilike("full_name", `%${s}%`);
  }

  const { data: users } = await query;

  const total = users?.length ?? 0;
  const blacklisted = users?.filter((u) => u.is_blacklisted).length ?? 0;
  const inactive = users?.filter((u) => !u.is_active).length ?? 0;

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--hairline)",
    padding: "8px 12px",
    fontFamily: "var(--in)",
    fontSize: 15,
    color: "var(--ink)",
    backgroundColor: "var(--cream)",
    outline: "none",
    width: 200,
  };

  return (
    <div style={{ padding: "48px 40px", maxWidth: 960 }}>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--muted)",
          margin: "0 0 12px",
        }}
      >
        Admin
      </p>
      <h1
        style={{
          fontFamily: "var(--sr)",
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          margin: "0 0 8px",
        }}
      >
        Users
      </h1>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 15,
          color: "var(--muted)",
          margin: "0 0 32px",
        }}
      >
        {total} total · {blacklisted} blacklisted · {inactive} inactive
      </p>

      {/* Admin team */}
      <AdminTeamSection
        members={adminMembers ?? []}
        actorRole={actorRole}
      />

      {/* Filters — applicants + investors only */}
      <form
        method="get"
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 32,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Search name
          </label>
          <input
            name="search"
            type="text"
            defaultValue={params.search ?? ""}
            placeholder="Full name…"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Role
          </label>
          <select
            name="role"
            defaultValue={params.role ?? ""}
            style={{ ...inputStyle, width: 140 }}
          >
            <option value="">All roles</option>
            <option value="applicant">Applicant</option>
            <option value="investor">Investor</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "9px 20px",
            backgroundColor: "var(--crimson)",
            color: "var(--cream)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Filter
        </button>
      </form>

      <UsersTable users={users ?? []} actorRole={actorRole} />
    </div>
  );
}
