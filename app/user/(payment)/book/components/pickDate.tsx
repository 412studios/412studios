"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDashboard } from "../context";

export const PickDate = () => {
  const { options, setOptions } = useDashboard();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Disable past dates for selection
  const disabledDates = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return { before: yesterday };
  }, []);

  // Memoize the date selection handler
  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setOptions(prevOptions => ({
        ...prevOptions,
        date: selectedDate,
        startTime: -1,
        endTime: -1
      }));
    }
  }, [setOptions]);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      disabled={disabledDates}
      className="border rounded-lg border-black hover:bg-black/10 cursor-pointer duration-300"
    />
  );
};
