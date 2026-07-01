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

  // Constant-time comparison — must be same length
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))
  ) {
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

    if (!reference || amount !== AMOUNT_KOBO) {
      return NextResponse.json({ ok: true });
    }

    const db = createAdminClient();

    const { data: payment } = await db
      .from("membership_payments")
      .select("id, user_id, status")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (!payment || payment.status === "success") {
      return NextResponse.json({ ok: true }); // idempotent
    }

    await db
      .from("membership_payments")
      .update({ status: "success", paid_at: new Date().toISOString() })
      .eq("id", payment.id);

    await db
      .from("profiles")
      .update({ has_paid_membership: true })
      .eq("id", payment.user_id);

    await db.from("audit_log").insert({
      actor_id: payment.user_id,
      action: "membership.paid",
      target_type: "user",
      target_id: payment.user_id,
      metadata: { reference, amount_kobo: amount, source: "webhook" } as never,
    });
  }

  return NextResponse.json({ ok: true });
}
