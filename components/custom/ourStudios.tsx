"use client";
import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { H2, H3, Subtitle, Divider } from "@/components/ui/copy";
import { cn } from "@/lib/utils";

export function OurStudios() {
  const studios = [
    { name: "A", image: "/images/studio-a.jpg" },
    { name: "B", image: "/images/studio-b.jpg" },
    { name: "C", image: "/images/studio-c.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTransition = useCallback(
    (newIndex: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(newIndex);
    },
    [isAnimating]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500); // Match transition duration
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const nextStudio = () => {
    handleTransition((currentIndex + 1) % studios.length);
  };

  const prevStudio = () => {
    handleTransition((currentIndex - 1 + studios.length) % studios.length);
  };

  // Touch handling
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) nextStudio(); // Swipe left
    if (touchStart - touchEnd < -50) prevStudio(); // Swipe right
  };

  return (
    <>
      <H2>STUDIOS</H2>
      <Divider className="my-2" />
      <Subtitle>State-of-the-art recording spaces equipped with modern acoustics.</Subtitle>

      {/* Desktop View */}
      <div className="my-8 hidden md:flex gap-4">
        {studios.map((studio, index) => (
          <StudioCard key={index} studio={studio} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div
        className="my-4 block md:hidden overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {studios.map((studio, idx) => (
            <div key={idx} className="min-w-full">
              <StudioCard studio={studio} />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={prevStudio}
            aria-label="Previous"
            variant="outline"
            size="sm"
            disabled={isAnimating}
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Dot indicators */}
          <div className="flex gap-3">
            {studios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleTransition(idx)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "bg-black w-4" : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to studio ${idx + 1}`}
                disabled={isAnimating}
              />
            ))}
          </div>
          <Button
            onClick={nextStudio}
            aria-label="Next"
            variant="outline"
            size="sm"
            disabled={isAnimating}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <Link href="/booking">
        <Button className="mt-2">PRICING</Button>
      </Link>
    </>
  );
}

const StudioCard = ({ studio }: { studio: { name: string; image: string } }) => (
  <Link href="/booking">
    <div className="flex-grow block">
      <H3 className="mb-2">STUDIO {studio.name}</H3>
      <div className="relative rounded-xl overflow-hidden">
        <Image
          src={studio.image || "/placeholder.svg"}
          alt={`Studio ${studio.name}`}
          height={6186}
          width={9279}
          className="w-full h-auto"
        />

        <div className="absolute bottom-0 h-full w-full transition-all duration-500 opacity-0 hover:opacity-100 cursor-pointer bg-background/30">
          <div className="absolute bottom-0 left-0 w-full p-4">BOOK NOW</div>
        </div>
      </div>
    </div>
  </Link>
);
