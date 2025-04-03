"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeSlots } from "@/app/user/(payment)/book/components/timeSlots";
import { H4 } from "@/components/ui/copy";
import { useDashboard } from "../context";

export const PickEng = () => {
  const { prices, options, isAdmin, setOptions } = useDashboard();
  const placeholderStart = "Start Time";
  const placeholderDuration = "Duration";
  const [isChecked, setIsChecked] = useState(false);
  const [startTime, setStartTime] = useState<string>(placeholderStart);
  const [startTimeID, setStartTimeID] = useState<number>(-1);
  const [duration, setDuration] = useState<string>(placeholderDuration);
  const [durationArr, setDurationArr] = useState<number[]>([]);

  // Check if subscribed
  const isSubscribed = useMemo(
    () => options.subRooms.includes(options.room),
    [options.subRooms, options.room]
  );

  // New: Check if we should use subscription-specific logic - only when subscribed AND not admin
  const useSubscriptionSlots = useMemo(
    () => isSubscribed && !isAdmin,
    [isSubscribed, isAdmin]
  );

  // Calculate startArr only when dependencies change
  const startArr = useMemo(() => {
    let arr: number[] = [];
    let min = 0;
    let max = 0;

    // Skip calculation if no time is selected
    if (options.startTime === -1 || options.endTime === -1) {
      return arr;
    }

    // Changed: Use useSubscriptionSlots instead of just checking subRooms
    if (useSubscriptionSlots) {
      if (options.startTime > -1) {
        min = options.startTime * 4;
        max = options.endTime * 4 + 3;
      }
    } else {
      min = options.startTime;
      max = options.endTime;
    }

    for (let i = min; i < max; i++) {
      arr.push(i);
    }

    return arr;
  }, [options.startTime, options.endTime, options.room, useSubscriptionSlots]);

  // Reset form when time selection changes
  useEffect(() => {
    const resetForm = () => ({
      engStart: -1,
      engDuration: -1,
    });

    setStartTime(placeholderStart);
    setStartTimeID(-1);
    setDuration(placeholderDuration);
    setDurationArr([]);
    setIsChecked(false);
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...resetForm(),
    }));
  }, [options.startTime, options.endTime, setOptions]);

  // Memoize format time function
  const formatTime = useCallback((index: number) => {
    const time = timeSlots[index].displayName.split(" - ")[0];
    return time;
  }, []);

  // Handle checkbox change with batched state updates
  const handleCheckboxChange = useCallback(() => {
    setIsChecked((prev) => {
      const newIsChecked = !prev;

      // Only reset if unchecking
      if (!newIsChecked) {
        setStartTime(placeholderStart);
        setStartTimeID(-1);
        setDuration(placeholderDuration);
        setDurationArr([]);
        setOptions((prevOptions) => ({
          ...prevOptions,
          engStart: -1,
          engDuration: -1,
        }));
      }

      return newIsChecked;
    });
  }, [placeholderStart, placeholderDuration, setOptions]);

  // Handle start time change with batched state updates
  const handleStartTimeChange = useCallback(
    (value: string) => {
      const index = startArr.findIndex((item) => formatTime(item) === value);
      if (index === -1) return;

      const selectedStartTime = startArr[index];
      const availableDurations = [];
      let count = 2;

      // Calculate available durations
      for (let i = index; i <= startArr.length - 1; i++) {
        availableDurations.push(count);
        count++;
      }

      // Batch all updates
      setStartTime(value);
      setStartTimeID(selectedStartTime);
      setDuration(placeholderDuration);
      setDurationArr(availableDurations);
      setOptions((prevOptions) => ({
        ...prevOptions,
        engStart: selectedStartTime,
        engDuration: -1,
      }));
    },
    [startArr, formatTime, placeholderDuration, setOptions]
  );

  // Handle duration change
  const handleDurationChange = useCallback(
    (value: string) => {
      setDuration(value);
      setOptions((prevOptions) => ({
        ...prevOptions,
        engDuration: parseInt(value),
      }));
    },
    [setOptions]
  );

  return (
    <div className="border rounded-lg mt-4 p-4">
      <H4>
        Engineering Fee: ${prices[options.room].engineerPrice}.00 per hour
      </H4>
      <div className="border-b mt-4"></div>
      {startArr.length >= 1 ? (
        <div className="pt-4">
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="rounded"
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add Engineer
              </label>
            </div>
          </div>
          <div className="pt-4">
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="w-full md:w-1/2">
                <Select
                  disabled={!isChecked}
                  value={startTime}
                  onValueChange={handleStartTimeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select start time">
                      {startTime === placeholderStart ? (
                        <span className="text-gray-400">
                          {placeholderStart}
                        </span>
                      ) : (
                        startTime
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Start Time</SelectLabel>
                      {startArr.map((item) => (
                        <SelectItem key={item} value={formatTime(item)}>
                          {formatTime(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <Select
                  disabled={!isChecked}
                  value={duration}
                  onValueChange={handleDurationChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select end time">
                      {duration === placeholderDuration ? (
                        <span className="text-gray-400">
                          {placeholderDuration}
                        </span>
                      ) : (
                        duration
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Duration</SelectLabel>
                      {durationArr.map((item) => (
                        <SelectItem key={item} value={item.toString()}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 pl-0 pb-0">
          <span>No time selected</span>
        </div>
      )}
    </div>
  );
};
