"use client";
import { useState, useEffect, useMemo } from "react";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import { RoomDetails } from "./components/roomDetails";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page(data: any) {
  // COLLECT SUBSCRIPTION DETAILS IF AVAILABLE
  // CREATE ARRAY OF ACTIVE SUBSCRIPTIONS AND ROOM HOURS
  const subRooms = useMemo(
    () => data.sub.map((element: any) => element.roomId),
    [data.sub]
  );
  const subRoomHours = useMemo(
    () => data.sub.map((element: any) => element.availableHours),
    [data.sub]
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
      subscription: data.sub,
      subRooms: subRooms,
      subRoomHours: subRoomHours,
      user: data.user,
      engDuration: -1,
      engStart: -1,
    }),
    [data.sub, subRooms, subRoomHours, data.user]
  );

  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  // UPDATE OPTIONS ON ROOM PICK + RESET TIMES
  function onRoomSelect(id: string) {
    setOptions((prevOptions) => ({
      ...prevOptions,
      room: parseInt(id),
      date: new Date(),
      startTime: -1,
      endTime: -1,
      engStart: -1,
      engDuration: -1,
    }));
  }

  return (
    <>
      {/* PICK A ROOM SECTION */}
      <section className="block mt-[34px] min-h-[calc(100vh-34px)] p-8">
        <div className="p-2 rounded-lg max-w-screen-lg mx-auto">
          <div>
            <H4 className="mb-2">BOOKING OPTIONS</H4>
            {/* SUBSCRIPTION DETAILS */}
            {options.subRooms.length >= 1 && (
              <div className="border p-2 bg-sky-200">
                {options.subscription.map((element: any, index: number) => (
                  <div key={index} className="rounded flex flex-col">
                    <p>
                      Membership In Studio {data.prices[element.roomId].room}
                    </p>
                    <p>Membership Status: {element.status.toUpperCase()}</p>
                    <p>
                      Remaining Hours in Membership: {element.availableHours}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {/* STUDIO DETAILS */}
            <div className="my-8">
              <H4 className="my-2">STUDIOS</H4>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Studio Details</AccordionTrigger>
                  <AccordionContent>
                    <RoomDetails data={data.prices} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* STUDIO SELECTION */}
              <div className="w-full mt-2">
                <Select onValueChange={onRoomSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Studio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Studio A</SelectItem>
                    <SelectItem value="1">Studio B</SelectItem>
                    <SelectItem value="2">Studio C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* DATE SELECTION */}
            <div className="w-full">
              <div className="flex flex-col sm:flex-row mt-2 gap-4">
                <div className="shrink-1">
                  <H4 className="mb-2">SELECT DATE</H4>
                  <div className="rounded-lg flex-shrink flex justify-center">
                    <PickDate
                      setOptions={setOptions}
                      options={options}
                      prices={data.prices}
                    />
                  </div>
                </div>
                <div className="flex flex-col grow">
                  <H4 className="mb-2">SELECT TIME</H4>
                  <PickTime
                    setOptions={setOptions}
                    options={options}
                    prices={data.prices}
                  />
                </div>
              </div>
            </div>
            {/* ENGINEER SELECTION */}
            <PickEng
              setOptions={setOptions}
              options={options}
              prices={data.prices}
            />
            {/* CHECKOUT DETAILS */}
            <ShowDetails
              setOptions={setOptions}
              options={options}
              prices={data.prices}
            />
          </div>
        </div>
      </section>
    </>
  );
}
