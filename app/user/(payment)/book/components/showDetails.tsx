"use client";
import { useCallback, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  timeSlots,
  subscriptionTimeSlots,
} from "@/app/user/(payment)/book/components/timeSlots";
import { H4 } from "@/components/ui/copy";
import { useDashboard } from "../context";
import {
  validateStandardBooking,
  validateSubscriptionBooking,
} from "../utils/bookingValidation";

// No need to redeclare fbq as it's already declared in FacebookPixel.tsx

export const ShowDetails: React.FC = () => {
  const {
    prices,
    options,
    setOptions,
    isSubscribed,
    isAdmin,
    submitBooking,
    submitSubscriptionBooking,
    submitAdminBooking,
  } = useDashboard();
  // Determine if we should use subscription behavior
  const useSubscriptionSlots = useMemo(
    () => isSubscribed && !isAdmin,
    [isSubscribed, isAdmin]
  );
  // Use useMemo to calculate derived values that depend on options
  const {
    displayStart,
    displayEnd,
    duration,
    bookingTotal,
    engTotal,
    total,
    foundSub,
    subHasHours,
  } = useMemo(() => {
    let displayStart = "Not Selected";
    let displayEnd = "Not Selected";
    let duration = 0;
    let bookingTotal = 0;
    let engTotal = 0;
    let total = 0;

    // Find subscription for current room with proper type safety
    const foundSub =
      options.subscription.find((sub) => sub.roomId === options.room) || null;
    const subHasHours = (foundSub?.availableHours ?? 0) >= 4;

    // Changed: Use useSubscriptionSlots instead of just isSubscribed
    if (useSubscriptionSlots) {
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
          total = Math.min(
            prices[options.room].dayRate,
            duration * prices[options.room].hourlyRate
          );
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
      foundSub,
      subHasHours,
    };
  }, [
    options.startTime,
    options.endTime,
    options.engDuration,
    options.room,
    options.subscription,
    useSubscriptionSlots,
    prices,
  ]);

  // Update total price in global state when it changes
  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      price: total,
    }));
  }, [total, setOptions]);

  // Safely handle button clicks with loading state managed in context
  const handleBookingSubmit = useCallback(() => {
    // Track Facebook Pixel event for booking checkout
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        content_type: "studio_booking",
        content_ids: [options.room],
        content_name: `Studio ${prices[options.room].room}`,
        value: total,
        currency: "CAD",
        user_email: options.user?.email || "",
        booking_date: options.date?.toISOString().split("T")[0],
        booking_hours: duration,
      });
    }

    submitBooking();
  }, [
    submitBooking,
    options.room,
    options.date,
    options.user,
    prices,
    total,
    duration,
  ]);

  const handleSubscriptionSubmit = useCallback(() => {
    // Track Facebook Pixel event for subscription booking checkout
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        content_type: "subscription_booking",
        content_ids: [options.room],
        content_name: `Studio ${prices[options.room].room}`,
        value: total,
        currency: "CAD",
        user_email: options.user?.email || "",
        booking_date: options.date?.toISOString().split("T")[0],
        booking_hours: duration,
      });
    }

    submitSubscriptionBooking();
  }, [
    submitSubscriptionBooking,
    options.room,
    options.date,
    options.user,
    prices,
    total,
    duration,
  ]);

  const handleAdminSubmit = useCallback(() => {
    // Track Facebook Pixel event for admin booking
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout", {
        content_type: "admin_booking",
        content_ids: [options.room],
        content_name: `Studio ${prices[options.room].room}`,
        value: total,
        currency: "CAD",
        admin_user: options.user?.email || "",
        booking_date: options.date?.toISOString().split("T")[0],
        booking_hours: duration,
      });
    }

    submitAdminBooking();
  }, [
    submitAdminBooking,
    options.room,
    options.date,
    options.user,
    prices,
    total,
    duration,
  ]);

  return (
    <div>
      {options.loading ? (
        <div className="border rounded-lg mt-4 p-4">
          <H4>Details</H4>
          <H4>Loading...</H4>
        </div>
      ) : (
        <>
          {/* Changed: Use useSubscriptionSlots instead of just isSubscribed for conditional rendering */}
          {useSubscriptionSlots ? (
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
                          {Math.max(0, foundSub.availableHours - duration)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {options.engDuration >= 1 && options.engStart >= 0 && (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Engineering Start Time</strong>
                        </TableCell>
                        <TableCell>
                          {options.engStart < timeSlots.length
                            ? timeSlots[options.engStart].displayStart
                            : "Invalid time"}
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
                {(() => {
                  const validation = validateSubscriptionBooking(options);
                  if (!validation.isValid) {
                    return (
                      <div className="alert">
                        <span>{validation.message}</span>
                      </div>
                    );
                  }

                  return (
                    <Button
                      className="w-full"
                      onClick={handleSubscriptionSubmit}
                      disabled={options.loading}
                    >
                      {options.loading ? "Redirecting..." : "Book Time"}
                    </Button>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg mt-4 p-4">
              <H4>Booking Details</H4>
              <Table className="rounded-[8px] overflow-hidden border-0">
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

                  {options.engDuration >= 1 && options.engStart >= 0 && (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Engineering Start Time</strong>
                        </TableCell>
                        <TableCell>
                          {options.engStart < timeSlots.length
                            ? timeSlots[options.engStart].displayStart
                            : "Invalid time"}
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
                {(() => {
                  const validation = validateStandardBooking(options);
                  if (!validation.isValid) {
                    return (
                      <div className="alert">
                        <span>{validation.message}</span>
                      </div>
                    );
                  }

                  if (isAdmin) {
                    return (
                      <Button
                        className="w-full"
                        onClick={handleAdminSubmit}
                        disabled={options.loading}
                      >
                        {options.loading ? "Redirecting..." : "ADMIN BOOK"}
                      </Button>
                    );
                  } else {
                    return (
                      <Button
                        className="w-full"
                        onClick={handleBookingSubmit}
                        disabled={options.loading}
                      >
                        {options.loading
                          ? "Redirecting..."
                          : "Proceed to Payment"}
                      </Button>
                    );
                  }
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
