import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validates session with auth server and refreshes cookies if needed.
  // Must be called before any route checks.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Fetch role once for any protected route — reused across all checks below.
  const needsRole =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  let role: string | null = null;
  if (user && needsRole) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  const loginRedirect = (from: string) => {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirectTo", from);
    return NextResponse.redirect(url);
  };
  const hardRedirect = (to: string) => {
    const url = request.nextUrl.clone();
    url.pathname = to;
    url.search = "";
    return NextResponse.redirect(url);
  };

  // ── /dashboard/invest — investor only ────────────────────
  if (pathname.startsWith("/dashboard/invest")) {
    if (!user) return loginRedirect(pathname);
    if (role === "admin" || role === "super_admin") return hardRedirect("/admin");
    if (role === "applicant" || !role) return hardRedirect("/dashboard");
    // investor: allow through
  }

  // ── /dashboard (not /dashboard/invest) — applicant only ──
  else if (pathname.startsWith("/dashboard")) {
    if (!user) return loginRedirect(pathname);
    if (role === "admin" || role === "super_admin") return hardRedirect("/admin");
    if (role === "investor") return hardRedirect("/dashboard/invest");
    // applicant: allow through
  }

  // ── /admin — admin or super_admin only ───────────────────
  else if (pathname.startsWith("/admin")) {
    if (!user) return loginRedirect(pathname);
    if (role !== "admin" && role !== "super_admin") return loginRedirect(pathname);
    // admin/super_admin: allow through
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all paths except static assets, images, and favicon
    "/((?!_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
