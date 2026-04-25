"use client";

import { useEffect, useRef } from "react";

interface PaintRevealProps {
  children: React.ReactNode;
  className?: string;
}

const BRUSH_RADIUS = 120;
const PAINT_COLOR = "#FFD60A";

export function PaintReveal({ children, className = "" }: PaintRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setupCtx = () => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = PAINT_COLOR;
      ctx.fillStyle = PAINT_COLOR;
      ctx.lineWidth = BRUSH_RADIUS;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const prev = document.createElement("canvas");
      prev.width = canvas.width;
      prev.height = canvas.height;
      const prevCtx = prev.getContext("2d");
      if (prevCtx && canvas.width > 0 && canvas.height > 0) {
        prevCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setupCtx();
      if (prev.width > 0 && prev.height > 0) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const last = lastPointRef.current;
      if (last) {
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(point.x, point.y, BRUSH_RADIUS / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      lastPointRef.current = point;
    };

    const onLeave = () => {
      lastPointRef.current = null;
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    return () => {
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative isolate bg-background ${className}`}>
      <style>{`
        .paint-reveal-text, .paint-reveal-text * {
          color: #ffffff !important;
        }
      `}</style>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
      />
      <div className="paint-reveal-text relative" style={{ mixBlendMode: "difference" }}>
        {children}
      </div>
    </div>
  );
}
