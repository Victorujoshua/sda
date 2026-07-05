"use client";

export default function IntroAnimation() {
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#F8EDEB" }}>
      <video
        src="/videos/imani_reel.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
