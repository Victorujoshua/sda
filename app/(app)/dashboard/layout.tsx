import { createClient } from "@/lib/supabase/server";
import AppNav from "@/components/app/AppNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName: string | null = null;
  let userRole: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    userName = profile?.full_name ?? null;
    userRole = profile?.role ?? null;
  }

  return (
    <>
      <AppNav userName={userName} userRole={userRole} />
      <div className="imani-page-content">
        {children}
      </div>
    </>
  );
}
