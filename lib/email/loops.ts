import { LoopsClient } from "loops"

const client = new LoopsClient(process.env.LOOPS_API_KEY!)

export const TEMPLATES = {
  APPLICATION_SUBMITTED: "application-submitted",
  APPLICATION_APPROVED: "application-approved",
  APPLICATION_REJECTED: "application-rejected",
  APPLICATION_UNDER_REVIEW: "application-under-review",
  NEW_APPLICATION_ADMIN: "new-application-admin",
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
