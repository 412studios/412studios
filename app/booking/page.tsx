"use client";
import { useState, useEffect } from "react";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Page(data: any) {
  //COLLECT SUBSCRIPTION DETAILS IF AVAILABLE
  //CREATE ARRAY OF ACTIVE SUBSCRIPTIONS AND ROOM HOURS
  let subRooms: string[] = [];
  let subRoomHours: string[] = [];
  data.sub.forEach((element: any) => {
    subRooms.push(element.roomId);
    subRoomHours.push(element.availableHours);
  });

  //SET DEFAULT OPTION VALUES ON LOAD
  const defaultOptions = {
    room: 0,
    date: new Date(),
    startTime: -1,
    endTime: -1,
    duration: 0,
    price: 0,
    loading: false,
    subscription: data.sub,
    subRooms: subRooms,
    subRoomHours: subRoomHours,
    user: data.user,
    engDuration: -1,
    engStart: -1,
  };
  const [options, setOptions] = useState(defaultOptions);
  useEffect(() => {
    setOptions(defaultOptions);
  }, [data]);

  //UPDATE OPTIONS ON ROOM PICK + RESET TIMES
  function pickRoom(input: number) {
    setOptions({
      ...options,
      room: input,
      date: new Date(),
      startTime: -1,
      endTime: -1,
    });
  }

  return (
    <main className="m-8">
      {/* DISPLAY SUB DETAILS IF AVAILABLE */}
      <>
        {options.subRooms.length >= 1 ? (
          <>
            <Card className="m-2">
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {options.subscription.map((element: any, index: number) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded flex flex-col mt-2"
                  >
                    <span>Room {data.prices[element.roomId].room}</span>
                    <span>Subscription Status {element.status}</span>
                    <span>
                      Remaining Hours in Subscription: {element.availableHours}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <></>
        )}
      </>

      {/* PICK A ROOM SECTION */}
      <>
        <Card className="m-2">
          <CardHeader>
            <CardTitle>Pick Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap">
              {data.prices.map((element: any) => (
                <div key={element.id} className="w-full md:w-1/3 p-2">
                  <CardTitle>Room {element.room}</CardTitle>
                  <CardDescription>
                    Hourly rate: {element.hourlyRate}
                  </CardDescription>
                  <CardDescription>Day rate: {element.dayRate}</CardDescription>
                  <Button
                    className="w-full mt-4"
                    onClick={() => pickRoom(element.id)}
                  >
                    Select Room {element.room}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>

      {/* DATE AND TIME SECTION */}
      <>
        <div className="flex flex-col lg:flex-row">
          <div className="m-2 flex h-[450px] flex-col rounded border md:h-[600px] lg:w-full">
            <div className="p-4 text-2xl font-semibold leading-none tracking-tight">
              Date
            </div>
            <div className="mx-4 border-b"></div>
            <div className="flex h-full items-center justify-center p-4">
              <PickDate
                setOptions={setOptions}
                options={options}
                prices={data.prices}
              />
            </div>
          </div>
          <div className="m-2 flex h-[450px] flex-col rounded border md:h-[600px] lg:w-full">
            <div className="p-4 text-2xl font-semibold leading-none tracking-tight">
              Time
            </div>
            <div className="mx-4 border-b"></div>
            <div className="flex h-full items-center justify-center p-4">
              <PickTime
                setOptions={setOptions}
                options={options}
                prices={data.prices}
              />
            </div>
          </div>
        </div>
      </>

      {/* <>
        <div className="mx-auto flex max-w-screen-xl flex-col lg:flex-row">
          <div className="w-full p-2">
            <PickEng
              setOptions={setOptions}
              options={options}
              prices={data.prices}
            />
          </div>
        </div>
      </> */}

      {/* CHECKOUT DETAILS */}
      <>
        <ShowDetails
          setOptions={setOptions}
          options={options}
          prices={data.prices}
        />
      </>
    </main>
  );
}
