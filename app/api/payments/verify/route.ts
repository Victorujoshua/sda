import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const AMOUNT_KOBO = 1_000_000;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  let reference: string;
  try {
    const body = await req.json();
    reference = body.reference;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const psRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );
  const psData = await psRes.json();

  if (!psRes.ok || psData.data?.status !== "success") {
    return NextResponse.json({ error: "Payment not verified." }, { status: 402 });
  }

  if (psData.data.amount !== AMOUNT_KOBO) {
    return NextResponse.json({ error: "Amount mismatch." }, { status: 402 });
  }

  const db = createAdminClient();

  // Idempotency — already paid
  const { data: profile } = await db
    .from("profiles")
    .select("has_paid_membership")
    .eq("id", user.id)
    .single();

  if (profile?.has_paid_membership) {
    return NextResponse.json({ success: true });
  }

  // Mark payment success
  await db
    .from("membership_payments")
    .update({ status: "success", paid_at: new Date().toISOString() })
    .eq("paystack_reference", reference)
    .eq("user_id", user.id);

  // Flip membership flag
  await db.from("profiles").update({ has_paid_membership: true }).eq("id", user.id);

  // Audit
  await db.from("audit_log").insert({
    actor_id: user.id,
    action: "membership.paid",
    target_type: "user",
    target_id: user.id,
    metadata: { reference, amount_kobo: AMOUNT_KOBO, source: "verify" } as never,
  });

  return NextResponse.json({ success: true });
}
