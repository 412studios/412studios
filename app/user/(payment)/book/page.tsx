"use client";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import { RoomDetails } from "./components/roomDetails";
import { H4 } from "@/components/ui/copy";
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
import { useDashboard } from "./context";

export default function DashboardPage() {
  const { options, onRoomSelect } = useDashboard();

  return (
    <section className="block mt-[34px] min-h-[calc(100vh-34px)] p-8">
      <div className="p-2 rounded-lg max-w-screen-lg mx-auto">
        <H4 className="mb-2">BOOKING OPTIONS</H4>

        {options.subRooms.length >= 1 && (
          <div className="border p-2 bg-sky-200">
            {options.subscription.map((element, index) => (
              <div key={index} className="rounded flex flex-col">
                <p>Membership In Studio {element.roomId}</p>
                <p>Membership Status: {element.status.toUpperCase()}</p>
                <p>Remaining Hours in Membership: {element.availableHours}</p>
              </div>
            ))}
          </div>
        )}

        <div className="my-8">
          <H4 className="my-2">STUDIOS</H4>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Studio Details</AccordionTrigger>
              <AccordionContent>
                <RoomDetails />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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

        <div className="w-full">
          <div className="flex flex-col sm:flex-row mt-2 gap-4">
            <div className="shrink-1">
              <H4 className="mb-2">SELECT DATE</H4>
              <div className="rounded-lg flex-shrink flex justify-center">
                <PickDate />
              </div>
            </div>

            <div className="flex flex-col grow">
              <H4 className="mb-2">SELECT TIME</H4>
              <PickTime />
            </div>
          </div>
        </div>

        <PickEng />

        <ShowDetails />
      </div>
    </section>
  );
}
