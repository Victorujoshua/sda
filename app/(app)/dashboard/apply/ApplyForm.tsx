"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveDraft,
  submitApplication,
  saveDocumentRecord,
} from "@/app/actions/applications";
import { createClient } from "@/lib/supabase/client";
import {
  fullApplicationSchema,
  type FullApplicationData,
} from "@/lib/validations/application";
import SignupProgress from "@/components/auth/SignupProgress";
import MobileStepIndicator from "@/components/auth/MobileStepIndicator";

type InitialData = {
  id: string;
  business_name: string;
  founder_name: string;
  contact_email: string;
  contact_phone: string | null;
  business_description: string;
  monthly_revenue: number | null;
  funding_amount: number | null;
  funding_type: "equity" | "debt" | "asset" | "revenue_based" | null;
};

type Props = {
  initialData: InitialData | null;
  initialApplicationId: string | undefined;
  startStep: number;
  userId: string;
};

// Maps apply form step (1-5) to milestone step (3-6)
function getMilestoneStep(appStep: number): number {
  if (appStep <= 2) return 3;
  if (appStep === 3) return 4;
  if (appStep === 4) return 5;
  return 6;
}

const STEP_HEADINGS = [
  "Business details",
  "Your business",
  "Funding details",
  "Upload documents",
  "Review & submit",
];

const STEP_SUBS = [
  "Tell us about your business and primary contact.",
  "Describe what you do and your current revenue.",
  "How much are you raising and on what terms?",
  "Financial records and bank statements. Both optional.",
  "Check everything before you submit.",
];

const FUNDING_TYPE_LABELS: Record<string, string> = {
  equity: "Equity",
  debt: "Debt",
  asset: "Asset",
  revenue_based: "Revenue share",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  border: "1px solid var(--hairline)",
  padding: "12px 16px",
  fontFamily: "var(--in)",
  fontSize: "17px",
  color: "var(--ink)",
  backgroundColor: "var(--cream)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--in)",
  fontSize: "15px",
  fontWeight: 500,
  color: "var(--ink)",
  marginBottom: "6px",
};

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--in)",
  fontSize: "15px",
  color: "var(--maroon)",
  marginTop: "5px",
};

const fieldStyle: React.CSSProperties = { marginBottom: "24px" };

export default function ApplyForm({
  initialData,
  initialApplicationId,
  startStep,
  userId,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(startStep);
  const [applicationId, setApplicationId] = useState<string | undefined>(initialApplicationId);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [docUploading, setDocUploading] = useState(false);
  const [docErrors, setDocErrors] = useState<{ financials?: string; bank_statement?: string }>({});
  const [docUploaded, setDocUploaded] = useState<{ financials?: string; bank_statement?: string }>({});
  const [financialFile, setFinancialFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);

  const {
    register,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FullApplicationData>({
    resolver: zodResolver(fullApplicationSchema),
    defaultValues: initialData
      ? {
          business_name: initialData.business_name ?? "",
          founder_name: initialData.founder_name ?? "",
          contact_email: initialData.contact_email ?? "",
          contact_phone: initialData.contact_phone ?? "",
          business_description: initialData.business_description ?? "",
          monthly_revenue: initialData.monthly_revenue ?? undefined,
          funding_amount: initialData.funding_amount ?? undefined,
          funding_type: initialData.funding_type ?? undefined,
        }
      : {
          business_name: "",
          founder_name: "",
          contact_email: "",
          contact_phone: "",
          business_description: "",
        },
  });

  const watchedValues = watch();

  async function persistDraft() {
    const values = getValues();
    const result = await saveDraft(
      {
        business_name: values.business_name,
        founder_name: values.founder_name,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        business_description: values.business_description,
        monthly_revenue: values.monthly_revenue,
        funding_amount: values.funding_amount,
        funding_type: values.funding_type,
      },
      applicationId
    );
    if (result.id) setApplicationId(result.id);
    return result;
  }

  async function handleNext() {
    setServerError(null);
    let fieldsToValidate: (keyof FullApplicationData)[] = [];
    if (step === 1) fieldsToValidate = ["business_name", "founder_name", "contact_email"];
    if (step === 2) fieldsToValidate = ["business_description"];
    if (step === 3) fieldsToValidate = ["funding_amount", "funding_type"];

    const valid = fieldsToValidate.length ? await trigger(fieldsToValidate) : true;
    if (!valid) return;

    startTransition(async () => {
      const result = await persistDraft();
      if (result.error) { setServerError(result.error); return; }
      setStep((s) => s + 1);
    });
  }

  async function handleSaveAndExit() {
    setServerError(null);
    startTransition(async () => {
      const result = await persistDraft();
      if (result.error) { setServerError(result.error); return; }
      router.push("/dashboard");
    });
  }

  async function handleDocumentUpload(file: File, type: "financials" | "bank_statement") {
    if (!applicationId) {
      setDocErrors((e) => ({ ...e, [type]: "Save your application first before uploading." }));
      return;
    }
    const bucket = type === "financials" ? "financial-records" : "bank-statements";
    const ext = file.name.split(".").pop();
    const path = `${userId}/${applicationId}/${type}/${Date.now()}.${ext}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

    if (uploadError) {
      setDocErrors((e) => ({
        ...e,
        [type]: uploadError.message.includes("Bucket not found") || uploadError.message.includes("not found")
          ? "Storage not yet configured. Skip for now — you can provide documents later."
          : uploadError.message,
      }));
      return;
    }

    const recordResult = await saveDocumentRecord(applicationId, path, type);
    if (recordResult.error) { setDocErrors((e) => ({ ...e, [type]: recordResult.error })); return; }
    setDocUploaded((u) => ({ ...u, [type]: file.name }));
    setDocErrors((e) => ({ ...e, [type]: undefined }));
  }

  async function handleDocumentsNext() {
    setServerError(null);
    setDocUploading(true);
    const uploads: Promise<void>[] = [];
    if (financialFile) uploads.push(handleDocumentUpload(financialFile, "financials"));
    if (bankFile) uploads.push(handleDocumentUpload(bankFile, "bank_statement"));
    await Promise.all(uploads);
    setDocUploading(false);
    setStep(5);
  }

  function handleSubmitApplication() {
    if (!applicationId) { setServerError("No application found. Please complete all steps."); return; }
    setServerError(null);
    startTransition(async () => {
      const result = await submitApplication(applicationId);
      if (result.error) { setServerError(result.error); return; }
      router.push("/dashboard?submitted=true");
    });
  }

  const milestoneStep = getMilestoneStep(step);

  const primaryBtnStyle: React.CSSProperties = {
    fontFamily: "var(--sr)",
    fontSize: "17px",
    fontWeight: 600,
    backgroundColor: "var(--crimson)",
    color: "var(--cream)",
    border: "none",
    padding: "14px 32px",
    cursor: "pointer",
    width: "100%",
  };

  const disabledBtnStyle: React.CSSProperties = {
    ...primaryBtnStyle,
    backgroundColor: "var(--maroon)",
    cursor: "not-allowed",
  };

  return (
    <div className="imani-signup-grid">
      <div className="imani-signup-inner">

        {/* Milestone sidebar */}
        <div className="imani-signup-sidebar">
          <SignupProgress currentStep={milestoneStep} variant="applicant" />
        </div>

        {/* Form column */}
        <div className="imani-signup-form-col">

          {/* Mobile step indicator */}
          <div className="imani-mobile-steps">
            <MobileStepIndicator currentStep={milestoneStep} totalSteps={6} />
          </div>

          {/* Step heading */}
          <h1 style={{ fontFamily: "var(--sr)", fontSize: "32px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--ink)", margin: "0 0 8px" }}>
            {STEP_HEADINGS[step - 1]}
          </h1>
          <p style={{ fontFamily: "var(--in)", fontSize: "18px", color: "rgba(17,17,17,0.5)", margin: "0 0 40px" }}>
            {STEP_SUBS[step - 1]}
          </p>

          {serverError && (
            <div style={{ border: "1px solid rgba(178,35,41,0.3)", backgroundColor: "rgba(178,35,41,0.06)", padding: "12px 16px", marginBottom: 24, fontFamily: "var(--in)", fontSize: 16, color: "var(--maroon)" }}>
              {serverError}
            </div>
          )}

          {/* ── Step 1: Business info ── */}
          {step === 1 && (
            <div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Business name</label>
                <input {...register("business_name")} style={inputStyle} placeholder="e.g. Kachi Organics" autoFocus />
                {errors.business_name && <p style={errorStyle}>{errors.business_name.message}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Founder / primary contact name</label>
                <input {...register("founder_name")} style={inputStyle} placeholder="Your full name" />
                {errors.founder_name && <p style={errorStyle}>{errors.founder_name.message}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Contact email</label>
                <input {...register("contact_email")} type="email" style={inputStyle} placeholder="you@yourcompany.com" />
                {errors.contact_email && <p style={errorStyle}>{errors.contact_email.message}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Phone number{" "}
                  <span style={{ color: "rgba(17,17,17,0.4)", fontWeight: 400, fontSize: "14px" }}>(optional)</span>
                </label>
                <input {...register("contact_phone")} type="tel" style={inputStyle} placeholder="+234 800 000 0000" />
              </div>
            </div>
          )}

          {/* ── Step 2: Business description ── */}
          {step === 2 && (
            <div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tell us about your business</label>
                <p style={{ fontFamily: "var(--in)", fontSize: 15, color: "rgba(17,17,17,0.5)", lineHeight: 1.6, margin: "0 0 10px" }}>
                  What problem do you solve, who are your customers, and what traction do you have? (minimum 50 characters)
                </p>
                <textarea {...register("business_description")} rows={7} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} placeholder="We help Nigerian SMEs…" />
                {errors.business_description && <p style={errorStyle}>{errors.business_description.message}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Monthly revenue (₦){" "}
                  <span style={{ color: "rgba(17,17,17,0.4)", fontWeight: 400, fontSize: "14px" }}>(optional)</span>
                </label>
                <input
                  {...register("monthly_revenue", {
                    setValueAs: (v: unknown) => { if (v === "" || v == null) return null; const n = parseFloat(String(v)); return isNaN(n) ? null : n; },
                  })}
                  type="number" min="0" step="any" style={inputStyle} placeholder="0"
                />
                {errors.monthly_revenue && <p style={errorStyle}>{errors.monthly_revenue.message}</p>}
              </div>
            </div>
          )}

          {/* ── Step 3: Funding ask ── */}
          {step === 3 && (
            <div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Funding amount requested (₦)</label>
                <p style={{ fontFamily: "var(--in)", fontSize: 15, color: "rgba(17,17,17,0.5)", margin: "0 0 10px" }}>
                  Maximum ₦5,000,000 per application.
                </p>
                <input
                  {...register("funding_amount", {
                    setValueAs: (v: unknown) => { if (v === "" || v == null) return undefined; const n = parseFloat(String(v)); return isNaN(n) ? undefined : n; },
                  })}
                  type="number" min="1" max="5000000" step="any" style={inputStyle} placeholder="500000"
                />
                {errors.funding_amount && <p style={errorStyle}>{errors.funding_amount.message}</p>}
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Funding structure</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                  {(["equity", "debt", "asset", "revenue_based"] as const).map((type) => (
                    <label key={type} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "var(--in)", fontSize: 17, color: "var(--ink)" }}>
                      <input {...register("funding_type")} type="radio" value={type} style={{ accentColor: "var(--crimson)", width: 16, height: 16 }} />
                      {FUNDING_TYPE_LABELS[type]}
                    </label>
                  ))}
                </div>
                {errors.funding_type && <p style={errorStyle}>{errors.funding_type.message}</p>}
              </div>
            </div>
          )}

          {/* ── Step 4: Documents ── */}
          {step === 4 && (
            <div>
              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Financial statements{" "}
                  <span style={{ color: "rgba(17,17,17,0.4)", fontWeight: 400, fontSize: "14px" }}>(PDF or Excel, max 10MB)</span>
                </label>
                {docUploaded.financials ? (
                  <div style={{ padding: "12px 16px", border: "1px solid var(--hairline)", fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)" }}>
                    ✓ {docUploaded.financials} uploaded
                  </div>
                ) : (
                  <input type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={(e) => setFinancialFile(e.target.files?.[0] ?? null)} style={{ fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)" }} />
                )}
                {docErrors.financials && <p style={errorStyle}>{docErrors.financials}</p>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  Bank statements{" "}
                  <span style={{ color: "rgba(17,17,17,0.4)", fontWeight: 400, fontSize: "14px" }}>(PDF, last 6 months, max 10MB)</span>
                </label>
                {docUploaded.bank_statement ? (
                  <div style={{ padding: "12px 16px", border: "1px solid var(--hairline)", fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)" }}>
                    ✓ {docUploaded.bank_statement} uploaded
                  </div>
                ) : (
                  <input type="file" accept=".pdf" onChange={(e) => setBankFile(e.target.files?.[0] ?? null)} style={{ fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)" }} />
                )}
                {docErrors.bank_statement && <p style={errorStyle}>{docErrors.bank_statement}</p>}
              </div>
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && (
            <div>
              <ReviewRow label="Business name" value={watchedValues.business_name} />
              <ReviewRow label="Founder" value={watchedValues.founder_name} />
              <ReviewRow label="Contact email" value={watchedValues.contact_email} />
              {watchedValues.contact_phone && <ReviewRow label="Phone" value={watchedValues.contact_phone} />}
              <ReviewRow label="Business description" value={watchedValues.business_description} multiline />
              {watchedValues.monthly_revenue != null && (
                <ReviewRow label="Monthly revenue" value={`₦${Number(watchedValues.monthly_revenue).toLocaleString()}`} />
              )}
              <ReviewRow label="Funding requested" value={watchedValues.funding_amount ? `₦${Number(watchedValues.funding_amount).toLocaleString()}` : "—"} />
              <ReviewRow label="Funding structure" value={watchedValues.funding_type ? FUNDING_TYPE_LABELS[watchedValues.funding_type] : "—"} />

              {(docUploaded.financials || docUploaded.bank_statement) && (
                <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16, marginTop: 16 }}>
                  <p style={{ fontFamily: "var(--in)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(17,17,17,0.5)", margin: "0 0 8px" }}>Documents</p>
                  {docUploaded.financials && <p style={{ fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)", margin: "0 0 4px" }}>✓ Financial statements: {docUploaded.financials}</p>}
                  {docUploaded.bank_statement && <p style={{ fontFamily: "var(--in)", fontSize: 16, color: "var(--ink)", margin: 0 }}>✓ Bank statements: {docUploaded.bank_statement}</p>}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--hairline)" }}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={isPending || docUploading}
                style={{ fontFamily: "var(--in)", fontSize: 15, letterSpacing: "0.04em", padding: "12px 24px", background: "transparent", border: "1px solid var(--hairline)", color: "var(--ink)", cursor: "pointer" }}
              >
                Back
              </button>
            )}

            {step < 4 && (
              <button type="button" onClick={handleNext} disabled={isPending} style={isPending ? disabledBtnStyle : primaryBtnStyle}>
                {isPending ? "Saving…" : "Continue"}
              </button>
            )}

            {step === 4 && (
              <button type="button" onClick={handleDocumentsNext} disabled={docUploading} style={docUploading ? disabledBtnStyle : primaryBtnStyle}>
                {docUploading ? "Uploading…" : (financialFile || bankFile) ? "Upload and continue" : "Skip for now"}
              </button>
            )}

            {step === 5 && (
              <button type="button" onClick={handleSubmitApplication} disabled={isPending} style={isPending ? disabledBtnStyle : primaryBtnStyle}>
                {isPending ? "Submitting…" : "Submit application"}
              </button>
            )}

            {step < 5 && (
              <button
                type="button"
                onClick={handleSaveAndExit}
                disabled={isPending || docUploading}
                style={{ fontFamily: "var(--in)", fontSize: 15, background: "none", border: "none", color: "rgba(17,17,17,0.45)", cursor: "pointer", padding: "12px 0", marginLeft: 4, letterSpacing: "0.02em" }}
              >
                Save and exit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, multiline = false }: { label: string; value: string | undefined; multiline?: boolean }) {
  return (
    <div style={{ borderTop: "1px solid var(--hairline)", padding: "14px 0", display: multiline ? "block" : "flex", justifyContent: "space-between", gap: 24 }}>
      <span style={{ fontFamily: "var(--in)", fontSize: 14, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "rgba(17,17,17,0.45)", flexShrink: 0, ...(multiline ? { display: "block", marginBottom: 6 } : {}) }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--in)", fontSize: 17, color: "var(--ink)", textAlign: multiline ? "left" : "right", lineHeight: 1.6, wordBreak: "break-word" }}>
        {value || "—"}
      </span>
    </div>
  );
}
