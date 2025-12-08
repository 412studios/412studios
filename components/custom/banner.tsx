"use client";

import { useEffect, useRef, useState } from "react";

interface BannerProps {
  imageSrc?: string;
}

export function Banner({ imageSrc = "/renders/lounge-day.png" }: BannerProps) {
  const [navHeight, setNavHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // Drag-to-scroll + momentum logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let momentumID: number | null = null;

    const centerScroll = () => {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      container.scrollLeft = (scrollWidth - clientWidth) / 2;
      container.scrollTop = (scrollHeight - clientHeight) / 2;
    };

    const momentumLoop = () => {
      if (
        !isDown &&
        (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5)
      ) {
        container.scrollLeft -= velocityX;
        container.scrollTop -= velocityY;
        velocityX *= 0.95;
        velocityY *= 0.95;
        momentumID = window.requestAnimationFrame(momentumLoop);
      } else if (!isDown) {
        velocityX = 0;
        velocityY = 0;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      velocityX = 0;
      velocityY = 0;
      if (momentumID !== null) cancelAnimationFrame(momentumID);
      container.style.cursor = "grabbing";
      startX = e.pageX - container.offsetLeft;
      startY = e.pageY - container.offsetTop;
      lastX = startX;
      lastY = startY;
      scrollLeft = container.scrollLeft;
      scrollTop = container.scrollTop;
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        container.style.cursor = "grab";
        momentumID = window.requestAnimationFrame(momentumLoop);
      }
    };

    const handleMouseUp = () => {
      if (isDown) {
        isDown = false;
        container.style.cursor = "grab";
        momentumID = window.requestAnimationFrame(momentumLoop);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;
      const walkX = (x - startX) * 2;
      const walkY = (y - startY) * 2;
      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
      velocityX = (x - lastX) * 2;
      velocityY = (y - lastY) * 2;
      lastX = x;
      lastY = y;
    };

    // Prevent scroll wheel/trackpad from moving the container
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    centerScroll();
    window.addEventListener("resize", centerScroll);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (momentumID !== null) cancelAnimationFrame(momentumID);
      window.removeEventListener("resize", centerScroll);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section
      id="home"
      style={{ marginTop: -navHeight }}
      className="relative w-full h-screen overflow-hidden"
    >
      <div ref={containerRef} className="img-container">
        <div
          className="img-inner"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <style jsx>{`
        .img-container {
          height: 100vh;
          width: 100%;
          overflow: scroll;
          cursor: grab;
          user-select: none;

          /* hide scrollbars everywhere */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE + Edge */
        }

        .img-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        .img-inner {
          min-height: 100vh;
          min-width: 100vh;
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </section>
  );
}
