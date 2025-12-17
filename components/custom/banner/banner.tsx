"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { rooms } from "./rooms";
import { TimeDisplay } from "./TimeDisplay";

export function Banner() {
  const [navHeight, setNavHeight] = useState(0);
  const [isDaytime, setIsDaytime] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState("Studio A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Drag state (refs so we don't re-render on every pointermove)
  const isDraggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const applyTransform = () => {
    const el = contentRef.current;
    if (!el) return;
    const { x, y } = offsetRef.current;

    // Centered + draggable offset
    el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  };

  const computeBounds = () => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;

    // Size of the draggable content
    const cw = content.offsetWidth;
    const ch = content.offsetHeight;

    // How far you can move from center before an edge would leave the viewport
    const maxX = Math.max(0, (cw - vw) / 2);
    const maxY = Math.max(0, (ch - vh) / 2);

    boundsRef.current = {
      minX: -maxX,
      maxX: maxX,
      minY: -maxY,
      maxY: maxY,
    };

    // If resizing made the current offset invalid, clamp it
    offsetRef.current.x = clamp(
      offsetRef.current.x,
      boundsRef.current.minX,
      boundsRef.current.maxX
    );
    offsetRef.current.y = clamp(
      offsetRef.current.y,
      boundsRef.current.minY,
      boundsRef.current.maxY
    );
    applyTransform();
  };

  // Track nav height
  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.getElementById("main-nav");
      setNavHeight(nav?.offsetHeight ?? 0);
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Check if it's daytime in Toronto
  useEffect(() => {
    const updateDaylight = () => {
      const now = new Date();
      const torontoHour = parseInt(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          hour12: false,
        }).format(now)
      );

      const month = parseInt(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Toronto",
          month: "2-digit",
        }).format(now)
      );

      let sunrise = 7;
      let sunset = 19;

      if (month >= 4 && month <= 9) {
        sunrise = 6;
        sunset = 20;
      } else if (month === 11 || month === 12 || month === 1) {
        sunrise = 7.5;
        sunset = 17;
      }

      setIsDaytime(torontoHour >= sunrise && torontoHour < sunset);
    };

    updateDaylight();
    const interval = setInterval(updateDaylight, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Initial layout: center content + compute bounds
  useLayoutEffect(() => {
    // start centered
    offsetRef.current = { x: 0, y: 0 };
    applyTransform();
    computeBounds();

    const onResize = () => computeBounds();
    window.addEventListener("resize", onResize);

    // If your content changes size for any reason (fonts/images), this helps too
    const ro = new ResizeObserver(() => computeBounds());
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (contentRef.current) ro.observe(contentRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // Don't start drag if clicking on a link
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      return;
    }

    // Only left mouse button (but allow touch/pen)
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDraggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    startOffsetRef.current = { ...offsetRef.current };

    viewport.setPointerCapture(e.pointerId);
    // prevent text selection / native drag
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    const nextX = startOffsetRef.current.x + dx;
    const nextY = startOffsetRef.current.y + dy;

    offsetRef.current.x = clamp(nextX, boundsRef.current.minX, boundsRef.current.maxX);
    offsetRef.current.y = clamp(nextY, boundsRef.current.minY, boundsRef.current.maxY);

    applyTransform();
  };

  const endDrag = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      viewportRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleRoomSelect = (roomName: string) => {
    setSelectedRoom(roomName);
    setIsDropdownOpen(false);
  };

  const currentRoom = rooms.find((room) => room.name === selectedRoom) || rooms[0];
  const displayImage = isDaytime ? currentRoom.dayImage : currentRoom.nightImage;

  return (
    <section
      id="home"
      style={{ marginTop: -navHeight }}
      className="relative w-full h-screen overflow-hidden"
    >
      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          // Important: stops mobile browser “scroll/pan” so your drag always works
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={contentRef}
          className="absolute left-1/2 top-1/2 aspect-video min-w-full min-h-full flex items-center justify-center"
          style={{
            // We control transform in JS for smooth drag
            willChange: "transform",
            transform: "translate(-50%, -50%) translate(0px, 0px)",
            // IMAGE PART
            backgroundImage: `url(${displayImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Interactive Link Dots */}
          {currentRoom.links && currentRoom.links.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {currentRoom.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="absolute pointer-events-auto group"
                  style={{
                    left: `${link.x}%`,
                    top: `${link.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Pulsing dot */}
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-4 h-4 bg-white/40 rounded-full animate-ping" />
                  </div>
                  {/* Label on hover */}
                  <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-background/90 text-foreground px-3 py-1 rounded-sm text-sm font-medium border border-foreground/20">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Room Selector Dropdown */}
      <div
        ref={dropdownRef}
        className="absolute left-4 z-10 pointer-events-auto"
        style={{ top: `${navHeight + 16}px` }}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="p-2 bg-background/20 border-[1px] border-foreground/20 text-foreground hover:bg-background/30 transition-colors"
        >
          <span className="font-bold">{selectedRoom}</span>
        </button>

        <div
          className={`absolute top-full left-0 mt-1 min-w-[150px] bg-background/20 backdrop-blur-md border-[1px] border-foreground/20 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-0"
          }`}
        >
          {rooms.map((room) => (
            <button
              key={room.name}
              onClick={() => handleRoomSelect(room.name)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-foreground/10 transition-colors ${
                selectedRoom === room.name ? "bg-foreground/20 font-medium" : ""
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {/* Time and Location Display */}
      <TimeDisplay />
    </section>
  );
}
