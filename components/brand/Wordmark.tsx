import Link from "next/link";

type WordmarkProps = {
  variant?: "default" | "inverse";
  size?: number;
};

export default function Wordmark({ variant = "default", size = 20 }: WordmarkProps) {
  const color = variant === "inverse" ? "var(--cream)" : "var(--ink)";

  return (
    <Link
      href="/"
      style={{
        fontFamily: "'Satoshi', system-ui, sans-serif",
        fontSize: size,
        fontWeight: 700,
        fontStyle: "normal",
        color,
        textDecoration: "none",
        letterSpacing: "-0.01em",
        display: "inline-block",
        lineHeight: 1,
      }}
    >
      Imani Ventures
    </Link>
  );
}
