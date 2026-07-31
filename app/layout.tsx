import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://imaniventures.org"),
  title: "Imani Ventures — Micro Angel Investment Platform",
  description:
    "Backing early-stage Nigerian businesses with traction. Apply for funding or explore live opportunities.",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    siteName: "Imani Ventures",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Imani Ventures | Micro Angel Investing Platform in Africa" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ colorScheme: "light" }}
    >
      <head>
        {/* Satoshi — via Fontshare CDN (weights 400, 500, 700) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
        {/* Aileron — via CDNfonts (weight 400). Fontshare/Google Fonts do not carry Aileron. */}
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.cdnfonts.com/css/aileron"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
