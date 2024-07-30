"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [selList, setSelList] = useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = useState<number[]>([]);
  const [existingBookings, setExistingBookings] = useState<number[]>([]);

  const isSubscribed = options.subRooms.includes(parseInt(options.room));
  const formattedDate = parseInt(formatDateToNumeric(options.date));
  const timeArray = isSubscribed ? subscriptionTimeSlots : timeSlots;

  useEffect(() => {
    const initialBookedTimes = Array.isArray(existingBookings)
      ? existingBookings
      : [];
    setBookedTimes(initialBookedTimes);
    setSelList([]);
  }, [existingBookings]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setOptions((prevOptions: any) => ({ ...prevOptions, loading: true }));
      try {
        const bookings = await getBooking(
          options.room,
          formattedDate,
        );
        const checkSubWeek = await getSubWeek(
          options.room,
          formattedDate,
          options.user,
        );
        let arr: any[] = [];
        let setStart = 0;
        let setEnd = 0;

        if (isSubscribed && checkSubWeek) {
          setStart = 0;
          setEnd = 3;
          fillArrGaps(arr, setStart, setEnd);
        } else {
          bookings.forEach((booking: any) => {
            if (isSubscribed) {
              setStart = Math.floor(booking.startTime / 4);
              setEnd = Math.floor((booking.endTime - 1) / 4);
            } else {
              setStart = booking.startTime;
              setEnd = booking.endTime;
            }
            fillArrGaps(arr, setStart, setEnd);
          });
        }
        setExistingBookings(arr);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setExistingBookings([]);
      }
      setIsLoading(false);
      setOptions((prevOptions: any) => ({ ...prevOptions, loading: false }));
    };

    if (options.date) {
      fetchData();
    }
  }, [options.date, options.room, options.user, setOptions]);

  const handleClick = (id: number) => {
    setSelList((prevSelList) => {
      if (bookedTimes.includes(id)) {
        return prevSelList;
      }

      const sortedList = Array.from(new Set([...prevSelList, id])).sort(
        (a, b) => a - b,
      );
      let [min, max] = [sortedList[0], sortedList[sortedList.length - 1]];

      if (id > min) {
        max = id;
      } else {
        min = id;
      }

      let fullList = [];
      for (let i = min; i <= max; i++) {
        if (bookedTimes.includes(i)) {
          return [id];
        }
        fullList.push(i);
      }

      if (isSubscribed) {
        fullList = [id];
        const currentSubscription = options.subscription.find(
          (item: any) => item.roomId === options.room,
        );
        if (currentSubscription) {
          const checkHours =
            currentSubscription.availableHours - fullList.length * 4;
          if (checkHours <= -1) {
            setWarning(true);
            return prevSelList;
          } else {
            setWarning(false);
          }
        }
      }
      handleTimePick(
        fullList[0],
        fullList[fullList.length - 1],
        fullList.length,
      );
      return fullList;
    });
  };

  const handleTimePick = (start: any, end: any, duration: number) => {
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      startTime: start,
      endTime: end,
      duration: duration,
    }));
  };

  const clearBtn = () => {
    setSelList([]);
    handleTimePick(-1, -1, 0);
    setWarning(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex h-[355px] w-[80vw] flex-col p-2 md:w-[340px]">
          <div className="flex flex-col border-4 rounded-[8px] p-2 flex-grow">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      ) : (
        <div className="flex h-[355px] w-[80vw] flex-col p-2 md:w-[340px]">
          <div className="flex flex-col overflow-y-scroll border-4 rounded-[8px] p-2 flex-grow">
            {timeArray.map((slot: any) => (
              <div
                key={slot.id}
                onClick={() => handleClick(slot.id)}
                className={`my-1 rounded border-4 text-center hover:cursor-pointer
                  ${isSubscribed ? "p-4" : "p-2"}
                  ${
                    bookedTimes.includes(slot.id)
                      ? "bg-red-500"
                      : selList.includes(slot.id)
                        ? "bg-emerald-500 text-black"
                        : "bg-background hover:bg-accent"
                  }`}
              >
                <span>{slot.displayName}</span>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={clearBtn}>
            Clear selection
          </Button>
        </div>
      )}
    </>
  );
};

function fillArrGaps(arr: number[], min: number, max: number) {
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
}

function formatDateToNumeric(date: Date | undefined): string {
  if (!date) return "";
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return year + month + day;
}
