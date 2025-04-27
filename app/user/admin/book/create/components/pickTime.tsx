"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getBooking, getSubscriptionWeek } from "@/app/lib/booking";
import {
  timeSlots,
  subscriptionTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";

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

  const isSubscription = options.subscriptionRooms.includes(
    parseInt(options.room)
  );
  const formattedDate = parseInt(formatDateToNumeric(options.date));
  const timeArray = isSubscription ? subscriptionTimeSlots : timeSlots;

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
        const bookings = await getBooking(options.room, formattedDate);
        const checkSubscriptionWeek = await getSubscriptionWeek(
          options.room,
          formattedDate,
          options.user
        );
        let arr: any[] = [];
        let setStart = 0;
        let setEnd = 0;

        if (isSubscription && checkSubscriptionWeek) {
          setStart = 0;
          setEnd = 3;
          fillArrGaps(arr, setStart, setEnd);
        } else {
          bookings.forEach((booking: any) => {
            if (isSubscription) {
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

  const handleTimePick = (start: any, end: any, duration: number) => {
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      startTime: start,
      endTime: end,
      duration: duration,
    }));
  };

  const handleClick = (id: number) => {
    if (bookedTimes.includes(id)) {
      return;
    }

    setSelList((prevSelList) => {
      const sortedList = Array.from(new Set([...prevSelList, id])).sort(
        (a, b) => a - b
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

      if (isSubscription) {
        fullList = [id];
        const currentSubscription = options.subscription.find(
          (item: any) => item.roomId === options.room
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

      // This is now outside of the state update function
      setTimeout(() => {
        handleTimePick(
          fullList[0],
          fullList[fullList.length - 1],
          fullList.length
        );
      }, 0);

      return fullList;
    });
  };

  const clearBtn = () => {
    setSelList([]);
    handleTimePick(-1, -1, 0);
    setWarning(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex grow rounded-lg items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 grow rounded-lg">
          <div className="flex flex-grow w-full rounded-lg items-start">
            <div
              className={`border w-full h-[310px] rounded-lg overflow-y-scroll p-2
                  ${
                    isSubscription
                      ? "flex justify-center flex-col grow w-full"
                      : ""
                  }`}
            >
              {timeArray.map((slot: any) => (
                <div
                  key={slot.id}
                  onClick={() => handleClick(slot.id)}
                  className={`flex items-center justify-center text-center hover:cursor-pointer rounded-full
                  ${isSubscription ? "h-[25%] rounded-lg" : "p-1 my-1"}
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
          </div>
          <Button className="w-full" onClick={clearBtn}>
            CLEAR SELECTION
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
