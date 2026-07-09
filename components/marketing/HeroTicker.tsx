"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const LOGOS = [
  { name: "Rent & Rig", src: "/images/rent and rig color.png" },
  { name: "Kidcode", src: "/images/Kidcode color.png" },
  { name: "Fundora", src: "/images/Fundora color.png" },
];

function LogoTile({ name, src, suffix }: { name: string; src: string; suffix: string }) {
  return (
    <div
      key={`${name}-${suffix}`}
      style={{
        minWidth: "7.2rem",
        width: "15vw",
        minHeight: "5.25rem",
        padding: "1.4rem 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid var(--hairline)",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", width: "75%", maxWidth: "140px", height: "45px" }}>
        <Image
          src={src}
          alt={name}
          fill
          sizes="200px"
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

const REPEATED_LOGOS = [...LOGOS, ...LOGOS, ...LOGOS];

function TileSet({ suffix }: { suffix: string }) {
  return (
    <>
      {REPEATED_LOGOS.map((logo, i) => (
        <LogoTile key={`${logo.name}-${i}-${suffix}`} {...logo} suffix={`${i}-${suffix}`} />
      ))}
    </>
  );
}

export default function HeroTicker() {
  const stripRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const measure = () => {
      if (firstSetRef.current) {
        setWidthRef.current = firstSetRef.current.getBoundingClientRect().width;
      }
    };

    measure();

    const tick = () => {
      const strip = stripRef.current;
      if (!strip) return;
      offsetRef.current -= 0.5;
      if (setWidthRef.current > 0 && offsetRef.current <= -setWidthRef.current) {
        offsetRef.current += setWidthRef.current;
      }
      strip.style.transform = `translateX(${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
      <div
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.4)",
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingLeft: "40px",
          paddingRight: "40px",
          textAlign: "center",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--sr)",
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          Businesses we have funded
        </span>
      </div>
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          background: "rgba(255,255,255,0.4)",
          height: "84px",
        }}
      >
        <div
          ref={stripRef}
          style={{ display: "flex", height: "100%", willChange: "transform" }}
        >
          <div ref={firstSetRef} style={{ display: "flex", height: "100%", flexShrink: 0 }}>
            <TileSet suffix="a" />
          </div>
          <div aria-hidden="true" style={{ display: "flex", height: "100%", flexShrink: 0 }}>
            <TileSet suffix="b" />
          </div>
        </div>
      </div>
    </div>
  );
}
