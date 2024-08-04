"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { timeSlots } from "./timeSlots";
import { PostSubscriptionBooking } from "@/app/lib/booking";

export const ShowDetails = ({
  prices,
  options,
  setOptions,
}: {
  prices: any;
  options: any;
  setOptions: any;
}) => {
  //Updating options
  const [isLoading, setIsLoading] = useState(false);

  let displayStart = "Not Selected";
  let displayEnd = "Not Selected";
  let duration = 0;

  let bookingTotal = 0;
  let engTotal = 0;

  let total = 0;

  // IF USER IS NOT SUBSCRIBED
  if (options.startTime != -1) {
    // SET DISPLAY TIME FROM TIMESLOTS
    displayStart = timeSlots[options.startTime].displayStart;
    displayEnd = timeSlots[options.endTime].displayEnd;
    // SET DURATION AND TOTAL BASED ON START AND END TIMES FROM pickTime
    duration = options.endTime - options.startTime + 1;
    total = duration * prices[options.room].hourlyRate;
    bookingTotal = duration * prices[options.room].hourlyRate;
    //CHANGE VALUE IF MATCHING DAY RATE/16HOURS
    if (duration == 16) {
      total = prices[options.room].dayRate;
    }
    //UPDATE TOTALS TO INCLUDE ENGINEERING FEE
    if (options.engDuration != -1) {
      engTotal = prices[options.room].engineerPrice * duration;
      total += engTotal;
    } else {
      engTotal = 0;
    }
  } else {
    // RESET IF NO TIME IS SELECTED
    displayStart = "Not Selected";
    displayEnd = "Not Selected";
    duration = 0;
    total = 0;
  }

  // //SUBMIT DETAILS
  const submit = async () => {
    setIsLoading(true);
    const startTime = options.startTime;
    const endTime = options.endTime;
    try {
      await PostSubscriptionBooking(options, startTime, endTime, duration);
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  return (
    <div>
      {/* GLOBAL LOADING VARIABLE */}
      {options.loading == true ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>Loading...</CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* STANDARD BOOKING DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="rounded-[8px] overflow-hidden">
                <TableBody className="border-0">
                  <TableRow>
                    <TableCell>
                      <strong>Room</strong>
                    </TableCell>
                    <TableCell>Room {prices[options.room].room}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      {options.date
                        ? options.date.toDateString()
                        : "Not selected"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Start Time</strong>
                    </TableCell>
                    <TableCell>{displayStart}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>End Time</strong>
                    </TableCell>
                    <TableCell>{displayEnd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Booking Duration</strong>
                    </TableCell>
                    <TableCell>{duration} Hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Booking Total</strong>
                    </TableCell>
                    <TableCell>${bookingTotal}.00 CAD</TableCell>
                  </TableRow>

                  {/* SHOW ENGINEER DETAILS IF AVAILABLE */}
                  {options.engDuration >= 1 ? (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Engineering Start Time</strong>
                        </TableCell>
                        <TableCell>
                          {timeSlots[options.engStart].displayStart}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Engineering Duration</strong>
                        </TableCell>
                        <TableCell>{options.engDuration} Hours</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Engineering Total</strong>
                        </TableCell>
                        <TableCell>${engTotal}.00 CAD</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <></>
                  )}

                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>${total}.00 CAD</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              {/* ALLOW BOOKING IF LOCAL DURATION IS 2 OR MORE */}
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
                  {isLoading ? "Redirecting..." : "Create Booking"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};
