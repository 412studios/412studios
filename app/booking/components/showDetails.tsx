"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { timeSlots, subscriptionTimeSlots } from "./variables/timeSlots";
import { PostBooking, PostSubscriptionBooking } from "@/app/lib/booking";
import Link from "next/link";

export const ShowDetails = ({
  prices,
  options,
  setOptions,
}: {
  prices: any;
  options: any;
  setOptions: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (options.subRooms.includes(options.room) == true) {
      setIsSubscribed(true);
    }
  }, [isSubscribed]);

  let displayStart = " ";
  let displayEnd = " ";
  let duration = 0;

  let displayPrice = "0";

  //HANDLE SUBSCRIPTION TIME OPTIONS
  let timeArray: any = [];
  if (options.subRooms.includes(options.room) == true) {
    timeArray = subscriptionTimeSlots;
  } else {
    timeArray = timeSlots;
  }

  if (options.startTime != -1) {
    duration = options.endTime - options.startTime + 1;
    displayStart =
      timeArray[options.startTime].displayName.split(" - ")[0] + " - ";
    displayEnd = timeArray[options.endTime].displayName.split(" - ")[1];
  } else {
    displayStart = "No Time Selected";
    displayEnd = " ";
  }
  let displayRate = "Hourly Rate";
  if (duration >= 16) {
    displayPrice = prices[options.room]?.dayRate;
    displayRate = "Day Rate";
  } else {
    displayPrice = (prices[options.room]?.hourlyRate * duration).toString();
    displayRate = "Hourly Rate";
  }

  options.subscription[options.room] && (duration *= 4);

  const submit = async () => {
    setIsLoading(true);
    try {
      // console.log(parseInt(displayPrice + "00"));
      await PostBooking(options, parseInt(displayPrice + "00"));
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  const submitSubscription = async () => {
    setIsLoading(true);
    const startTime = options.startTime * 4;
    const endTime = options.endTime * 4 + 3;
    try {
      await PostSubscriptionBooking(options, startTime, endTime);
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          {options.loading ? (
            <div className="bg-background flex h-[264px] items-center justify-center text-center">
              <span>Loading...</span>
            </div>
          ) : (
            <div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-[100px] font-medium">
                      Room
                    </TableCell>
                    <TableCell>
                      Room {prices[options.room]?.room || "Not selected"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-[100px] font-medium">
                      Date
                    </TableCell>
                    <TableCell>
                      {options.date
                        ? options.date.toDateString()
                        : "Not selected"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-[100px] font-medium">
                      Time
                    </TableCell>
                    <TableCell>{displayStart + displayEnd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-[100px] font-medium">
                      Duration
                    </TableCell>
                    <TableCell>{duration} Hours</TableCell>
                  </TableRow>
                  {options.subscription[options.room] ? (
                    <>
                      <TableRow>
                        <TableCell className="w-[100px] font-medium">
                          Available Hours
                        </TableCell>
                        <TableCell>
                          {options.subscription[options.room].availableHours}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-[100px] font-medium">
                          Remaining Hours
                        </TableCell>
                        <TableCell>
                          {options.subscription[options.room].availableHours -
                            duration}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell className="w-[100px] font-medium">
                          Rate
                        </TableCell>
                        <TableCell>{displayRate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="w-[100px] font-medium">
                          Price
                        </TableCell>
                        <TableCell>$ {displayPrice}.00 CAD</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {options.subscription[options.room] ? (
            <>
              {options.subscription[options.room].availableHours <= 0 ? (
                <Link href="/dashboard/subscriptions" className="w-full">
                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Redirecting..." : "Add additional hours"}
                  </Button>
                </Link>
              ) : (
                <>
                  {duration <= 1 ? (
                    <Button className="w-full" disabled={isLoading}>
                      {isLoading ? "Redirecting..." : "Select Time Slot"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={submitSubscription}
                      disabled={isLoading}
                    >
                      {isLoading ? "Redirecting..." : "Book Time Slot"}
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {duration <= 1 ? (
                <div className="alert">
                  <span>Please select a minimum of 2 hours</span>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={submit}
                  disabled={isLoading}
                >
                  {isLoading ? "Redirecting..." : "Proceed to Payment"}
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
