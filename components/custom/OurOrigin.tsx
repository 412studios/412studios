"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STUDIO_YELLOW = "#FFD60A";

const galleryImages = [
  { src: "/images/history/HOUSE OF BALLOONS ART.png", alt: "House of Balloons art" },
  { src: "/images/history/HOUSE OF BALLOONS COLLAGE.png", alt: "House of Balloons collage" },
  { src: "/images/history/THE WEEKND IN STUDIO .png", alt: "The Weeknd in the studio" },
  { src: "/images/history/THE WEEKND IN HALLWAY.png", alt: "The Weeknd in the hallway" },
  { src: "/images/history/WEEKND ART.png", alt: "Weeknd art" },
  { src: "/images/history/POST MALONE ART.png", alt: "Post Malone art" },
];

const story = [
  "Four-One-Two is rooted in a studio with deep historical impact and honours the legacy that came before it.",
  "Formerly known as the House of Balloons, it was where The Weeknd — alongside Doc McKinney and Illangelo — shaped the project that became the “Trilogy” and influenced an entire generation.",
  "Over time, records continued to be created within these walls, including “Circles” by Post Malone and collaborations like “Monster” with Shawn Mendes and Justin Bieber — among many others.",
  "The studio has always been a place where defining work begins.",
  "In 2019, Alec — our founder — entered as an intern under Doc McKinney. These were his early days in the music industry, where he saw firsthand how records are built and how opportunity moves behind the scenes.",
  "During that time, he recognized a clear gap in the system — a lack of structure, clarity and long-term support for young artists and producers trying to build sustainable careers.",
  "That realization became the foundation for 412.",
  "It became clear early on that talent alone wasn’t enough. Without systems and guidance, creativity often struggles to translate into stability.",
  "At a turning point, frustration became action. Instead of operating on the edge of uncertainty, 412 was built as a foundation.",
  "Founded in 2023 and named after the address itself, 412 exists to provide what was missing: Systems. Security. Community. Longevity.",
  "More than a studio, it is an environment of creative freedom — where art is explored, mistakes are welcomed, and there is no strict right or wrong. It is built around world-building and intentional development. Artists are encouraged to experiment and define their identity while operating within structure and purpose.",
  "The mission is simple: Build stability. Create opportunity. Develop talent intentionally.",
  "Our goal is to grow 412 into a strong development hub and a foundational resource for future generations of creatives in Toronto — creating systems, mentorship, and opportunities that support sustainable careers and long-term cultural growth.",
  "Not just preserving legacy. Building the next one.",
];

const REPEAT = 8;
const loopImages = Array.from({ length: REPEAT }, () => galleryImages).flat();

export function OurOrigin() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const handleLoop = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !ready) return;
    const cycleWidth = el.scrollWidth / REPEAT;
    if (cycleWidth <= 0) return;
    const jump = cycleWidth * (REPEAT - 4);
    if (el.scrollLeft >= cycleWidth * (REPEAT - 2)) {
      el.scrollLeft -= jump;
    } else if (el.scrollLeft <= cycleWidth * 2) {
      el.scrollLeft += jump;
    }
  }, [ready]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const init = () => {
      const cycleWidth = el.scrollWidth / REPEAT;
      if (cycleWidth <= 0) return;
      el.scrollLeft = cycleWidth * Math.floor(REPEAT / 2);
      setReady(true);
    };

    const raf = requestAnimationFrame(init);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !ready) return;
    el.addEventListener("scroll", handleLoop, { passive: true });
    return () => el.removeEventListener("scroll", handleLoop);
  }, [ready, handleLoop]);

  const scrollByAmount = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative isolate border-b md:border-b-0 md:border-r flex h-full">
        <div
          ref={scrollRef}
          className="flex w-full h-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {loopImages.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="relative shrink-0 w-1/2 h-full bg-muted"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 25vw, 12vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Previous"
          className="z-10 absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:top-0 md:bottom-0 md:translate-y-0 md:flex md:items-center p-2 md:p-0 md:px-2 bg-black/25 backdrop-blur-sm border md:border-0 md:border-r border-white/15 hover:bg-[#FFD60A] hover:text-black transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 mix-blend-difference" style={{ color: STUDIO_YELLOW }} />
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Next"
          className="z-10 absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:top-0 md:bottom-0 md:translate-y-0 md:flex md:items-center p-2 md:p-0 md:px-2 bg-black/25 backdrop-blur-sm border md:border-0 md:border-l border-white/15 hover:bg-[#FFD60A] hover:text-black transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 mix-blend-difference" style={{ color: STUDIO_YELLOW }} />
        </button>
      </div>
      <div className="p-4 md:p-6">
        <div className="max-h-[420px] md:max-h-[480px] overflow-y-auto pr-2 flex flex-col gap-4 [scrollbar-width:thin]">
          {story.map((paragraph, i) => (
            <p
              key={i}
              className={`leading-relaxed ${
                i === story.length - 1
                  ? "italic font-bold text-xl md:text-2xl tracking-wider mt-2"
                  : "text-base md:text-lg"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
