"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LOGOS = [
  {
    name: "Rent & Rig",
    white: "/images/rent and rig white.png",
    color: "/images/rent and rig color.png",
  },
  {
    name: "Kidcode",
    white: "/images/Kidcode white.png",
    color: "/images/Kidcode color.png",
  },
  {
    name: "Fundora",
    white: "/images/Fundora white.png",
    color: "/images/Fundora color.png",
  },
];

function LogoTile({
  name,
  white,
  color,
  suffix,
}: {
  name: string;
  white: string;
  color: string;
  suffix: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      key={`${name}-${suffix}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: "12rem",
        width: "25vw",
        minHeight: "8.75rem",
        padding: "1.4rem 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid rgba(255,255,255,0.10)",
        cursor: "default",
        flexShrink: 0,
        backgroundColor: "transparent",
        transition: "background-color 200ms",
      }}
    >
      <div style={{ position: "relative", width: "75%", maxWidth: "200px", height: "64px" }}>
        <Image
          src={white}
          alt={name}
          fill
          sizes="200px"
          priority
          style={{
            objectFit: "contain",
            opacity: hovered ? 0 : 0.50,
            transition: "opacity 200ms",
          }}
        />
        <Image
          src={color}
          alt=""
          aria-hidden
          fill
          sizes="200px"
          style={{
            objectFit: "contain",
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms",
          }}
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
          background: "#5B0D1B",
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingLeft: "40px",
          paddingRight: "0",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--sr)",
            fontWeight: 500,
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--cream)",
          }}
        >
          Businesses we have funded
        </span>
      </div>
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          background: "#5B0D1B",
          height: "140px",
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
