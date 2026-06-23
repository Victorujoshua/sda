type Variant = "applicant" | "investor";

const STEP_LABELS: Record<Variant, string[]> = {
  applicant: [
    "Create account",
    "Verify email",
    "Business details",
    "Funding details",
    "Upload documents",
    "Review & submit",
  ],
  investor: [
    "Create account",
    "Verify email",
    "Investment profile",
    "Funding details",
    "Upload documents",
    "Review & submit",
  ],
};

export default function SignupProgress({
  currentStep,
  variant = "applicant",
}: {
  currentStep: number;
  variant?: Variant;
}) {
  const steps = STEP_LABELS[variant];

  return (
    <>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(0,0,0,0.35)",
        margin: "0 0 24px",
      }}>
        Progress
      </p>

      <div>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive    = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming  = stepNumber > currentStep;
          const isLast      = index === steps.length - 1;

          return (
            <div key={stepNumber}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "10px 0" }}>
                {/* Circle */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive ? "#CF9A0A" : isCompleted ? "#0A0A0A" : "transparent",
                  border: isUpcoming ? "1px solid rgba(0,0,0,0.2)" : "none",
                  fontFamily: "var(--sr)",
                  fontSize: "17px",
                  fontWeight: 600,
                  color: isActive ? "#0A0A0A" : isCompleted ? "#FAFAF8" : "rgba(0,0,0,0.3)",
                }}>
                  {isCompleted ? "✓" : stepNumber}
                </div>

                {/* Text */}
                <div style={{ paddingTop: "5px" }}>
                  <p style={{
                    fontFamily: "var(--sr)",
                    fontSize: "17px",
                    fontWeight: 500,
                    color: isActive ? "#0A0A0A" : isCompleted ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {label}
                  </p>
                  {isActive && (
                    <p style={{
                      fontFamily: "var(--in)",
                      fontSize: "15px",
                      color: "rgba(0,0,0,0.4)",
                      margin: "2px 0 0",
                    }}>
                      You are here
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div style={{
                  width: 1,
                  height: 20,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  marginLeft: 13,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
