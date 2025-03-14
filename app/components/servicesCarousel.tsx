"use client";
import { H2, H3, H4, Subtitle } from "@/components/ui/copy";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Services() {
  const services = [
    {
      title: "Studio Rental",
      description: "Hourly and monthly rentals are available.",
    },
    {
      title: "Production",
      description: "Professional production services for your projects.",
    },
    {
      title: "Mixing and Mastering",
      description:
        "Expert mixing and mastering services to perfect your sound.",
    },
    {
      title: "Post Production",
      description: "High-quality post-production services.",
    },
    {
      title: "Photography and Videography",
      description:
        "Creative photography and videography services for various needs.",
    },
  ];

  const [selectedService, setSelectedService] = useState(0);
  const [openMobileItem, setOpenMobileItem] = useState<number | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [displayedService, setDisplayedService] = useState(services[0]);

  useEffect(() => {
    // Start fade out
    setIsContentVisible(false);

    // After fade out completes, update the content
    const timer = setTimeout(() => {
      setDisplayedService(services[selectedService]);
      // Start fade in
      setIsContentVisible(true);
    }, 300); // This should match the fade-out duration

    return () => clearTimeout(timer);
  }, [selectedService]); // Removed unnecessary dependency: services

  const handleServiceClick = (index: number) => {
    setSelectedService(index);
  };

  const toggleMobileItem = (index: number) => {
    setOpenMobileItem(openMobileItem === index ? null : index);
  };

  return (
    <div className="w-full">
      <H2>SERVICES</H2>
      {/* Desktop layout - visible on lg and above */}
      <div className="hidden lg:grid lg:grid-cols-[1fr,2fr] rounded-xl overflow-hidden mt-8 bg-background/30 backdrop-blur-sm">
        {/* Left side - scrollable service titles */}
        <div className="overflow-y-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className={cn(
                "p-4 cursor-pointer transition-all duration-700 ease-in-out",
                selectedService === index
                  ? "bg-primary/10"
                  : "hover:bg-primary/10"
              )}
              onClick={() => handleServiceClick(index)}
            >
              <H4>{service.title}</H4>
            </div>
          ))}
        </div>
        {/* Right side - service description */}
        <div className="p-8 flex flex-col justify-center duration-700 ease-in-out hover:bg-primary/10 cursor-pointer">
          <div
            className={cn(
              "transition-opacity duration-700 ease-in-out",
              isContentVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <H3>{displayedService.title}</H3>
            <Subtitle>{displayedService.description}</Subtitle>
          </div>
        </div>
      </div>

      {/* Mobile layout - visible on sm and below */}
      <div className="lg:hidden space-y-2 mt-4">
        {services.map((service, index) => (
          <div key={index} className="border rounded-xl overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer duration-700 ease-in-out hover:bg-primary/10 cursor-pointer"
              onClick={() => toggleMobileItem(index)}
            >
              <H4>{service.title}</H4>
              {openMobileItem === index ? (
                <ChevronUp className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
              )}
            </div>

            <div
              className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${
                openMobileItem === index
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
            >
              <div className="p-4 border-t">
                <Subtitle>{service.description}</Subtitle>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
