"use client";

import { useEffect, useState } from "react";

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
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
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:block absolute bottom-4 left-4 text-foreground pointer-events-none z-10 border-[1px] p-2 bg-background/20 border-foreground/20">
      <div className="font-bold tracking-wider leading-tight">
        412 Richmond St E
        <br /> Toronto, ON
      </div>
      <div className="text-sm font-light">{currentTime}</div>
    </div>
  );
}
