import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, has_paid_membership")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "investor") {
    return NextResponse.json({ error: "Not an investor account." }, { status: 403 });
  }
  if (profile?.has_paid_membership) {
    return NextResponse.json({ error: "Membership already active." }, { status: 409 });
  }

  const email = user.email!;
  const reference = `sda_mem_${user.id}_${Date.now()}`;
  const amountKobo = 1_000_000;

  const db = createAdminClient();
  const { error: insertError } = await db.from("membership_payments").insert({
    user_id: user.id,
    paystack_reference: reference,
    amount_kobo: amountKobo,
    status: "pending",
  });

  if (insertError) {
    return NextResponse.json({ error: "Could not initialise payment record." }, { status: 500 });
  }

  return NextResponse.json({
    reference,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    amountKobo,
    email,
  });
}
