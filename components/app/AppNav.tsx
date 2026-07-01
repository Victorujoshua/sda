"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userName: string | null;
  userRole: string | null;
};

export default function AppNav({ userName, userRole }: Props) {
  const logoHref =
    userRole === "investor" ? "/dashboard/invest" : "/dashboard";

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
        backgroundColor: "#0A0A0A",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Link href={logoHref} style={{ display: "inline-flex", alignItems: "center" }}>
        <Image
          src="/images/logo.png"
          alt="SDA"
          width={120}
          height={40}
          style={{ objectFit: "contain" }}
          priority
        />
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {userName && (
          <span
            style={{
              fontFamily: "var(--in)",
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
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
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Investor
          </span>
        )}

        <button onClick={handleLogout} className="sda-app-nav-signout">
          Log out
        </button>
      </div>
    </nav>
  );
}
