"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

export default function Page(data: any) {
  // COLLECT SUBSCRIPTION DETAILS IF AVAILABLE
  // CREATE ARRAY OF ACTIVE subscription AND ROOM HOURS
  const subscriptionRooms = useMemo(
    () => data.subscription.map((element: any) => element.roomId),
    [data.subscription]
  );
  const subscriptionRoomHours = useMemo(
    () => data.subscription.map((element: any) => element.availableHours),
    [data.subscription]
  );

  // SET DEFAULT OPTION VALUES ON LOAD
  const defaultOptions = useMemo(
    () => ({
      room: 0,
      date: new Date(),
      startTime: -1,
      endTime: -1,
      duration: 0,
      price: 0,
      loading: false,
      subscription: data.subscription,
      subscriptionRooms: subscriptionRooms,
      subscriptionRoomHours: subscriptionRoomHours,
      user: data.user,
      engDuration: -1,
      engStart: -1,
    }),
    [data.subscription, subscriptionRooms, subscriptionRoomHours, data.user]
  );

  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  // UPDATE OPTIONS ON ROOM PICK + RESET TIMES
  const pickRoom = (input: number) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      room: input,
      date: new Date(),
      startTime: -1,
      endTime: -1,
      engDuration: -1,
      engStart: -1,
    }));
  };

  function onRoomSelect(id: string) {
    setOptions((prevOptions) => ({
      ...prevOptions,
      room: parseInt(id),
      date: new Date(),
      startTime: -1,
      endTime: -1,
      engDuration: -1,
      engStart: -1,
    }));
  }

  return (
    <Section>
      {/* PICK A ROOM SECTION */}
      <Card className="mb-8">
        <CardHeader className="flex w-full justify-between">
          <CardTitle>Bookings</CardTitle>
          <span className="flex-end">
            <Link href="/user/admin/book/" className="mr-2">
              <Button>Back</Button>
            </Link>
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-fill p-4">
            <h2 className="text-2xl font-semibold leading-none  tracking-wide text-primary mb-4">
              Select A Room
            </h2>
            <Select onValueChange={onRoomSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Room A</SelectItem>
                <SelectItem value="1">Room B</SelectItem>
                <SelectItem value="2">Room C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-6">
                <h2 className="text-center text-2xl font-semibold leading-none  tracking-wide text-primary mb-4">
                  Select A Date
                </h2>
                <div className="flex items-center justify-center">
                  <PickDate
                    setOptions={setOptions}
                    options={options}
                    prices={data.prices}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 p-6">
                <h2 className="text-center text-2xl font-semibold leading-none  tracking-wide text-primary mb-4">
                  Select A Time
                </h2>
                <div className="flex items-center justify-center">
                  <PickTime
                    setOptions={setOptions}
                    options={options}
                    prices={data.prices}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-fill p-4">
            <PickEng
              setOptions={setOptions}
              options={options}
              prices={data.prices}
            />
          </div>
        </CardContent>
      </Card>

      {/* CHECKOUT DETAILS */}
      <ShowDetails
        setOptions={setOptions}
        options={options}
        prices={data.prices}
      />
    </Section>
  );
}
