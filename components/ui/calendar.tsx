"use client";
import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom"; // Try adding this
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromDate,
  ...props
}: CalendarProps & { fromDate?: Date }) {
  const [fromMonth, setFromMonth] = React.useState(fromDate || new Date());
  // Calculate the max date by adding 6 months to the current date
  const currentDate = new Date();
  const maxDate = new Date(currentDate.setMonth(currentDate.getMonth() + 4));
  const handleMonthChange = (month: Date) => {
    if (fromDate && month >= fromDate && month <= maxDate) {
      setFromMonth(month);
    }
  };

  const today = new Date();
  const oneMonthAgo = new Date(new Date().setMonth(today.getMonth() - 30));
  const dayBeforeToday = new Date(new Date().setDate(today.getDate() - 1));
  const disabledDays = [{ from: oneMonthAgo, to: dayBeforeToday }];

  return (
    <DayPicker
      className={cn("border-rose-300 p-3", className)}
      classNames={{
        months: "flex",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-primary rounded-md flex-1 font-normal text-[0.8rem] text-center flex items-center justify-center",
        row: "flex w-full mt-2",
        cell: "flex-1 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex items-center justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-background hover:bg-primary hover:text-background focus:bg-primary focus:text-background",
        day_today: "border-black border-[1px]",
        day_outside:
          "day-outside text-primary opacity-50 aria-selected:bg-accent/50 aria-selected:text-primary aria-selected:opacity-30",
        day_disabled: "text-primary opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-background",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      fromMonth={fromMonth}
      toMonth={maxDate}
      onMonthChange={handleMonthChange}
      // onDayClick={handleDayClick}
      disabled={disabledDays}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
