import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MembershipFallbackView from "./MembershipFallbackView";

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/membership");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, has_paid_membership")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "investor") redirect("/dashboard");
  if (profile?.has_paid_membership) redirect("/opportunities");

  const initialError =
    error === "verification_failed"
      ? "Payment could not be verified. If you were charged, contact support — your access will be activated."
      : error
      ? "Something went wrong. Please try again."
      : undefined;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--paper)" }}>
      <MembershipFallbackView initialError={initialError} />
    </div>
  );
}
