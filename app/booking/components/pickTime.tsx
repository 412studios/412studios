import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { getBooking, getSubWeek } from "@/app/lib/booking";
import { timeSlots, subscriptionTimeSlots } from "./timeSlots";

export const PickTime = ({
  prices,
  options,
  setOptions,
}: {
  prices: any;
  options: any;
  setOptions: any;
}) => {
  noStore();

  // FUNCTIONS
  function fillArrGaps(arr: number[], min: number, max: number) {
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }
  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  };

  // VARIABLES
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  let duration = 0;
  let isSubscribed = false;

  const formattedDate = parseInt(formatDateToNumeric(options.date));
  let timeArray: any = [];

  const [selList, setSelList] = React.useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = React.useState<number[]>([]);
  const [existingBookings, setExistingBookings] = React.useState<number[]>([]);

  //Select time options
  if (options.subRooms.includes(parseInt(options.room)) == true) {
    timeArray = subscriptionTimeSlots;
    isSubscribed = true;
  } else {
    timeArray = timeSlots;
    isSubscribed = false;
  }

  React.useEffect(() => {
    const initialBookedTimes = Array.isArray(existingBookings)
      ? existingBookings
      : [];
    setBookedTimes(initialBookedTimes);
    setSelList([]);
  }, [existingBookings]);

  //Pull details from db
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setOptions({ ...options, loading: true });
      try {
        const bookings = await getBooking(
          options.room,
          formattedDate,
          options.user,
        );
        const checkSubWeek = await getSubWeek(
          options.room,
          formattedDate,
          options.user,
        );
        let arr: any[] = [];
        bookings.forEach((booking: any) => {
          let startTime = booking.startTime;
          let endTime = booking.endTime;
          if (isSubscribed == true) {
            //Update time selections if user is subscribed
            startTime = Math.floor(booking.startTime / 4);
            endTime = Math.floor((booking.endTime - 2) / 4);
            if (checkSubWeek == true) {
              //Block available slots if already booked this week.
              startTime = 0;
              endTime = 3;
            } else {
              startTime = Math.floor(booking.startTime / 4);
              endTime = Math.floor((booking.endTime - 2) / 4);
            }
          } else {
            startTime = booking.startTime;
            endTime = booking.endTime;
          }
          fillArrGaps(arr, startTime, endTime);
        });
        setExistingBookings(arr);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setExistingBookings([]);
      }
      setIsLoading(false);
      setOptions({ ...options, loading: false });
    };
    fetchData();
  }, [options.room, formattedDate]);

  //Update on click event
  const handleClick = (id: number) => {
    setSelList((prevSelList) => {
      // If booked, don't add
      if (bookedTimes.includes(id)) {
        return prevSelList;
      }

      // Create a sorted, unique list of selected IDs
      const sortedList = Array.from(new Set([...prevSelList, id])).sort(
        (a, b) => a - b,
      );
      let [min, max] = [sortedList[0], sortedList[sortedList.length - 1]];

      // Update min and max based on clicked ID
      if (id > min) {
        max = id;
      } else {
        min = id;
      }

      // Create a full list of IDs between min and max
      let fullList = [];
      for (let i = min; i <= max; i++) {
        if (bookedTimes.includes(i)) {
          return [id]; // If any of these times are booked, return the single ID
        }
        fullList.push(i);
      }

      // Check subscription hours if applicable
      if (isSubscribed) {
        fullList = [];
        fullList.push(id);

        duration = fullList.length;
        if (options.subscription[options.room]) {
          const checkHours =
            options.subscription[options.room].availableHours - duration * 4;
          duration = checkHours;
          if (checkHours <= -1) {
            setWarning(true);
            return prevSelList;
          } else {
            setWarning(false);
          }
        }
      }
      handleTimePick(fullList[0], fullList[fullList.length - 1], duration);
      return fullList;
    });
  };

  //Handle Change
  const handleTimePick = (start: any, end: any, duration: number) => {
    setOptions({
      ...options,
      startTime: start,
      endTime: end,
      duration: duration,
    });
  };
  const clearBtn = () => {
    setSelList(() => {
      handleTimePick(-1, -1, 0);
      setWarning(false);
      return [];
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="flex h-[340px] w-[80vw] flex-col p-2 md:w-[340px]">
          <div className="flex flex-col overflow-y-scroll rounded border p-2">
            {timeArray.map((slot: any) => (
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
          <Button className="mb-4 mt-auto w-full" onClick={clearBtn}>
            Clear selection
          </Button>
        </div>
      )}
    </>
  );
};
