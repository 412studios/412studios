"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const studioAImages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 30, 31, 32, 33].map(
  (n) => `/images/studios/studioa/412 Studio-${n}.jpg`
);
const studioBImages = [22, 23, 24, 25, 26, 27, 28, 29].map(
  (n) => `/images/studios/studiob/412 Studio-${n}.jpg`
);
const studioCImages = [54, 55, 56, 60, 61, 62, 63, 64].map(
  (n) => `/images/studios/studioc/412 Studio-${n}.jpg`
);
const studioImages = [...studioAImages, ...studioBImages, ...studioCImages];

export function StudiosCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollByAmount = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Convert vertical wheel deltas into horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("scroll", updateButtons, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    updateButtons();
    return () => {
      el.removeEventListener("scroll", updateButtons);
      el.removeEventListener("wheel", onWheel);
    };
  }, [updateButtons]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {studioImages.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 h-[60vh] aspect-[3/2] bg-muted overflow-hidden"
          >
            <Image
              src={src}
              alt={`412 Studio ${i + 1}`}
              fill
              sizes="(max-width: 768px) 90vw, 60vw"
              className="object-cover select-none pointer-events-none"
              priority={i < 2}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        disabled={!canPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 border border-foreground/20 hover:bg-[#FFD60A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        disabled={!canNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 border border-foreground/20 hover:bg-[#FFD60A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
