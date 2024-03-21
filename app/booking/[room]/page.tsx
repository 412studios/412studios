"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { prices } from "../prices";

export default function Page(context: any) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  };

  const numericDate = formatDateToNumeric(date);

  let formattedDate = date?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="m-8">
      <div className="mx-auto max-w-screen-md">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/booking/">
            <Button>Back</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Studio {prices[context.params.room - 1].room || ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <div className="mx-auto p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow"
                />
                {formattedDate ? (
                  <Link href={`/booking/${context.params.room}/${numericDate}`}>
                    <Button className="mt-4 w-full">View Times</Button>
                  </Link>
                ) : (
                  <Button className="mt-4 w-full">Select A Date</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
