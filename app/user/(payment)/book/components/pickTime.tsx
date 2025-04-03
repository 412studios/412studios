"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getBooking, getSubWeek } from "@/app/lib/booking";
import {
  timeSlots,
  subscriptionTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";
import { useDashboard } from "../context";
import { BookingApiRecord } from "../types/booking";
import { formatDateToNumeric, fillArrGaps } from "../utils/dateUtils";

export const PickTime = () => {
  const { options, isAdmin, setOptions, handleTimePick, clearTimeSelection } =
    useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [selList, setSelList] = useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = useState<number[]>([]);

  // Memoize derived values
  const isSubscribed = useMemo(
    () => options.subRooms.includes(options.room),
    [options.subRooms, options.room]
  );

  // New: Check if we should use subscription time slots - only when subscribed AND not admin
  const useSubscriptionSlots = useMemo(
    () => isSubscribed && !isAdmin,
    [isSubscribed, isAdmin]
  );

  const formattedDate = useMemo(
    () => formatDateToNumeric(options.date),
    [options.date]
  );

  // Changed: Use time slots based on useSubscriptionSlots rather than just isSubscribed
  const timeArray = useMemo(
    () => (useSubscriptionSlots ? subscriptionTimeSlots : timeSlots),
    [useSubscriptionSlots]
  );

  // Function to process single or range time selection
  const processTimeSelection = useCallback(
    (id: number, selList: number[]) => {
      // Changed: For subscription bookings when not admin, select only one slot
      if (useSubscriptionSlots) {
        const currentSubscription = options.subscription.find(
          (item) => item.roomId === options.room
        );

        // Check if subscription has enough hours
        if (!currentSubscription || currentSubscription.availableHours < 4) {
          return { newList: selList, update: null };
        }

        // Return single selection
        return {
          newList: [id],
          update: { start: id, end: id, duration: 1 },
        };
      }

      // For standard bookings or admin, handle range selection
      const sortedList = Array.from(new Set([...selList, id])).sort(
        (a, b) => a - b
      );
      const min = Math.min(sortedList[0], id);
      const max = Math.max(sortedList[sortedList.length - 1], id);

      // Build continuous selection list
      const fullList = [];
      for (let i = min; i <= max; i++) {
        if (bookedTimes.includes(i)) {
          // If any slot in range is booked, just select the clicked slot
          return {
            newList: [id],
            update: { start: id, end: id, duration: 1 },
          };
        }
        fullList.push(i);
      }

      // Return full range selection
      return {
        newList: fullList,
        update: {
          start: fullList[0],
          end: fullList[fullList.length - 1],
          duration: fullList.length,
        },
      };
    },
    [bookedTimes, useSubscriptionSlots, options.subscription, options.room]
  );

  // Handle time slot selection
  const handleClick = useCallback(
    (id: number) => {
      if (bookedTimes.includes(id)) return;

      setSelList((prevSelList) => {
        const { newList, update } = processTimeSelection(id, prevSelList);

        // Only update context state if we have a valid selection
        if (update) {
          // Execute in the next event cycle to avoid React batching issues
          setTimeout(() => {
            handleTimePick(update.start, update.end, update.duration);
          }, 0);
        }

        return newList;
      });
    },
    [bookedTimes, processTimeSelection, handleTimePick]
  );

  // Handle clear selection
  const handleClear = useCallback(() => {
    setSelList([]);
    clearTimeSelection();
  }, [clearTimeSelection]);

  // Fetch booking data when date/room changes
  const fetchData = useCallback(async () => {
    if (!options.date) return;

    setIsLoading(true);
    setOptions((prev) => ({ ...prev, loading: true }));

    try {
      // Fetch booking data in parallel
      const [bookings, checkSubWeek] = await Promise.all([
        getBooking(options.room, parseInt(formattedDate)),
        getSubWeek(options.room, parseInt(formattedDate), options.user),
      ]);

      // Process booking data
      let bookedSlots: number[] = [];

      if (useSubscriptionSlots && checkSubWeek) {
        // Weekly limit reached, block all slots
        fillArrGaps(bookedSlots, 0, 3);
      } else if (Array.isArray(bookings)) {
        // Process individual bookings
        bookings.forEach((booking: BookingApiRecord) => {
          const start = useSubscriptionSlots
            ? Math.floor(booking.startTime / 4)
            : booking.startTime;

          const end = useSubscriptionSlots
            ? Math.floor(booking.endTime / 4)
            : booking.endTime;

          fillArrGaps(bookedSlots, start, end);
        });
      }

      // Update state once with all changes
      setBookedTimes(bookedSlots);
      setSelList([]);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookedTimes([]);
      setSelList([]);
    } finally {
      setIsLoading(false);
      setOptions((prev) => ({ ...prev, loading: false }));
    }
  }, [
    options.room,
    options.date,
    options.user,
    formattedDate,
    useSubscriptionSlots,
    setOptions,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // TimeSlot component for better readability
  const TimeSlotItem = useCallback(
    ({
      slot,
      isBooked,
      isSelected,
    }: {
      slot: { id: number; displayName: string };
      isBooked: boolean;
      isSelected: boolean;
    }) => (
      <div
        key={slot.id}
        onClick={() => !isBooked && handleClick(slot.id)}
        className={`flex items-center justify-center text-center hover:cursor-pointer rounded-full
      ${useSubscriptionSlots ? "h-[25%] rounded-lg" : "p-1 my-1"}
      ${
        isBooked
          ? "bg-red-500 text-white"
          : isSelected
          ? "bg-emerald-500 text-black"
          : "bg-background hover:bg-accent"
      }`}
        role="button"
        aria-pressed={isSelected}
        aria-disabled={isBooked}
        tabIndex={isBooked ? -1 : 0}
      >
        <span>{slot.displayName}</span>
      </div>
    ),
    [useSubscriptionSlots, handleClick]
  );

  // Render the time slots list
  const renderTimeSlots = useMemo(
    () =>
      timeArray.map((slot) => {
        const isBooked = bookedTimes.includes(slot.id);
        const isSelected = selList.includes(slot.id);

        return (
          <TimeSlotItem
            key={slot.id}
            slot={slot}
            isBooked={isBooked}
            isSelected={isSelected}
          />
        );
      }),
    [timeArray, bookedTimes, selList, TimeSlotItem]
  );

  return (
    <>
      {isLoading ? (
        <div
          className="flex grow rounded-lg items-center justify-center"
          aria-live="polite"
        >
          <div className="text-center">Loading available time slots...</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 grow rounded-lg">
          <div className="flex flex-grow w-full rounded-lg items-start">
            <div
              className={`border w-full h-[310px] rounded-lg overflow-y-scroll p-2
                  ${
                    useSubscriptionSlots
                      ? "flex justify-center flex-col grow w-full"
                      : ""
                  }`}
              role="listbox"
              aria-label="Available time slots"
            >
              {renderTimeSlots}
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleClear}
            disabled={selList.length === 0}
          >
            CLEAR SELECTION
          </Button>
        </div>
      )}
    </>
  );
};
