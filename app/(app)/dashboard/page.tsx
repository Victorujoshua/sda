import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type Application = {
  id: string;
  status: "draft" | "pending" | "under_review" | "approved" | "rejected";
  business_name: string;
  created_at: string;
  submitted_at: string | null;
  rejection_reason: string | null;
};

const STATUS_LABEL: Record<Application["status"], string> = {
  draft: "Draft",
  pending: "Pending review",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Not approved",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Guards — middleware is primary; these catch any edge cases
  if (profile?.role === "admin" || profile?.role === "super_admin") {
    redirect("/admin");
  }
  if (profile?.role === "investor") {
    redirect("/dashboard/invest");
  }

  const { data: applications } = await supabase
    .from("applications")
    .select("id, status, business_name, created_at, submitted_at, rejection_reason")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const latestApp = (applications?.[0] as Application) ?? null;
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const justSubmitted = params.submitted === "true";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--cream)",
        color: "var(--ink)",
        fontFamily: "var(--in)",
      }}
    >
      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px" }}
      >
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: "0 0 16px",
          }}
        >
          Dashboard
        </p>
        <h1
          style={{
            fontFamily: "var(--sr)",
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "var(--ink)",
            margin: "0 0 48px",
          }}
        >
          Good to see you, {firstName}.
        </h1>

        {/* Submission confirmation */}
        {justSubmitted && (
          <div
            style={{
              border: "1px solid var(--hairline)",
              padding: "16px 20px",
              marginBottom: 32,
              fontFamily: "var(--in)",
              fontSize: 17,
              color: "var(--ink)",
              lineHeight: 1.6,
            }}
          >
            Your application has been submitted. We will review it and be in
            touch within 5–10 business days.
          </div>
        )}

        <ApplicantPanel app={latestApp} />
      </div>
    </main>
  );
}

function ApplicantPanel({ app }: { app: Application | null }) {
  if (!app) {
    return (
      <div>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 17,
            color: "var(--muted)",
            lineHeight: 1.7,
            margin: "0 0 32px",
          }}
        >
          You have not submitted an application yet. Apply for early-stage
          capital from the Imani Ventures network.
        </p>
        <Link
          href="/dashboard/apply"
          style={{
            display: "inline-block",
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "10px 28px",
            backgroundColor: "var(--crimson)",
            color: "var(--cream)",
            textDecoration: "none",
          }}
        >
          Start your application
        </Link>
      </div>
    );
  }

  if (app.status === "draft") {
    return (
      <div
        style={{
          border: "1px solid var(--hairline)",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--muted)",
              margin: 0,
            }}
          >
            Draft — started{" "}
            {new Date(app.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <p
          style={{
            fontFamily: "var(--sr)",
            fontSize: 22,
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            margin: "0 0 8px",
          }}
        >
          {app.business_name || "Application in progress"}
        </p>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 17,
            color: "var(--muted)",
            lineHeight: 1.7,
            margin: "0 0 24px",
          }}
        >
          Your application has been saved. Continue where you left off.
        </p>
        <Link
          href={`/dashboard/apply?resume=${app.id}`}
          style={{
            display: "inline-block",
            fontFamily: "var(--in)",
            fontSize: 14,
            letterSpacing: "0.04em",
            padding: "10px 22px",
            backgroundColor: "var(--crimson)",
            color: "var(--cream)",
            textDecoration: "none",
          }}
        >
          Resume application
        </Link>
      </div>
    );
  }

  if (app.status === "pending" || app.status === "under_review") {
    return (
      <StatusCard
        eyebrow={STATUS_LABEL[app.status]}
        heading={app.business_name}
        body={
          app.status === "pending"
            ? "Your application is in our queue. We review all applications within 5–10 business days and will contact you at the email you provided."
            : "Your application is currently being reviewed by our team. We will be in touch shortly."
        }
        submittedAt={app.submitted_at}
      />
    );
  }

  if (app.status === "approved") {
    return (
      <StatusCard
        eyebrow="Approved"
        heading={app.business_name}
        body="Congratulations — your application has been approved. Our team will reach out within 2–3 business days to discuss next steps."
        submittedAt={app.submitted_at}
        highlight
      />
    );
  }

  if (app.status === "rejected") {
    return (
      <div>
        <StatusCard
          eyebrow="Application outcome"
          heading={app.business_name}
          body="Thank you for applying. After careful consideration, we are not able to proceed with this application at this time."
          submittedAt={app.submitted_at}
        />
        {app.rejection_reason && (
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderTop: "none",
              padding: "20px 28px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                margin: "0 0 8px",
              }}
            >
              Feedback
            </p>
            <p
              style={{
                fontFamily: "var(--in)",
                fontSize: 17,
                color: "var(--ink)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {app.rejection_reason}
            </p>
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <Link
            href="/dashboard/apply"
            style={{
              display: "inline-block",
              fontFamily: "var(--in)",
              fontSize: 14,
              letterSpacing: "0.04em",
              padding: "10px 22px",
              backgroundColor: "var(--crimson)",
              color: "var(--cream)",
              textDecoration: "none",
            }}
          >
            Apply again
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

function StatusCard({
  eyebrow,
  heading,
  body,
  submittedAt,
  highlight = false,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  submittedAt: string | null;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--hairline)",
        padding: "28px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--muted)",
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
        {submittedAt && (
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: 14,
              color: "var(--muted)",
              margin: 0,
            }}
          >
            Submitted{" "}
            {new Date(submittedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--sr)",
          fontSize: 22,
          fontWeight: 300,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          margin: "0 0 8px",
        }}
      >
        {heading}
      </p>
      <p
        style={{
          fontFamily: "var(--in)",
          fontSize: 17,
          color: "var(--muted)",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}
