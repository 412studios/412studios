"use client";

import { useEffect, useState } from "react";

export function Banner() {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }

    const handleResize = () => {
      const nav = document.getElementById("main-nav");
      if (nav) {
        setNavHeight(nav.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="home"
      style={{ marginTop: -navHeight }}
      className="relative w-full h-screen overflow-hidden"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src="/videos/412-vid.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
