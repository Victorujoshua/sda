import Link from "next/link";

const SCREENING = [
  "Screened for operational traction",
  "Reviewed for financial clarity",
  "Structured based on real performance",
];

const PREFERENCES = [
  "Income",
  "Growth",
  "Risk profile",
  "Time horizon",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "14px 0",
            borderTop: "1px solid var(--hairline)",
            borderBottom:
              i === items.length - 1
                ? "1px solid var(--hairline)"
                : undefined,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--crimson)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: "18px",
              color: "var(--ink)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ForInvestors() {
  return (
    <section
      style={{
        backgroundColor: "var(--cream)",
        padding: "80px 40px",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      {/* Eyebrow + heading */}
      <div>
        <p
          style={{
            fontFamily: "var(--in)",
            fontSize: "15px",
            fontWeight: 400,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(17,17,17,0.35)",
            marginBottom: "32px",
          }}
        >
          For Investors
        </p>

        <h2
          style={{
            fontFamily: "var(--sr)",
            fontSize: "42px",
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: 0,
          }}
        >
          We provide access to private investment opportunities<br />
          in businesses that are already generating revenue.
        </h2>
      </div>

      {/* Two-column sub-blocks */}
      <div className="imani-two-col" style={{ marginTop: "40px" }}>
        {/* Left — screening criteria */}
        <div>
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: "18px",
              color: "rgba(17,17,17,0.65)",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            Every opportunity on the platform is:
          </p>
          <BulletList items={SCREENING} />
        </div>

        {/* Right — investor preferences */}
        <div>
          <p
            style={{
              fontFamily: "var(--in)",
              fontSize: "18px",
              color: "rgba(17,17,17,0.65)",
              marginTop: 0,
              marginBottom: "16px",
            }}
          >
            Investors can choose how their capital is deployed, depending on
            their preference for:
          </p>
          <BulletList items={PREFERENCES} />
        </div>
      </div>

      {/* Closing statement + CTA — back to constrained width */}
      <div style={{ maxWidth: "760px" }}>
        <div style={{ marginTop: "48px" }}>
          <p
            style={{
              fontFamily: "var(--sr)",
              fontSize: "24px",
              fontWeight: 300,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            This is not about chasing deals.
          </p>
          <p
            style={{
              fontFamily: "var(--sr)",
              fontSize: "24px",
              fontWeight: 300,
              color: "rgba(17,17,17,0.5)",
              margin: 0,
            }}
          >
            It is about disciplined capital allocation.
          </p>
        </div>

        <Link
          href="/opportunities"
          style={{
            display: "inline-block",
            marginTop: "32px",
            fontFamily: "var(--in)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--crimson)",
            textDecoration: "none",
            letterSpacing: "0.04em",
            borderBottom: "1px solid var(--crimson)",
            paddingBottom: "2px",
          }}
        >
          Explore Opportunities →
        </Link>
      </div>
    </section>
  );
}
