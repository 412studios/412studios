"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { calendar } from "googleapis/build/src/apis/calendar";

export function Banner() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }

    const handleResizeNav = () => {
      const nav = document.getElementById("main-nav");
      if (nav) {
        setNavHeight(nav.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResizeNav);
    return () => window.removeEventListener("resize", handleResizeNav);
  }, []);

  return (
    <section
      id="home"
      style={{ marginTop: -navHeight }}
      className="relative w-full h-screen overflow-hidden border-4"
    >
      <div></div>
    </section>
  );
}
