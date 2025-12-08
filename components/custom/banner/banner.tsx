"use client";

import { useEffect, useRef, useState } from "react";

interface BannerProps {
  imageSrc?: string;
}

export function Banner({ imageSrc }: BannerProps) {
  const [navHeight, setNavHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);
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

  // Update Toronto time and check if it's daytime
  useEffect(() => {
    const updateTimeAndDaylight = () => {
      const now = new Date();

      // Format time for display
      const torontoTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setCurrentTime(torontoTime);

      // Get current hour in Toronto
      const torontoHour = parseInt(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          hour12: false,
        }).format(now)
      );

      // Simple sunrise/sunset approximation for Toronto
      // Sunrise around 7 AM, sunset around 7 PM (this is approximate)
      // For more accuracy, you could use a library like suncalc
      const month = parseInt(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Toronto",
          month: "2-digit",
        }).format(now)
      );

      // Approximate sunrise and sunset times by month for Toronto
      let sunrise = 7;
      let sunset = 19;

      if (month >= 4 && month <= 9) {
        // Spring/Summer: earlier sunrise, later sunset
        sunrise = 6;
        sunset = 20;
      } else if (month === 11 || month === 12 || month === 1) {
        // Winter: later sunrise, earlier sunset
        sunrise = 7.5;
        sunset = 17;
      }

      setIsDaytime(torontoHour >= sunrise && torontoHour < sunset);
    };

    updateTimeAndDaylight(); // Initial update
    const interval = setInterval(updateTimeAndDaylight, 1000);

    return () => clearInterval(interval);
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

    centerScroll();
    window.addEventListener("resize", centerScroll);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (momentumID !== null) cancelAnimationFrame(momentumID);
      window.removeEventListener("resize", centerScroll);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Determine which image to use
  const displayImage = imageSrc || (isDaytime ? "/renders/lounge-day.png" : "/renders/lounge-night.png");

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
            backgroundImage: `url(${displayImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Time Overlay */}
      <div className="absolute bottom-4 left-4 text-foreground pointer-events-none z-10 border-[1px] p-2 bg-background/20">
        {/* <div className="font-bold tracking-wider">YYZ</div> */}
        <div className="font-bold tracking-wider leading-tight">412 Richmond St E<br /> Toronto, ON</div>
        <div className="text-sm font-light">{currentTime}</div>
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
