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

  console.log("[verify] reference:", reference, "user:", user.id);

  // Confirm charge with Paystack
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

  console.log("[verify] Paystack response:", psRes.status, "status:", psData.data?.status, "amount:", psData.data?.amount);

  if (!psRes.ok || psData.data?.status !== "success") {
    console.error("[verify] Paystack did not confirm payment. psRes.ok:", psRes.ok, "data:", JSON.stringify(psData));
    return NextResponse.json({ error: "Payment not verified." }, { status: 402 });
  }

  if (psData.data.amount !== AMOUNT_KOBO) {
    console.error("[verify] Amount mismatch. Expected:", AMOUNT_KOBO, "Got:", psData.data.amount);
    return NextResponse.json({ error: "Amount mismatch." }, { status: 402 });
  }

  const db = createAdminClient();

  // Idempotency — already recorded
  const { data: profile } = await db
    .from("profiles")
    .select("has_paid_membership")
    .eq("id", user.id)
    .single();

  if (profile?.has_paid_membership) {
    console.log("[verify] already paid, returning success early. user:", user.id);
    return NextResponse.json({ success: true });
  }

  // Mark payment row as successful — surface any error
  const { data: updatedPayments, error: paymentUpdateError } = await db
    .from("membership_payments")
    .update({ status: "success", paid_at: new Date().toISOString() })
    .eq("paystack_reference", reference)
    .eq("user_id", user.id)
    .select();

  if (paymentUpdateError) {
    console.error("[verify] membership_payments update FAILED:", paymentUpdateError);
    return NextResponse.json({ error: "Failed to record payment." }, { status: 500 });
  }

  if (!updatedPayments?.length) {
    // Row not found — init may not have run or reference mismatch
    console.error("[verify] membership_payments update matched 0 rows. reference:", reference, "user_id:", user.id);
    return NextResponse.json({ error: "Payment record not found." }, { status: 500 });
  }

  // Flip membership flag — this is the critical write
  const { error: profileUpdateError } = await db
    .from("profiles")
    .update({ has_paid_membership: true })
    .eq("id", user.id);

  if (profileUpdateError) {
    console.error("[verify] profiles.has_paid_membership update FAILED:", profileUpdateError);
    return NextResponse.json({ error: "Failed to activate membership." }, { status: 500 });
  }

  console.log("[verify] membership activated for user:", user.id, "reference:", reference);

  // Audit — best-effort; never fail the response over this
  const { error: auditError } = await db.from("audit_log").insert({
    actor_id: user.id,
    action: "membership.paid",
    target_type: "user",
    target_id: user.id,
    metadata: { reference, amount_kobo: AMOUNT_KOBO, source: "verify" } as never,
  });
  if (auditError) {
    console.error("[verify] audit_log insert failed (non-fatal):", auditError);
  }

  return NextResponse.json({ success: true });
}
