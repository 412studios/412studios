"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
export const PickRoom = ({
  prices,
  options,
  setOptions,
}: {
  prices: any;
  options: any;
  setOptions: any;
}) => {
  const handleRoomPick = (roomNumber: number) => {
    setOptions({
      ...options,
      room: roomNumber,
      date: new Date(),
      startTime: -1,
      endTime: -1,
      duration: 0,
    });
  };
  return (
    <div className="flex flex-col md:flex-row">
      {prices.map((element: any) => (
        <div className="w-full p-2" key={element.id}>
          <Card>
            <CardHeader>
              <CardTitle>Studio {element.room}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={`/images/${element.img}`}
                alt={`Studio ${element.id}`}
                width={1000}
                height={9}
                className="mx-auto rounded-sm"
              />
              <div className="mt-6">
                <CardDescription>
                  Daily Rate: {prices[element.id].dayRate}
                </CardDescription>
                <CardDescription>
                  Hourly Rate: {prices[element.id].hourlyRate}
                </CardDescription>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleRoomPick(element.id)}
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};
