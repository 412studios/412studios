"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDashboard } from "../context";

export const PickDate = () => {
  const { prices, options, setOptions } = useDashboard();
  const handleDatePick = (newDate: Date) => {
    setOptions({ ...options, date: newDate, startTime: -1, endTime: -1 });
  };
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(selectedDate) => {
        setDate(selectedDate);
        if (selectedDate) {
          handleDatePick(selectedDate);
        }
      }}
      className="border rounded-lg border-black hover:bg-black/10 cursor-pointer duration-300"
    />
  );
};
