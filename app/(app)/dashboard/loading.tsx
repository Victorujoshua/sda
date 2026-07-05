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
      backgroundColor: "rgba(17,17,17,0.06)",
      marginBottom: mb || undefined,
    }}
  />
);

export default function DashboardLoading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--cream)",
        color: "var(--ink)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--hairline)",
          padding: "0 40px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Skel w={40} h={20} />
        <Skel w={64} h={14} />
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 40px" }}>
        <Skel w={80} h={10} mb={16} />
        <Skel w={280} h={38} mb={48} />

        <div
          style={{ border: "1px solid var(--hairline)", padding: 28 }}
        >
          <Skel w={140} h={10} mb={12} />
          <Skel w={220} h={22} mb={8} />
          <Skel w="90%" h={14} mb={6} />
          <Skel w="70%" h={14} mb={24} />
          <Skel w={120} h={36} />
        </div>

        <div
          style={{
            border: "1px solid var(--hairline)",
            padding: "20px 28px",
            marginTop: 24,
          }}
        >
          <Skel w={100} h={10} mb={12} />
          <Skel w="60%" h={14} mb={6} />
          <Skel w="40%" h={14} />
        </div>
      </div>
    </main>
  );
}
