"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X, Plus } from "lucide-react";

const studioAImages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 30, 31, 32, 33].map(
  (n) => `/images/studios/studioa/412 Studio-${n}.jpg`
);
const studioBImages = [22, 23, 24, 25, 26, 27, 28, 29].map(
  (n) => `/images/studios/studiob/412 Studio-${n}.jpg`
);
const studioCImages = [54, 55, 56, 60, 61, 62, 63, 64].map(
  (n) => `/images/studios/studioc/412 Studio-${n}.jpg`
);

const slides = [
  ...studioAImages.map((src) => ({ src, studio: "A" as const })),
  ...studioBImages.map((src) => ({ src, studio: "B" as const })),
  ...studioCImages.map((src) => ({ src, studio: "C" as const })),
];

const studioStartIndex: Record<"A" | "B" | "C", number> = {
  A: 0,
  B: studioAImages.length,
  C: studioAImages.length + studioBImages.length,
};

const STUDIO_YELLOW = "#FFD60A";

export function StudiosCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [currentStudio, setCurrentStudio] = useState<"A" | "B" | "C">("A");
  const [isOpen, setIsOpen] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(true);

  const updateState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

    const center = el.scrollLeft + el.clientWidth / 2;
    const children = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < children.length; i++) {
      const slide = children[i];
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setCurrentStudio(slides[closest].studio);
  }, []);

  const scrollByAmount = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const scrollToStudio = (studio: "A" | "B" | "C") => {
    const el = scrollRef.current;
    if (!el) return;
    const index = studioStartIndex[studio];
    const target = el.children[index] as HTMLElement | undefined;
    if (target) {
      el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("scroll", updateState, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    updateState();
    return () => {
      el.removeEventListener("scroll", updateState);
      el.removeEventListener("wheel", onWheel);
    };
  }, [updateState]);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  return (
    <div className="relative isolate">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map(({ src }, i) => (
          <div
            key={i}
            className="relative shrink-0 h-[60vh] aspect-[3/2] bg-muted overflow-hidden border-r last:border-r-0"
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

      <div
        className={`z-10 absolute bottom-2 left-2 right-12 md:bottom-4 md:left-16 md:right-16 ${
          isDescOpen ? "max-w-2xl" : "max-w-fit"
        } bg-black/25 backdrop-blur-sm border border-white/15 p-2 md:p-3 pointer-events-auto flex items-start gap-2`}
      >
        {isDescOpen && (
          <div className="flex-1 flex flex-col gap-2">
            <p
              className="italic font-bold text-xs md:text-base uppercase tracking-wider leading-snug mix-blend-difference"
              style={{ color: STUDIO_YELLOW }}
            >
              Built for focused creation and collaboration, the space supports artists, producers,
              and writers at every stage of their projects. 412 features 4 fully treated
              professional studios designed for high-quality recording and production.
            </p>
            <Link
              href="/booking"
              className="self-start px-3 py-1 border border-white/30 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#FFD60A] hover:text-black transition-colors mix-blend-difference"
              style={{ color: STUDIO_YELLOW }}
            >
              Book Now
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsDescOpen((v) => !v)}
          aria-label={isDescOpen ? "Minimize description" : "Expand description"}
          className="shrink-0 p-1 hover:bg-[#FFD60A] hover:text-black transition-colors cursor-pointer mix-blend-difference"
          style={{ color: STUDIO_YELLOW }}
        >
          {isDescOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        disabled={!canPrev}
        aria-label="Previous"
        className="z-10 absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:top-0 md:bottom-0 md:translate-y-0 md:flex md:items-center p-2 md:p-0 md:px-2 bg-black/25 backdrop-blur-sm border md:border-0 md:border-r border-white/15 hover:bg-[#FFD60A] hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 mix-blend-difference" style={{ color: STUDIO_YELLOW }} />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        disabled={!canNext}
        aria-label="Next"
        className="z-10 absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:top-0 md:bottom-0 md:translate-y-0 md:flex md:items-center p-2 md:p-0 md:px-2 bg-black/25 backdrop-blur-sm border md:border-0 md:border-l border-white/15 hover:bg-[#FFD60A] hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 mix-blend-difference" style={{ color: STUDIO_YELLOW }} />
      </button>

      <div
        ref={dropdownRef}
        className="z-20 absolute top-2 left-2 md:top-4 md:left-16"
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="bg-black/25 backdrop-blur-sm border border-white/15 px-2 py-1 md:px-3 md:py-2 cursor-pointer"
        >
          <span
            className="inline-flex items-center gap-2 italic font-bold text-2xl md:text-6xl uppercase tracking-wider leading-none mix-blend-difference"
            style={{ color: STUDIO_YELLOW }}
          >
            <span>Studio {currentStudio}</span>
            <ChevronDown
              className={`w-5 h-5 md:w-8 md:h-8 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        <div
          role="listbox"
          className={`absolute top-full left-0 mt-2 min-w-[160px] bg-black/25 backdrop-blur-sm border border-white/15 shadow-lg overflow-hidden transition-all duration-200 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-0"
          }`}
        >
          {(["A", "B", "C"] as const).map((studio) => (
            <button
              key={studio}
              type="button"
              role="option"
              aria-selected={currentStudio === studio}
              onClick={() => scrollToStudio(studio)}
              className={`w-full text-left px-3 py-2 text-base font-bold uppercase tracking-wider hover:bg-[#FFD60A] hover:text-black transition-colors cursor-pointer ${
                currentStudio === studio ? "bg-white/10" : ""
              }`}
              style={{ color: STUDIO_YELLOW }}
            >
              <span className="mix-blend-difference">Studio {studio}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
