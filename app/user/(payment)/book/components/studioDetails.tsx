"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CardDescription } from "@/components/ui/card";
import { H4 } from "@/components/ui/copy";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselControls,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDashboard } from "../context";

export const StudioDetails = () => {
  const { prices: data } = useDashboard();
  const { options, onRoomSelect } = useDashboard();
  const handleButtonClick = (e: any) => {
    const value = e.currentTarget.value;
    onRoomSelect(value);
  };

  return (
    <section className="my-4">
      <H4>STUDIOS</H4>
      <div className="hidden md:flex flex-col md:flex-row p-4 gap-4 border rounded-lg">
        {Object.values(data).map((element: any) => (
          <div key={element.id} className="w-full md:w-1/3 flex flex-col gap-2">
            <Image
              src={`/images/${element.img}`}
              alt={`Studio ${element.id}`}
              width={1000}
              height={9}
              className="mx-auto w-full max-w-screen-md rounded-xl"
            />
            <Button
              onClick={handleButtonClick}
              value={element.id}
              className={`w-full mt-2 ${
                options.room == element.id ? "bg-orange-500" : ""
              }`}
            >
              Studio {element.room}
            </Button>
            <CardDescription>
              <span className="whitespace-nowrap">
                Hourly rate: {element.hourlyRate}
              </span>
              <span className="whitespace-nowrap mx-2">|</span>
              <span className="whitespace-nowrap">
                Day rate: {element.dayRate}
              </span>
            </CardDescription>
            <CardDescription>
              <Link href={`/user/membership/${element.id}`} className="w-full">
                Purchase Membership
              </Link>
            </CardDescription>
          </div>
        ))}
      </div>

      <div className="block md:hidden p-4 gap-8 border rounded-lg">
        <Carousel className="w-full" showDots={true}>
          <CarouselContent className="border-0">
            {Object.values(data).map((element: any) => (
              <CarouselItem key={element.id}>
                <div className="flex flex-col gap-2">
                  <Image
                    src={`/images/${element.img}`}
                    alt={`Studio ${element.id}`}
                    width={1000}
                    height={9}
                    className="mx-auto w-full max-w-screen-md rounded-xl"
                  />
                  <Button
                    onClick={handleButtonClick}
                    value={element.id}
                    className={`w-full mt-2 ${
                      options.room == element.id ? "bg-orange-500" : ""
                    }`}
                  >
                    Studio {element.room}
                  </Button>
                  <CardDescription>
                    <span className="whitespace-nowrap">
                      Hourly rate: {element.hourlyRate}
                    </span>
                    <span className="whitespace-nowrap mx-2">|</span>
                    <span className="whitespace-nowrap">
                      Day rate: {element.dayRate}
                    </span>
                  </CardDescription>
                  <CardDescription>
                    <Link
                      href={`/user/membership/${element.id}`}
                      className="w-full"
                    >
                      Purchase Membership
                    </Link>
                  </CardDescription>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls />
        </Carousel>
      </div>
    </section>
  );
};
3;
