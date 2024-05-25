"use client";
import { useState, useEffect } from "react";
import { PickRoom } from "./components/pickRoom";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import EquipmentList from "./components/equipmentList";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page(data: any) {
  const [userDetails, setUserDetails] = useState("");
  const [subDetails, setSubDetails] = useState("");
  useEffect(() => {
    setUserDetails(data.user);
    setSubDetails(data.sub);
  }, [data]);

  const prices = data.prices;

  let subRooms: string[] = [];
  let subRoomHours: string[] = [];
  data.sub.forEach((element: any) => {
    subRooms.push(element.roomId);
    subRoomHours.push(element.availableHours);
  });

  const [options, setOptions] = useState({
    room: -1,
    date: new Date(),
    startTime: 0,
    endTime: 0,
    duration: 0,
    price: 0,
    loading: false,
    subscription: data.sub,
    subRooms: subRooms,
    subRoomHours: subRoomHours,
  });

  // Accordions On Load
  const [activeItems, setActiveItems] = useState(["item-1"]);
  useEffect(() => {
    if (options.room > -1) {
      setActiveItems((currentItems) => {
        const newActiveItems = new Set(currentItems);
        newActiveItems.delete("item-1");
        newActiveItems.delete("item-3");
        newActiveItems.add("item-2");
        return Array.from(newActiveItems);
      });
    } else {
      setActiveItems((currentItems) => {
        const newActiveItems = new Set(currentItems);
        newActiveItems.add("item-1");
        newActiveItems.add("item-3");
        return Array.from(newActiveItems);
      });
    }
  }, [options.room]);
  // Toggle open/close accordions
  const toggleItem = (itemValue: any) => {
    setActiveItems((currentItems) => {
      const isItemActive = currentItems.includes(itemValue);
      if (isItemActive) {
        return currentItems.filter((item) => item !== itemValue);
      } else {
        return [...currentItems, itemValue];
      }
    });
  };

  return (
    <main className="min-h-[100vh] p-2 md:p-8">
      <div className="mx-auto mb-8 max-w-screen-xl pt-6 md:pt-0">
        <h1 className="text-4xl font-bold text-gray-900">Book A Time</h1>
        {data.sub.length >= 1 && (
          <div className="mt-5">
            {data.sub.map((sub: any, index: number) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded flex flex-col mt-2"
              >
                <span>Subscribed to Room {prices[sub.roomId].room}</span>
                <span>Subscription Status {sub.status}</span>
                <span>
                  Remaining Hours in Subscription: {sub.availableHours}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mx-auto max-w-screen-xl border-t">
        <Accordion type="multiple" className="w-full" value={activeItems}>
          {/* ROOM DETAILS */}
          <AccordionItem value="item-1">
            <AccordionTrigger onClick={() => toggleItem("item-1")}>
              View Rooms
            </AccordionTrigger>
            <AccordionContent>
              <PickRoom
                setOptions={setOptions}
                options={options}
                prices={prices}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger onClick={() => toggleItem("item-2")}>
              View Times
            </AccordionTrigger>
            {/* BOOKIGN DETAILS */}
            <AccordionContent>
              {options.room != -1 ? (
                <div>
                  <div className="mx-auto max-w-screen-xl">
                    <div className="flex p-2">
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle>
                            Room {prices[options.room].room}
                          </CardTitle>
                          <CardDescription>
                            {options.date.toDateString()}
                          </CardDescription>
                          <div className="border-b"></div>
                          <CardDescription className="pt-1">
                            Daily Rate: {prices[options.room].dayRate} | Hourly
                            Rate: {prices[options.room].hourlyRate}
                          </CardDescription>
                          <div>
                            {data.sub[options.room] && (
                              <CardDescription>
                                <strong>Subscription Hours:</strong>{" "}
                                {options.subRoomHours[options.room]}
                              </CardDescription>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
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
                            prices={prices}
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
                            prices={prices}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto flex max-w-screen-xl flex-col lg:flex-row">
                    <div className="w-full p-2">
                      <PickEng
                        setOptions={setOptions}
                        options={options}
                        prices={prices}
                      />
                    </div>
                  </div>

                  <div className="mx-auto flex max-w-screen-xl flex-col lg:flex-row">
                    <div className="w-full p-2">
                      <ShowDetails
                        setOptions={setOptions}
                        options={options}
                        prices={prices}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                  role="alert"
                >
                  <span className="block sm:inline">Please Select A Room</span>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          {/* EQUIPMENT DETAILS */}
          <AccordionItem value="item-3">
            <AccordionTrigger onClick={() => toggleItem("item-3")}>
              Equipment Details
            </AccordionTrigger>
            <AccordionContent>
              <EquipmentList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="mx-auto mt-8 max-w-screen-xl pb-6 md:pb-0">
        <div
          className="relative w-full rounded border border-blue-400 bg-blue-100 px-4 py-3 text-center text-blue-700"
          role="alert"
        >
          <span className="block sm:inline">
            For more booking enquiries, please call{" "}
            <Link href="tel:+16475402321">+1 (647) 540-2321</Link>
          </span>
        </div>
      </div>
    </main>
  );
}
