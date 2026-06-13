"use client";

const TICKER_ITEMS: Array<{ text: string; tag?: string }> = [
  { text: "Fundora HQ",             tag: "Funded" },
  { text: "Kidcode",                tag: "Funded" },
  { text: "My Little Big Surprise", tag: "Funded" },
  { text: "Rent & Rig Limited",     tag: "Funded" },
  { text: "Equity" },
  { text: "Debt" },
  { text: "Asset financing" },
  { text: "Revenue-based" },
];

function TickerItem({ text, tag }: { text: string; tag?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0 32px" }}>
      <span style={{
        fontFamily: "var(--sr)",
        fontSize: "12px",
        fontWeight: 300,
        color: "#FFFFFF",
      }}>
        {text}
      </span>
      {tag && (
        <span style={{
          fontFamily: "var(--in)",
          fontSize: "10px",
          backgroundColor: "#1A3D2F",
          color: "#FFFFFF",
          padding: "2px 7px",
          marginLeft: "8px",
        }}>
          {tag}
        </span>
      )}
      <span style={{ color: "#FFFFFF", marginLeft: "32px", fontSize: "14px" }}>·</span>
    </span>
  );
}

export default function TickerStrip() {
  return (
    <div style={{
      backgroundColor: "#CF9A0A",
      padding: "13px 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      overflow: "hidden",
    }}>
      {/* Items rendered twice for seamless loop — animation moves -50% of total width */}
      <div className="ticker-track" style={{ whiteSpace: "nowrap" }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <TickerItem key={i} text={item.text} tag={item.tag} />
        ))}
      </div>
    </div>
  );
}
