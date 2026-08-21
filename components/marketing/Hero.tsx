import Image from "next/image";
import Link from "next/link";
import HeroTicker from "@/components/marketing/HeroTicker";

export default function Hero() {
  return (
    <section style={{
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      marginTop: "-80px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }}>
      <Image
        src="/images/hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.90) 100%)",
        zIndex: 0,
      }} />

      {/* Content */}
      <div className="imani-hero-content" style={{
        position: "relative",
        zIndex: 1,
        padding: "80px 40px 64px",
        maxWidth: "1100px",
      }}>
<h1 className="imani-hero-h1" style={{
          fontFamily: "var(--sr)",
          fontSize: "80px",
          fontWeight: 500,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          color: "#FAFAF8",
          whiteSpace: "normal",
          marginBottom: 0,
        }}>
          Capital for businesses<br />
          that are already working.
        </h1>

        <p className="imani-hero-body" style={{
          fontFamily: "var(--in)",
          fontSize: "18px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.65)",
          marginTop: "24px",
          marginBottom: 0,
        }}>
          We connect vetted investors with revenue generating businesses through structured financing.<br />
No speculation. No guesswork.<br />
Just real businesses, real numbers, and disciplined capital.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "32px" }}>
          <Link
            href="/signup"
            className="imani-btn-primary"
            style={{
              fontFamily: "var(--in)",
              fontSize: "16px",
              color: "var(--cream)",
              backgroundColor: "#C4693A",
              padding: "10px 22px",
              textDecoration: "none",
              letterSpacing: "0.04em",
              display: "inline-block",
            }}
          >
            Apply for funding
          </Link>
          <Link
            href="/opportunities"
            className="imani-btn-ghost"
            style={{
              fontFamily: "var(--in)",
              fontSize: "16px",
              color: "#FAFAF8",
              padding: "10px 22px",
              textDecoration: "none",
              letterSpacing: "0.04em",
              display: "inline-block",
              backgroundColor: "transparent",
            }}
          >
            Explore Investment opportunities →
          </Link>
        </div>
      </div>

      <HeroTicker />
    </section>
  );
}
