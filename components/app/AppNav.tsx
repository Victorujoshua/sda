"use client";

import { createClient } from "@/lib/supabase/client";
import Wordmark from "@/components/brand/Wordmark";

type Props = {
  userName: string | null;
  userRole: string | null;
};

export default function AppNav({ userName, userRole }: Props) {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 40px",
        backgroundColor: "var(--cream)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <Wordmark variant="default" />

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {userName && (
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "rgba(17,17,17,0.6)",
            }}
          >
            {userName}
          </span>
        )}

        {userRole === "investor" && (
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 13,
              color: "rgba(17,17,17,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Investor
          </span>
        )}

        <button onClick={handleLogout} className="imani-app-nav-signout">
          Log out
        </button>
      </div>
    </nav>
  );
}
