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
import { timeSlots, subscriptionTimeSlots } from "./timeSlots";
import {
  PostBooking,
  PostSubscriptionBooking,
  PostSubscriptionBookingWithPurchase,
} from "@/app/lib/booking";

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

  let isSubscribed = false;
  let areSubHoursAvailable = false;
  let activeSubscription: any = [];
  if (options.subRooms.includes(parseInt(options.room)) == true) {
    isSubscribed = true;
  }

  let displayStart = "Not Selecetd";
  let displayEnd = "Not Selecetd";
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
        if (sub.roomId === parseInt(options.room)) {
          activeSubscription = sub;
        }
      });
      //VERIFY IF HOURS ARE AVAILABLE
      if (activeSubscription.availableHours >= 4) {
        areSubHoursAvailable = true;
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
      displayStart = "Not Selecetd";
      displayEnd = "Not Selecetd";
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
      displayStart = "Not Selecetd";
      displayEnd = "Not Selecetd";
      duration = 0;
      total = 0;
    }
  }

  // //SUBMIT DETAILS
  const submit = async () => {
    setIsLoading(true);
    try {
      await PostBooking(options, parseInt(total + "00"));
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  const submitSubscription = async () => {
    setIsLoading(true);
    const startTime = options.startTime * 4;
    const endTime = options.endTime * 4 + 3;
    try {
      await PostSubscriptionBooking(options, startTime, endTime, duration);
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  const submitSubscriptionPurchase = async () => {
    // setIsLoading(true);
    const startTime = options.startTime * 4;
    const endTime = options.endTime * 4 + 3;
    try {
      await PostSubscriptionBookingWithPurchase(
        options,
        startTime,
        endTime,
        duration,
        parseInt(total + "00"),
      );
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  return (
    <div className="m-2">
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
          {/* SHOW SUBSCRIPTION OR STANDARD BOOKING DETAILS */}
          {/* SUBSCRIPTION DETAILS */}
          {isSubscribed == true ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
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
                          <strong>Duration</strong>
                        </TableCell>
                        <TableCell>{duration}</TableCell>
                      </TableRow>
                      {areSubHoursAvailable ? (
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
                </CardContent>
                <CardFooter>
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
                          {/* SWITCH TO BOOK WITH CHECKOUT IF ENGINEER ADDED */}
                          {options.engDuration > 0 ? (
                            <>
                              <Button
                                className="w-full"
                                onClick={submitSubscriptionPurchase}
                                disabled={isLoading}
                              >
                                {isLoading
                                  ? "Redirecting..."
                                  : "Proceed to Payment"}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                className="w-full"
                                onClick={submitSubscription}
                                disabled={isLoading}
                              >
                                {isLoading ? "Redirecting..." : "Book Time"}
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {/* PREVENT BOOKING WITHOUT HOURS */}
                          <Button
                            className="w-full"
                            onClick={submit}
                            disabled={true}
                          >
                            Hours are not available
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </CardFooter>
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
                  <Table>
                    <TableBody>
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
                      {isLoading ? "Redirecting..." : "Proceed to Payment"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};
