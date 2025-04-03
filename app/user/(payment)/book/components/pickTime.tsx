"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  const { options, setOptions, handleTimePick, clearTimeSelection } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [selList, setSelList] = useState<number[]>([]);
  const [bookedTimes, setBookedTimes] = useState<number[]>([]);
  
  // Refs for values that don't need to trigger re-renders
  const pendingUpdateRef = useRef<{start: number, end: number, duration: number} | null>(null);
  
  // Memoize derived values that only change when dependencies change
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
  
  // Batch state updates after render cycle completes
  useEffect(() => {
    if (pendingUpdateRef.current) {
      const { start, end, duration } = pendingUpdateRef.current;
      handleTimePick(start, end, duration);
      pendingUpdateRef.current = null;
    }
  });

  // Memoize the fetch data function to avoid recreating it on each render
  const fetchData = useCallback(async () => {
    if (!options.date) return;
    
    setIsLoading(true);
    setOptions((prevOptions) => ({ ...prevOptions, loading: true }));
    
    try {
      // Fetch booking data in parallel
      const [bookings, checkSubWeek] = await Promise.all([
        getBooking(options.room, parseInt(formattedDate)),
        getSubWeek(options.room, parseInt(formattedDate), options.user)
      ]);
      
      // Process booking data
      let bookedSlots: number[] = [];
      
      if (isSubscribed && checkSubWeek) {
        // Weekly limit reached, block all slots
        fillArrGaps(bookedSlots, 0, 3);
      } else {
        // Process individual bookings
        bookings.forEach((booking) => {
          const start = isSubscribed 
            ? Math.floor(booking.startTime / 4) 
            : booking.startTime;
            
          const end = isSubscribed 
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
      setOptions((prevOptions) => ({ ...prevOptions, loading: false }));
    }
  }, [options.room, options.date, options.user, formattedDate, isSubscribed, setOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle time slot selection
  const handleClick = useCallback(
    (id: number) => {
      if (bookedTimes.includes(id)) return;

      setSelList((prevSelList) => {
        // Handle subscription slots differently - just select single slot
        if (isSubscribed) {
          const currentSubscription = options.subscription.find(
            (item) => item.roomId === options.room
          );
          
          // Check if subscription has enough hours
          if (currentSubscription && currentSubscription.availableHours < 4) {
            return prevSelList;
          }
          
          // Queue the update for after render
          pendingUpdateRef.current = { start: id, end: id, duration: 1 };
          return [id];
        }
        
        // For standard bookings, handle range selection
        const sortedList = Array.from(new Set([...prevSelList, id])).sort(
          (a, b) => a - b
        );
        const min = Math.min(sortedList[0], id);
        const max = Math.max(sortedList[sortedList.length - 1], id);
        
        // Build continuous selection list
        const fullList = [];
        for (let i = min; i <= max; i++) {
          if (bookedTimes.includes(i)) {
            // If any slot in range is booked, just select the clicked slot
            pendingUpdateRef.current = { start: id, end: id, duration: 1 };
            return [id];
          }
          fullList.push(i);
        }

        // Queue state update for after render cycle
        pendingUpdateRef.current = {
          start: fullList[0],
          end: fullList[fullList.length - 1],
          duration: fullList.length
        };
        
        return fullList;
      });
    },
    [bookedTimes, isSubscribed, options.subscription, options.room]
  );

  const handleClear = useCallback(() => {
    setSelList([]);
    clearTimeSelection();
  }, [clearTimeSelection]);

  // Memoize time slot rendering to prevent unnecessary calculations
  const renderTimeSlots = useMemo(() => {
    return timeArray.map((slot) => {
      const isBooked = bookedTimes.includes(slot.id);
      const isSelected = selList.includes(slot.id);
      
      return (
        <div
          key={slot.id}
          onClick={() => !isBooked && handleClick(slot.id)}
          className={`flex items-center justify-center text-center hover:cursor-pointer rounded-full
          ${isSubscribed ? "h-[25%] rounded-lg" : "p-1 my-1"}
          ${
            isBooked
              ? "bg-red-500"
              : isSelected
              ? "bg-emerald-500 text-black"
              : "bg-background hover:bg-accent"
          }`}
        >
          <span>{slot.displayName}</span>
        </div>
      );
    });
  }, [timeArray, bookedTimes, selList, isSubscribed, handleClick]);

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
                  ${isSubscribed ? "flex justify-center flex-col grow w-full" : ""}`}
            >
              {renderTimeSlots}
            </div>
          </div>
          <Button className="w-full" onClick={handleClear}>
            CLEAR SELECTION
          </Button>
        </div>
      )}
    </>
  );
};
