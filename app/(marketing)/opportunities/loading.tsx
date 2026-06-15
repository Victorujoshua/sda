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
      backgroundColor: "rgba(255,255,255,0.06)",
      marginBottom: mb || undefined,
    }}
  />
);

export default function OpportunitiesLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "72px 40px" }}>
        <Skel w={180} h={10} mb={12} />
        <Skel w={220} h={42} mb={16} />
        <Skel w={460} h={15} mb={8} />
        <Skel w={360} h={15} mb={48} />

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ width: 180, height: 38, backgroundColor: "var(--surface)" }}
          />
          <div
            style={{ width: 120, height: 38, backgroundColor: "var(--surface)" }}
          />
          <div
            style={{ width: 120, height: 38, backgroundColor: "var(--surface)" }}
          />
          <div
            style={{ width: 80, height: 38, backgroundColor: "var(--surface)" }}
          />
        </div>

        {/* Count */}
        <div
          style={{
            width: 100,
            height: 13,
            backgroundColor: "var(--surface)",
            marginBottom: 24,
          }}
        />

        {/* Card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 1,
            backgroundColor: "var(--border)",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--paper)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <Skel w={64} h={20} mb={16} />
              <Skel w="80%" h={20} mb={12} />
              <Skel w="100%" h={14} mb={6} />
              <Skel w="90%" h={14} mb={6} />
              <Skel w="60%" h={14} mb={24} />
              <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <div>
                  <Skel w={48} h={10} mb={6} />
                  <Skel w={80} h={16} />
                </div>
                <div>
                  <Skel w={72} h={10} mb={6} />
                  <Skel w={80} h={16} />
                </div>
              </div>
              <Skel w={100} h={36} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
