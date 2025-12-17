"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface BannerProps {
  imageSrc?: string;
}

export function Banner({ imageSrc }: BannerProps) {
  const [navHeight, setNavHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("Studio A");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [showImage1, setShowImage1] = useState(true);

  const rooms = [
    {
      name: "Studio A",
      dayImage: "/renders/room-a-day.png",
      nightImage: "/renders/room-a-night.png",
      links: [],
    },
    {
      name: "Live Room",
      dayImage: "/renders/live-room-day.png",
      nightImage: "/renders/live-room-night.png",
      links: [],
    },
    {
      name: "Lounge",
      dayImage: "/renders/lounge-day.png",
      nightImage: "/renders/lounge-night.png",
      links: [{ x: 22, y: 38, href: "/booking", label: "Book Now" }],
    },
    {
      name: "Kitchen",
      dayImage: "/renders/kitchen-day.png",
      nightImage: "/renders/kitchen-night.png",
      links: [],
    },
  ];

  // Preload all images to prevent flickering on transitions
  useEffect(() => {
    const preloadImages = () => {
      rooms.forEach((room) => {
        const dayImg = new Image();
        dayImg.src = room.dayImage;
        const nightImg = new Image();
        nightImg.src = room.nightImage;
      });
    };

    preloadImages();
  }, []);

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
      if (!isDown && (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5)) {
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
  const currentRoom = rooms.find((room) => room.name === selectedRoom) || rooms[0];
  const displayImage = imageSrc || (isDaytime ? currentRoom.dayImage : currentRoom.nightImage);

  // Handle image transitions with ping-pong between two image elements
  useEffect(() => {
    // Initialize on first load
    if (!image1) {
      setImage1(displayImage);
      return;
    }

    // Get the currently visible image
    const currentVisibleImage = showImage1 ? image1 : image2;

    // Only transition if the display image is actually different from what's currently visible
    if (displayImage !== currentVisibleImage) {
      if (showImage1) {
        // Image 1 is visible, update image 2 and flip to it
        setImage2(displayImage);
        // Use requestAnimationFrame to ensure the image state is updated before flipping
        requestAnimationFrame(() => {
          setShowImage1(false);
        });
      } else {
        // Image 2 is visible, update image 1 and flip to it
        setImage1(displayImage);
        requestAnimationFrame(() => {
          setShowImage1(true);
        });
      }
    }
  }, [displayImage, image1, image2, showImage1]);

  const handleRoomSelect = (roomName: string) => {
    setSelectedRoom(roomName);
    setIsDropdownOpen(false);
  };

  return (
    <section
      id="home"
      style={{ marginTop: -navHeight }}
      className="relative w-full h-screen overflow-hidden"
    >
      <div ref={containerRef} className="img-container">
        {/* Image layer 1 */}
        <div
          className="img-inner img-layer"
          style={{
            backgroundImage: `url(${image1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: showImage1 ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
        {/* Image layer 2 */}
        <div
          className="img-inner img-layer"
          style={{
            backgroundImage: `url(${image2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: showImage1 ? 0 : 1,
            transition: "opacity 1s ease-in-out",
          }}
        />
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

      {/* Interactive Link Dots */}
      {currentRoom.links && currentRoom.links.length > 0 && (
        <div className="links-container">
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

      {/* Time Overlay */}
      <div className="absolute bottom-4 left-4 text-foreground pointer-events-none z-10 border-[1px] p-2 bg-background/20 border-[1px] border-foreground/20">
        {/* <div className="font-bold tracking-wider">YYZ</div> */}
        <div className="font-bold tracking-wider leading-tight">
          412 Richmond St E<br /> Toronto, ON
        </div>
        <div className="text-sm font-light">{currentTime}</div>
      </div>

      <style jsx>{`
        .img-container {
          height: 100vh;
          width: 100%;
          overflow: scroll;
          cursor: grab;
          user-select: none;
          position: relative;

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
          width: 100%;
          height: 100%;
        }

        .img-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .links-container {
          border: solid red;
          pointer-events: none;
          z-index: 10;
          position: absolute;
          top: 0;
          left: 0;
          height: 300px;
        }
      `}</style>
    </section>
  );
}
