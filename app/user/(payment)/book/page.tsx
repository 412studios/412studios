"use client";
import { PickDate } from "./components/pickDate";
import { PickTime } from "./components/pickTime";
import { PickEng } from "./components/pickEng";
import { ShowDetails } from "./components/showDetails";
import { StudioDetails } from "./components/studioDetails";
import { H2, H4 } from "@/components/ui/copy";
import { useDashboard } from "./context";

export default function DashboardPage() {
  const { options, isAdmin } = useDashboard();
  const studioName = ["A", "B", "C"];
  return (
    <section className="block min-h-[calc(100vh-34px)] p-8">
      <div className="rounded-lg max-w-screen-lg mx-auto">
        <H2>BOOK TIME</H2>
        {/* Membership Details */}
        {options.membershipRooms.length >= 1 && !isAdmin && (
          <div className="border p-2 bg-sky-200 mb-2">
            {options.membership.map((element, index) => (
              <div key={index} className="rounded flex flex-col">
                <p>Membership In Studio {studioName[element.roomId]}</p>
                <p>Membership Status: {element.status.toUpperCase()}</p>
                <p>Remaining Hours in Membership: {element.availableHours}</p>
              </div>
            ))}
          </div>
        )}
        <StudioDetails />
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
