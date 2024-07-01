"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const RoomDetails = ({ data }: { data: any }) => {
  return (
    <>
      <div className="w-fill p-4 pt-0">
        {/* Desktop only */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap">
            {data.map((element: any) => (
              <div key={element.id} className="w-full md:w-1/3 p-2">
                <Image
                  src={`/images/${element.img}`}
                  alt={`Studio ${element.id}`}
                  width={1000}
                  height={9}
                  className="mx-auto w-full max-w-screen-md rounded-xl"
                />
                <h3 className="text-2xl font-bold tracking-tight mt-4">
                  Room {element.room}
                </h3>
                <CardDescription>
                  <span className="whitespace-nowrap">
                    Hourly rate: {element.hourlyRate}
                  </span>
                  <span className="whitespace-nowrap mx-2">|</span>
                  <span className="whitespace-nowrap">
                    Day rate: {element.dayRate}
                  </span>
                </CardDescription>
                <Link href={`/pricing/${element.id}`} className="w-full">
                  <Button className="mt-4 w-full">Purchase Membership</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile only */}
        <div className="block lg:hidden">
          <Carousel className="w-full p-2 py-4">
            <CarouselContent className="border-0">
              {data.map((element: any) => (
                <CarouselItem key={element.id}>
                  <div>
                    <h3 className="text-2xl ront-primary font-bold tracking-tight mb-6">
                      Room {element.room}
                    </h3>
                    <Image
                      src={`/images/${element.img}`}
                      alt={`Studio ${element.id}`}
                      width={1000}
                      height={9}
                      className="mx-auto w-full max-w-screen-md rounded-xl"
                    />

                    <CardDescription className="mt-4">
                      <span className="whitespace-nowrap">
                        Hourly rate: {element.hourlyRate}
                      </span>
                      <span className="whitespace-nowrap mx-2">|</span>
                      <span className="whitespace-nowrap">
                        Day rate: {element.dayRate}
                      </span>
                    </CardDescription>
                    <Link href={`/pricing/${element.id}`} className="w-full">
                      <Button className="mt-2 w-full">
                        Purchase Membership
                      </Button>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-3" />
            <CarouselNext className="mr-3" />
          </Carousel>
        </div>
      </div>
    </>
  );
};
