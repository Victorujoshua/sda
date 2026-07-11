import { LoopsClient } from "loops"

const client = new LoopsClient(process.env.LOOPS_API_KEY!)

// Each value is the opaque transactionalId from the Loops dashboard
// (Transactional → click template → API Details), NOT the friendly slug.
// Set the corresponding env var — see .env.local.example.
export const TEMPLATES = {
  APPLICATION_SUBMITTED:   process.env.LOOPS_TEMPLATE_APPLICATION_SUBMITTED!,
  APPLICATION_APPROVED:    process.env.LOOPS_TEMPLATE_APPLICATION_APPROVED!,
  APPLICATION_REJECTED:    process.env.LOOPS_TEMPLATE_APPLICATION_REJECTED!,
  APPLICATION_UNDER_REVIEW: process.env.LOOPS_TEMPLATE_APPLICATION_UNDER_REVIEW!,
  NEW_APPLICATION_ADMIN:   process.env.LOOPS_TEMPLATE_NEW_APPLICATION_ADMIN!,
  ADMIN_INVITE:            process.env.LOOPS_TEMPLATE_ADMIN_INVITE!,
} as const

export async function sendEmail(
  templateId: string,
  to: string,
  dataVariables: Record<string, string>
): Promise<{ error?: string }> {
  if (!process.env.LOOPS_API_KEY) {
    console.error("LOOPS_API_KEY not set — email not sent")
    return { error: "LOOPS_API_KEY not configured" }
  }
  if (!templateId) {
    console.error(`[Loops] Template ID is not set for send to ${to} — check LOOPS_TEMPLATE_* env vars`)
    return { error: "Template ID not configured" }
  }
  try {
    await client.sendTransactionalEmail({
      transactionalId: templateId,
      email: to,
      dataVariables,
    })
    console.log(`[Loops] Sent ${templateId} to ${to}`)
    return {}
  } catch (err) {
    console.error(`[Loops] Failed to send ${templateId} to ${to}:`, err)
    return { error: String(err) }
  }
}
