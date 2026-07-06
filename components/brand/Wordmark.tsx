import Link from "next/link";
import Image from "next/image";

type WordmarkProps = {
  variant?: "default" | "inverse";
  height?: number;
};

export default function Wordmark({ variant = "default", height = 32 }: WordmarkProps) {
  const src = variant === "inverse"
    ? "/images/white%20logo.png"
    : "/images/color%20logo.png";

  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
      <Image
        src={src}
        alt="Imani Ventures"
        height={height}
        width={height * 4}
        style={{ height, width: "auto" }}
        priority
      />
    </Link>
  );
}
