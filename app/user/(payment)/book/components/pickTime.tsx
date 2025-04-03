"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getBooking, getSubWeek } from "@/app/lib/booking";
import {
  timeSlots,
  subscriptionTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";
import { useDashboard } from "../context";
import { BookingRecord, TimeSlot } from "../types/booking";
import { formatDateToNumeric, fillArrGaps } from "../utils/dateUtils";

export const PickTime = () => {
  const { prices, options, setOptions } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [selList, setSelList] = useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = useState<number[]>([]);
  const [existingBookings, setExistingBookings] = useState<number[]>([]);

  // Memoize derived values
  const isSubscribed = useMemo(
    () => options.subRooms.includes(options.room),
    [options.subRooms, options.room]
  );

  const formattedDate = useMemo(
    () => formatDateToNumeric(options.date),
    [options.date]
  );

  const timeArray = useMemo(
    () => (isSubscribed ? subscriptionTimeSlots : timeSlots),
    [isSubscribed]
  );

  useEffect(() => {
    const initialBookedTimes = Array.isArray(existingBookings)
      ? existingBookings
      : [];
    setBookedTimes(initialBookedTimes);
    setSelList([]);
  }, [existingBookings]);

  // Memoize the fetch data function to avoid recreating it on each render
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setOptions((prevOptions) => ({ ...prevOptions, loading: true }));
    try {
      const bookings = await getBooking(options.room, parseInt(formattedDate));
      const checkSubWeek = await getSubWeek(
        options.room,
        parseInt(formattedDate),
        options.user
      );
      let arr: number[] = [];
      let setStart = 0;
      let setEnd = 0;

      if (isSubscribed && checkSubWeek) {
        setStart = 0;
        setEnd = 3;
        fillArrGaps(arr, setStart, setEnd);
      } else {
        bookings.forEach((booking) => {
          if (isSubscribed) {
            setStart = Math.floor(booking.startTime / 4);
            setEnd = Math.floor(booking.endTime / 4);
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
    setOptions((prevOptions) => ({ ...prevOptions, loading: false }));
  }, [options.room, formattedDate, options.user, isSubscribed, setOptions]);

  useEffect(() => {
    if (options.date) {
      fetchData();
    }
  }, [options.date, fetchData]);

  // Use context function
  const { handleTimePick, clearTimeSelection } = useDashboard();

  // Memoize the handleTimePick to avoid recreating it on each render
  const memoizedHandleTimePick = useCallback(
    (start: number, end: number, duration: number) => {
      handleTimePick(start, end, duration);
    },
    [handleTimePick]
  );

  const handleClick = useCallback(
    (id: number) => {
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

        if (isSubscribed) {
          fullList = [id];
          const currentSubscription = options.subscription.find(
            (item) => item.roomId === options.room
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

        // Use the memoized version to avoid unnecessary renders
        setTimeout(() => {
          memoizedHandleTimePick(
            fullList[0],
            fullList[fullList.length - 1],
            fullList.length
          );
        }, 0);

        return fullList;
      });
    },
    [
      bookedTimes,
      isSubscribed,
      options.subscription,
      options.room,
      memoizedHandleTimePick,
    ]
  );

  const clearBtn = useCallback(() => {
    setSelList([]);
    clearTimeSelection();
    setWarning(false);
  }, [clearTimeSelection]);

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
                    isSubscribed
                      ? "flex justify-center flex-col grow w-full"
                      : ""
                  }`}
            >
              {timeArray.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => handleClick(slot.id)}
                  className={`flex items-center justify-center text-center hover:cursor-pointer rounded-full
                  ${isSubscribed ? "h-[25%] rounded-lg" : "p-1 my-1"}
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
