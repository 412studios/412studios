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
import { TimeSlot } from "@/types/booking";

interface BookingDetails {
  displayStart: string;
  displayEnd: string;
  duration: number;
  bookingTotal: number;
  engTotal: number;
  total: number;
}

export const ShowDetails: React.FC = () => {
  const {
    prices,
    options,
    setOptions,
    isSubscribed,
    submitBooking,
    submitSubscriptionBooking,
  } = useDashboard();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const calculateBookingDetails = (): BookingDetails => {
    let displayStart = "Not Selected";
    let displayEnd = "Not Selected";
    let duration = 0;
    let bookingTotal = 0;
    let engTotal = 0;
    let total = 0;

    const foundSub = options.subscription.find(
      (sub) => sub.roomId === options.room
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
        }
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
        }
      }
    }

    return {
      displayStart,
      displayEnd,
      duration,
      bookingTotal,
      engTotal,
      total,
    };
  };

  const details = calculateBookingDetails();

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      price: details.total,
    }));
  }, [details.total, setOptions]);

  const handleBookingSubmit = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        await submitSubscriptionBooking();
      } else {
        await submitBooking();
      }
    } catch (error) {
      console.error("Booking submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                    <TableCell>{details.displayStart}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>End Time</strong>
                    </TableCell>
                    <TableCell>{details.displayEnd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Duration</strong>
                    </TableCell>
                    <TableCell>{details.duration}</TableCell>
                  </TableRow>
                  {options.engDuration !== -1 && (
                    <TableRow>
                      <TableCell>
                        <strong>Engineering Fee</strong>
                      </TableCell>
                      <TableCell>${details.engTotal}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="mt-4">
                {details.duration !== 4 ? (
                  <div className="alert">
                    <span>Please select one 4 Hour session</span>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleBookingSubmit}
                    disabled={isLoading || options.loading}
                  >
                    {isLoading || options.loading
                      ? "Redirecting..."
                      : "Book Time"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg mt-4 p-4">
              <H4 className="pb-4">Booking Details</H4>
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
                    <TableCell>{details.displayStart}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>End Time</strong>
                    </TableCell>
                    <TableCell>{details.displayEnd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Duration</strong>
                    </TableCell>
                    <TableCell>{details.duration}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Studio Fee</strong>
                    </TableCell>
                    <TableCell>${details.bookingTotal}</TableCell>
                  </TableRow>
                  {options.engDuration !== -1 && (
                    <TableRow>
                      <TableCell>
                        <strong>Engineering Fee</strong>
                      </TableCell>
                      <TableCell>${details.engTotal}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>${details.total}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="p-4 pt-0">
                {details.duration <= 1 ? (
                  <div className="alert">
                    <span>Please select a minimum of 2 hours</span>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleBookingSubmit}
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
