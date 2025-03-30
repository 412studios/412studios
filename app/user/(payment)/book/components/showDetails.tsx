"use client";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  timeSlots,
  subscriptionTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";
import { PostBooking, PostSubscriptionBooking } from "@/app/lib/booking";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";
import { useDashboard } from "../context";

export let ShowDetails = () => {
  let {
    prices,
    options,
    setOptions,
    isSubscribed,
    areSubHoursAvailable,
    activeSubscription,
  } = useDashboard();

  // Local loading state for UI feedback
  const [isLoading, setIsLoading] = useState(false);

  let displayStart = "Not Selected";
  let displayEnd = "Not Selected";
  let duration = 0;

  let bookingTotal = 0;
  let engTotal = 0;

  let total = 0;

  // IF USER IS SUBSCRIBED
  if (isSubscribed == true) {
    // CHECK IF A TIME HAS BEEN SELECTED
    if (options.startTime != -1) {
      // SET DISPLAY TIME FROM TIMESLOTS
      displayStart = subscriptionTimeSlots[options.startTime].displayStart;
      displayEnd = subscriptionTimeSlots[options.endTime].displayEnd;
      //UPDATE DURATION TO MATCH SUB 4 HOUR SLOTS
      duration = options.endTime - options.startTime + 1 * 4;
      //CURRENT TOTAL SHOULD BE 0 WITH PREPAID SUBSCRIPTION
      total = 0;
      //LOOP THROUGH AVAILABLE THEN IDENTIFY ACTIVE SUBSCRIPTION
      options.subscription.forEach((sub: any) => {
        if (sub.roomId === options.room) {
          activeSubscription = sub;
        }
      });
      //VERIFY IF HOURS ARE AVAILABLE
      if (activeSubscription) {
        if (activeSubscription.availableHours >= 4) {
          areSubHoursAvailable = true;
        } else {
          areSubHoursAvailable = false;
        }
      } else {
        areSubHoursAvailable = false;
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
  } else {
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
  }

  useEffect(() => {
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      price: total,
    }));
  }, [total, setOptions]);

  // Use context functions for submission
  const { submitBooking, submitSubscriptionBooking } = useDashboard();

  return (
    <div>
      {/* GLOBAL LOADING VARIABLE */}
      {options.loading == true ? (
        <div className="border rounded-lg mt-4 p-4">
          <H4>Details</H4>
          <H4>Loading...</H4>
        </div>
      ) : (
        <>
          {/* SHOW SUBSCRIPTION OR STANDARD BOOKING DETAILS */}
          {/* SUBSCRIPTION DETAILS */}
          {isSubscribed == true ? (
            <>
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
                    {areSubHoursAvailable && activeSubscription ? (
                      <>
                        <TableRow>
                          <TableCell>
                            <strong>Available Hours</strong>
                          </TableCell>
                          <TableCell>
                            {activeSubscription.availableHours}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <strong>Remaining Hours</strong>
                          </TableCell>
                          <TableCell>
                            {activeSubscription.availableHours - duration}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <></>
                    )}

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
                <div className="mt-4">
                  {/* ALLOW BOOKING IF ONE 4 HOUR SESSION IS SELECTED AND SUB HOURS ARE AVAILABLE */}
                  {duration != 4 ? (
                    <div className="alert">
                      <span>Please select one 4 Hour session</span>
                    </div>
                  ) : (
                    <>
                      {/* ONLY ALLOW BOOKING IF SUBSCRIPTION HOURS ARE AVAILABLE */}
                      {areSubHoursAvailable ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          {/* PREVENT BOOKING WITHOUT HOURS */}
                          <div className="alert">
                            <span>Hours are not available</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* STANDARD BOOKING DETAILS */}
              <div className="border rounded-lg mt-4 p-4">
                <H4>Booking Details</H4>
                <>
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
                </>
                <div className="p-4 pt-0">
                  {/* ALLOW BOOKING IF LOCAL DURATION IS 2 OR MORE */}
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
            </>
          )}
        </>
      )}
    </div>
  );
};
