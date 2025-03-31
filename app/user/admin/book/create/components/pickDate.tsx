"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
export const PickDate = ({
  prices,
  options,
  setOptions,
}: {
  prices: any;
  options: any;
  setOptions: any;
}) => {
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
