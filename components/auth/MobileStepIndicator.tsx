export default function MobileStepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isActive    = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isActive ? "#CF9A0A" : isCompleted ? "#0A0A0A" : "transparent",
              border: !isActive && !isCompleted ? "1px solid rgba(0,0,0,0.2)" : "none",
              fontFamily: "var(--sr)",
              fontSize: "16px",
              fontWeight: 600,
              color: isActive ? "#0A0A0A" : isCompleted ? "#FAFAF8" : "rgba(0,0,0,0.3)",
            }}>
              {isCompleted ? "✓" : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div style={{ width: 20, height: 1, backgroundColor: "rgba(0,0,0,0.15)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
