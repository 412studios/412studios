"use client";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  timeSlots,
  subscriptionTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";
import { H4 } from "@/components/ui/copy";
import { useDashboard } from "../context";

export let ShowDetails = () => {
  let {
    prices,
    options,
    setOptions,
    isSubscribed,
    submitBooking,
    submitSubscriptionBooking,
  } = useDashboard();

  const [isLoading, setIsLoading] = useState(false);

  let displayStart = "Not Selected";
  let displayEnd = "Not Selected";
  let duration = 0;

  let bookingTotal = 0;
  let engTotal = 0;
  let total = 0;

  const foundSub = options.subscription.find(
    (sub: any) => sub.roomId === options.room
  );
  const subHasHours = (foundSub?.availableHours ?? 0) >= 4;

  if (isSubscribed) {
    if (options.startTime !== -1) {
      displayStart = subscriptionTimeSlots[options.startTime].displayStart;
      displayEnd = subscriptionTimeSlots[options.endTime].displayEnd;
      duration = (options.endTime - options.startTime + 1) * 4;
      total = 0;

      if (options.engDuration !== -1) {
        engTotal = prices[options.room].engineerPrice * duration;
        total += engTotal;
      } else {
        engTotal = 0;
      }
    } else {
      displayStart = "Not Selected";
      displayEnd = "Not Selected";
      duration = 0;
      total = 0;
    }
  } else {
    if (options.startTime !== -1) {
      displayStart = timeSlots[options.startTime].displayStart;
      displayEnd = timeSlots[options.endTime].displayEnd;
      duration = options.endTime - options.startTime + 1;
      total = duration * prices[options.room].hourlyRate;
      bookingTotal = total;

      if (duration === 16) {
        total = prices[options.room].dayRate;
      }

      if (options.engDuration !== -1) {
        engTotal = prices[options.room].engineerPrice * duration;
        total += engTotal;
      } else {
        engTotal = 0;
      }
    } else {
      displayStart = "Not Selected";
      displayEnd = "Not Selected";
      duration = 0;
      total = 0;
    }
  }

  useEffect(() => {
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      price: total,
    }));
  }, [total, setOptions]);

  return (
    <div>
      {options.loading ? (
        <div className="border rounded-lg mt-4 p-4">
          <H4>Details</H4>
          <H4>Loading...</H4>
        </div>
      ) : (
        <>
          {isSubscribed ? (
            <div className="border rounded-lg mt-4 p-4">
              <H4 className="pb-4">Subscription Details</H4>
              <Table className="rounded-[8px] overflow-hidden border-t-0">
                <TableBody className="border-t-0">
                  <TableRow>
                    <TableCell>
                      <strong>Studio</strong>
                    </TableCell>
                    <TableCell>Studio {prices[options.room].room}</TableCell>
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
                      <strong>Duration</strong>
                    </TableCell>
                    <TableCell>{duration}</TableCell>
                  </TableRow>

                  {subHasHours && foundSub && (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Available Hours</strong>
                        </TableCell>
                        <TableCell>{foundSub.availableHours}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Remaining Hours</strong>
                        </TableCell>
                        <TableCell>
                          {foundSub.availableHours - duration}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {options.engDuration >= 1 && (
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
                  )}

                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>${total}.00 CAD</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-4">
                {duration !== 4 ? (
                  <div className="alert">
                    <span>Please select one 4 Hour session</span>
                  </div>
                ) : subHasHours ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsLoading(true);
                      submitSubscriptionBooking();
                    }}
                    disabled={isLoading || options.loading}
                  >
                    {isLoading || options.loading
                      ? "Redirecting..."
                      : "Book Time"}
                  </Button>
                ) : (
                  <div className="alert">
                    <span>Hours are not available</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg mt-4 p-4">
              <H4>Booking Details</H4>
              <Table className="rounded-[8px] overflow-hidden border-0">
                <TableBody className="border-t-0">
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

                  {options.engDuration >= 1 && (
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
                  )}

                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>${total}.00 CAD</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="p-4 pt-0">
                {duration <= 1 ? (
                  <div className="alert">
                    <span>Please select a minimum of 2 hours</span>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsLoading(true);
                      submitBooking();
                    }}
                    disabled={isLoading || options.loading}
                  >
                    {isLoading || options.loading
                      ? "Redirecting..."
                      : "Proceed to Payment"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
