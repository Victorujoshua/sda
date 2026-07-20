import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const AMOUNT_KOBO = 1_000_000;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-paystack-signature") ?? "";

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  // Constant-time comparison
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))
  ) {
    console.error("[webhook/paystack] invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const reference = event.data?.reference as string | undefined;
    const amount = event.data?.amount as number | undefined;

    console.log("[webhook/paystack] charge.success reference:", reference, "amount:", amount);

    if (!reference || amount !== AMOUNT_KOBO) {
      console.log("[webhook/paystack] skipping — reference missing or amount mismatch:", { reference, amount, expected: AMOUNT_KOBO });
      return NextResponse.json({ ok: true });
    }

    const db = createAdminClient();

    const { data: payment, error: lookupError } = await db
      .from("membership_payments")
      .select("id, user_id, status")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (lookupError) {
      console.error("[webhook/paystack] membership_payments lookup FAILED:", lookupError);
      return NextResponse.json({ error: "DB lookup failed" }, { status: 500 });
    }

    if (!payment) {
      // No pending row — payment was not initiated through the app (unusual)
      console.error("[webhook/paystack] no membership_payments row found for reference:", reference);
      return NextResponse.json({ ok: true });
    }

    if (payment.status === "success") {
      // Idempotent — verify already recorded this
      console.log("[webhook/paystack] already recorded, skipping. reference:", reference);
      return NextResponse.json({ ok: true });
    }

    // Mark payment row as successful
    const { error: paymentUpdateError } = await db
      .from("membership_payments")
      .update({ status: "success", paid_at: new Date().toISOString() })
      .eq("id", payment.id);

    if (paymentUpdateError) {
      console.error("[webhook/paystack] membership_payments update FAILED:", paymentUpdateError);
      return NextResponse.json({ error: "DB write failed" }, { status: 500 });
    }

    // Flip membership flag
    const { error: profileUpdateError } = await db
      .from("profiles")
      .update({ has_paid_membership: true })
      .eq("id", payment.user_id);

    if (profileUpdateError) {
      console.error("[webhook/paystack] profiles.has_paid_membership update FAILED:", profileUpdateError);
      return NextResponse.json({ error: "DB write failed" }, { status: 500 });
    }

    console.log("[webhook/paystack] membership activated for user:", payment.user_id, "reference:", reference);

    // Audit — best-effort; never fail the webhook response over this
    const { error: auditError } = await db.from("audit_log").insert({
      actor_id: payment.user_id,
      action: "membership.paid",
      target_type: "user",
      target_id: payment.user_id,
      metadata: { reference, amount_kobo: amount, source: "webhook" } as never,
    });
    if (auditError) {
      console.error("[webhook/paystack] audit_log insert failed (non-fatal):", auditError);
    }
  }

  return NextResponse.json({ ok: true });
}
