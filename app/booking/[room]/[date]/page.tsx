"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { getBooking } from "@/app/lib/booking";
import TimePicker from "./timePicker";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Booking {
  roomId: number;
  date: number;
  startTime: number;
  endTime: number;
}

export default function Page(context: any) {
  noStore();

  const [existingBookings, setExistingBookings] = useState<Booking[] | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await getBooking(
          parseInt(context.params.room),
          parseInt(context.params.date),
        );
        setExistingBookings(bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setExistingBookings([]);
      }
    };
    fetchData();
  }, [context.params.room, context.params.date]);

  //Populate booking array
  const bookedTimeSlots: number[] = [];
  existingBookings?.forEach((element) => {
    bookedTimeSlots.push(element.startTime, element.endTime);
    for (let time = element.startTime + 1; time < element.endTime; time++) {
      bookedTimeSlots.push(time);
    }
  });
  bookedTimeSlots.sort((a: number, b: number) => a - b);
  // console.log(bookedTimeSlots);
  return (
    <main className="p-8">
      <div className="mx-auto max-w-screen-md">
        <Card>
          <TimePicker
            bookings={bookedTimeSlots}
            room={context.params.room}
            date={context.params.date}
          />
        </Card>
      </div>
    </main>
  );
}
