const Skel = ({
  w,
  h,
  mb = 0,
}: {
  w: number | string;
  h: number;
  mb?: number;
}) => (
  <div
    style={{
      width: w,
      height: h,
      backgroundColor: "var(--surface)",
      marginBottom: mb || undefined,
    }}
  />
);

const ROW_WIDTHS = ["55%", "20%", "15%", "15%", "14%", "12%"] as const;

export default function ApplicationsLoading() {
  return (
    <div style={{ padding: "48px 40px" }}>
      <Skel w={48} h={10} mb={12} />
      <Skel w={200} h={32} mb={32} />

      {/* Filter row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        <Skel w={200} h={38} />
        <Skel w={160} h={38} />
        <Skel w={160} h={38} />
        <Skel w={80} h={38} />
      </div>

      {/* Count line */}
      <Skel w={100} h={13} mb={16} />

      {/* Header row */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 0,
          padding: "10px 12px",
        }}
      >
        {ROW_WIDTHS.map((w, i) => (
          <div key={i} style={{ width: w, paddingRight: 16 }}>
            <Skel w="60%" h={10} />
          </div>
        ))}
      </div>

      {/* Data rows */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: 0,
            padding: "14px 12px",
            alignItems: "center",
          }}
        >
          <div style={{ width: ROW_WIDTHS[0], paddingRight: 16 }}>
            <Skel w="80%" h={14} mb={6} />
            <Skel w="60%" h={11} />
          </div>
          {ROW_WIDTHS.slice(1).map((w, j) => (
            <div key={j} style={{ width: w, paddingRight: 16 }}>
              <Skel w="70%" h={13} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
