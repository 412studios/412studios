"use client";
import { useState, useEffect } from "react";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import { RoomDetails } from "./components/roomDetails";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { useDashboard } from "../context";

export default function Page() {
  const { options, onRoomSelect } = useDashboard();

  return (
    <>
      {/* PICK A ROOM SECTION */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Booking Options</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>View Room Details</AccordionTrigger>
              <AccordionContent className="p-0">
                <RoomDetails />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* DISPLAY SUBSCRIPTION DETAILS IF AVAILABLE */}
          {options.subRooms.length >= 1 && (
            <div className="border-b-4 p-4 bg-accent">
              {options.subscription.map((element: any, index: number) => (
                <div key={index} className="rounded flex flex-col font-bold">
                  <span>
                    Membership Studio: Studio {element.roomId}
                  </span>
                  <span>Membership Status: {element.status.toUpperCase()}</span>
                  <span>
                    Remaining Hours in Membership: {element.availableHours}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="w-fill border-b-4 p-4">
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
              <div className="w-full md:w-1/2 md:border-r-4 border-r-0 p-6">
                <h2 className="text-center text-2xl font-semibold leading-none  tracking-wide text-primary mb-4">
                  Select A Date
                </h2>
                <div className="flex items-center justify-center">
                  <PickDate />
                </div>
              </div>
              <div className="w-full md:w-1/2 p-6 md:border-t-0 border-t-4">
                <h2 className="text-center text-2xl font-semibold leading-none  tracking-wide text-primary mb-4">
                  Select A Time
                </h2>
                <div className="flex items-center justify-center">
                  <PickTime />
                </div>
              </div>
            </div>
          </div>

          <div className="w-fill border-t-4 p-4">
            <PickEng />
          </div>
        </CardContent>
      </Card>

      {/* CHECKOUT DETAILS */}
      <ShowDetails />
    </>
  );
}
