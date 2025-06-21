"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getBooking, getMembershipWeek } from "@/app/lib/booking";
import {
  timeSlots,
  membershipTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";
import { useDashboard } from "../context";
import { BookingApiRecord } from "../types/booking";
import {
  formatDateToNumeric,
  fillArrGaps,
  isTimeSlotAvailable,
} from "../utils/dateUtils";

export const PickTime = () => {
  const {
    options,
    prices,
    isAdmin,
    setOptions,
    handleTimePick,
    clearTimeSelection,
  } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [selList, setSelList] = useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = useState<number[]>([]);

  // Memoize derived values
  const isMembership = useMemo(
    () => options.membershipRooms.includes(options.room),
    [options.membershipRooms, options.room]
  );

  // New: Check if we should use membership time slots - only when membership AND not admin
  const useMembershipSlots = useMemo(
    () => isMembership && !isAdmin,
    [isMembership, isAdmin]
  );

  const formattedDate = useMemo(
    () => formatDateToNumeric(options.date),
    [options.date]
  );

  // Changed: Use time slots based on usemembershipslots rather than just ismembership
  const timeArray = useMemo(
    () => (useMembershipSlots ? membershipTimeSlots : timeSlots),
    [useMembershipSlots]
  );

  // Function to process single or range time selection
  const processTimeSelection = useCallback(
    (id: number, selList: number[]) => {
      // Changed: For membership bookings when not admin, select only one slot
      if (useMembershipSlots) {
        const currentMembership = options.membership.find(
          (item) => item.roomId === options.room
        );

        // Check if membership has enough hours
        if (!currentMembership || currentMembership.availableHours < 4) {
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
    [bookedTimes, useMembershipSlots, options.membership, options.room]
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
      const [bookings, checkMembershipWeek] = await Promise.all([
        getBooking(options.room, parseInt(formattedDate)),
        getMembershipWeek(options.room, parseInt(formattedDate), options.user),
      ]);

      // Process booking data
      let bookedSlots: number[] = [];
      // Check blocked value
      const isRoomBlocked = prices[options.room]?.blocked || false;
      // Catch membership acceptions
      if (useMembershipSlots && checkMembershipWeek && isRoomBlocked) {
        // Weekly limit reached, block all slots
        fillArrGaps(bookedSlots, 0, 3);
      } else if (Array.isArray(bookings)) {
        // Catch if room is blocked
        if (isRoomBlocked) {
          fillArrGaps(bookedSlots, 0, 15);
        } else {
          // Process individual bookings
          bookings.forEach((booking: BookingApiRecord) => {
            const start = useMembershipSlots
              ? Math.floor(booking.startTime / 4)
              : booking.startTime;
            const end = useMembershipSlots
              ? Math.floor(booking.endTime / 4)
              : booking.endTime;
            fillArrGaps(bookedSlots, start, end);
          });
        }
      }

      // Add slots that are less than 2 hours in advance to bookedSlots
      if (options.date) {
        const isToday =
          new Date(options.date).toDateString() === new Date().toDateString();

        if (isToday) {
          // If booking is for today, check which slots are less than 2 hours away
          const slots = useMembershipSlots ? membershipTimeSlots : timeSlots;

          slots.forEach((slot) => {
            const hourValue = parseInt(slot.startTime);
            if (!isTimeSlotAvailable(options.date, hourValue)) {
              bookedSlots.push(slot.id);
            }
          });
        }
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
    useMembershipSlots,
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
      ${useMembershipSlots ? "h-[25%] rounded-lg" : "p-1 my-1"}
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
    [useMembershipSlots, handleClick]
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
          className="flex grow rounded-lg border items-center justify-center"
          aria-live="polite"
        >
          <div className="text-center">Loading available time slots...</div>
        </div>
      ) : (
        <div className="flex flex-col h-[307px] rounded-lg border">
          <div className="flex-1 overflow-hidden">
            <div
              className={`w-full h-full rounded-t-lg overflow-y-scroll p-2
                  ${
                    useMembershipSlots
                      ? "flex justify-center flex-col grow w-full"
                      : ""
                  }`}
              role="listbox"
              aria-label="Available time slots"
            >
              {renderTimeSlots}
            </div>
          </div>
          <div className="flex-shrink-0 p-2 border-t">
            <Button
              className="w-full"
              onClick={handleClear}
              disabled={selList.length === 0}
            >
              CLEAR SELECTION
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
