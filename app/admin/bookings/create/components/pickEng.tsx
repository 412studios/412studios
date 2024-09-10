"use client";
import React, { useState, useEffect } from "react";
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
import { timeSlots } from "./timeSlots";

export const PickEng = ({
  prices,
  options,
  setOptions,
}: {
  prices: any;
  options: any;
  setOptions: any;
}) => {
  const placeholderStart = "Start Time";
  const placeholderDuration = "Duration";
  const [isChecked, setIsChecked] = useState(false);
  const [startTime, setStartTime] = useState<string>(placeholderStart);
  const [startTimeID, setStartTimeID] = useState<number>(-1);
  const [duration, setDuration] = useState<string>(placeholderDuration);
  const [durationArr, setDurationArr] = useState<any[]>([
    "select a start time",
  ]);

  useEffect(() => {
    setStartTime(placeholderStart);
    setStartTimeID(-1);
    setDuration(placeholderDuration);
    setDurationArr(["select a start time"]);
    setIsChecked(false);
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      engStart: -1,
      engDuration: -1,
    }));
  }, [options.startTime, options.endTime, setOptions]);

  let startArr: any = [];
  let min = options.startTime;
  let max = options.endTime;

  for (let i = min; i < max; i++) {
    startArr.push(i);
  }
  if (options.startTime === -1 || options.endTime === -1) {
    startArr = [];
  }

  const handleCheckboxChange = () => {
    if (isChecked) {
      setStartTime(placeholderStart);
      setStartTimeID(-1);
      setDuration(placeholderDuration);
      setDurationArr(["select a start time"]);
      setOptions((prevOptions: any) => ({
        ...prevOptions,
        engStart: -1,
        engDuration: -1,
      }));
    }
    setIsChecked((prev) => !prev);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    const index = startArr.findIndex((item: any) => formatTime(item) === value);
    setStartTimeID(startArr[index]);
    setDuration(placeholderDuration);
    let count = 2;
    const newDurationArr = [count];
    for (let i = index; i <= startArr.length - 2; i++) {
      count++;
      newDurationArr.push(count);
    }
    setDurationArr(newDurationArr);
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      engStart: index,
      engDuration: -1,
    }));
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      engDuration: value,
    }));
  };

  function formatTime(index: number) {
    const time = timeSlots[index].displayName.split(" - ")[0];
    return time;
  }

  return (
    <div>
      {startArr.length >= 1 ? (
        <div className="">
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
                      {startArr.map((item: any) => (
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
                      {durationArr.map((item: any) => (
                        <SelectItem key={item} value={item}>
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
        <div className="p-0">
          <span>No time selected</span>
        </div>
      )}
    </div>
  );
};
