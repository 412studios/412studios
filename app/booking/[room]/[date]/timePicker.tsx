"use client";
import * as React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { timeSlots } from "../../timeSlots";
import { prices } from "../../prices";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TimePicker(context: any) {
  noStore();

  const [selList, setSelList] = React.useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = React.useState<number[]>([]);

  React.useEffect(() => {
    const initialBookedTimes = Array.isArray(context.bookings)
      ? context.bookings
      : [];
    setBookedTimes(initialBookedTimes);
    setSelList([]);
  }, [context]);

  const handleClick = (id: number) => {
    setSelList((prevSelList) => {
      // If booked, don't add
      if (bookedTimes.includes(id)) {
        return prevSelList;
      }

      const sortedList = Array.from(new Set([...prevSelList, id])).sort(
        (a, b) => a - b,
      );

      let min = sortedList[0];
      let max = sortedList[sortedList.length - 1];

      if (id >= min) {
        max = id;
      } else {
        min = id;
      }

      const fullList = [];
      for (let i = min; i <= max; i++) {
        if (bookedTimes.includes(i)) {
          return [id];
        }
        fullList.push(i);
      }

      return fullList;
    });
  };

  const clearBtn = () => {
    setSelList(() => {
      return [];
    });
  };

  return (
    <div className="m-4">
      <CardHeader>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <CardTitle>Room {context.room}</CardTitle>
            <CardDescription>
              Hourly Rate: ${prices[context.room - 1].hourlyRate}.00 CAD
            </CardDescription>
            <CardDescription>
              Daily Rate: ${prices[context.room - 1].dayRate}.00 CAD
            </CardDescription>
          </div>
          <Link href={`/booking/${context.room}/`}>
            <Button>Back</Button>
          </Link>
        </div>

        {bookedTimes.length <= 1 && (
          <Link href={`/booking/${context.room}/${context.date}/0823`}>
            <Button className="mt-4 w-full">Book Full Day</Button>
          </Link>
        )}
      </CardHeader>

      <CardContent>
        <div className="my-4">
          <div className="mx-auto flex h-full max-h-80 max-w-screen-md flex-col overflow-y-scroll rounded-md border p-2">
            {timeSlots.map((slot: any) => (
              <div
                key={slot.id}
                onClick={() => handleClick(slot.id)}
                className={`my-1 rounded border-2 p-2 text-center hover:cursor-pointer ${
                  bookedTimes.includes(slot.id)
                    ? "bg-rose-600"
                    : selList.includes(slot.id)
                      ? "bg-green-600 text-black"
                      : "bg-card"
                }`}
              >
                <span>{slot.displayName}</span>
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-screen-md p-2">
            <div className="text-center">
              <div>
                {selList.length > 1
                  ? `${timeSlots[selList[0]].displayName.split("-")[0]} - ${timeSlots[selList[selList.length - 1]].displayName.split("-")[1]}`
                  : selList.length === 1
                    ? `${timeSlots[selList[0]].displayName}`
                    : "No selection"}
              </div>
            </div>
          </div>
        </div>
        <Button className="mb-4 w-full" onClick={clearBtn}>
          Clear selection
        </Button>
      </CardContent>

      <CardFooter>
        {selList.length >= 2 ? (
          <Link
            className="w-full"
            href={`/booking/${context.room}/${context.date}/${timeSlots[selList[0]].startTime + timeSlots[selList[selList.length - 1]].startTime}`}
          >
            <Button className="w-full">Book Now</Button>
          </Link>
        ) : (
          <Button className="w-full">Please select a minimum of 2 hours</Button>
        )}
      </CardFooter>
    </div>
  );
}
