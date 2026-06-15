import { z } from "zod";

export const step1Schema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  founder_name: z.string().min(1, "Founder name is required"),
  contact_email: z.string().email("Enter a valid email address"),
  contact_phone: z.string().optional(),
});

export const step2Schema = z.object({
  business_description: z
    .string()
    .min(50, "Describe your business in at least 50 characters"),
  monthly_revenue: z
    .number({ error: "Enter a valid revenue figure" })
    .min(0, "Revenue cannot be negative")
    .nullable()
    .optional(),
});

export const step3Schema = z.object({
  funding_amount: z
    .number({ error: "Funding amount is required" })
    .min(1, "Funding amount is required")
    .max(5_000_000, "Maximum funding request is ₦5,000,000"),
  funding_type: z.enum(
    ["equity", "debt", "asset", "revenue_based"] as const,
    { error: "Select a funding type" }
  ),
});

export const fullApplicationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type FullApplicationData = z.infer<typeof fullApplicationSchema>;
