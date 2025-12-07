"use server";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getStripeSession } from "@/lib/stripe";
const priceId = process.env.STRIPE_PRICE_ID_STANDARD_BOOKING as string;

const formatDate = (date: Date | undefined): number => {
  if (!date) return 0;
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return parseInt(year + month + day);
};

//GET DB DETAILS
export async function getBooking(roomId: number, date: number) {
  noStore();
  const data = await prisma.bookings.findMany({
    where: {
      roomId: roomId,
      date: date,
    },
    select: {
      roomId: true,
      date: true,
      type: true,
      startTime: true,
      endTime: true,
    },
  });
  return data;
}

export async function getAllBooking() {
  noStore();
  const data = await prisma.bookings.findMany({
    select: {
      bookingId: true,
      roomId: true,
      date: true,
      startTime: true,
      endTime: true,
      status: true,
      user: true,
      engineerTotal: true,
      engineerStart: true,
      engineerStatus: true,
    },
  });
  return data;
}

export async function deleteBooking(id: string) {
  noStore();
  
  // First, get the booking with its calendar event ID
  const booking = await prisma.bookings.findUnique({
    where: {
      bookingId: id,
    },
    select: {
      bookingId: true,
      addDetails: true, // This contains the calendar event ID
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Delete the calendar event if it exists
  if (booking.addDetails) {
    const { deleteCalendarEvent } = await import("@/lib/calendar");
    try {
      await deleteCalendarEvent(booking.addDetails);
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      // Continue with booking deletion even if calendar deletion fails
    }
  }

  // Delete the booking from database
  const data = await prisma.bookings.delete({
    where: {
      bookingId: id,
    },
    select: {
      bookingId: true,
    },
  });
  
  return data;
}

export async function getMembershipWeek(
  roomId: number,
  date: number,
  user: any
) {
  noStore();

  const getWeekBoundaries = (numericDate: number) => {
    const year = Math.floor(numericDate / 10000);
    const month = Math.floor((numericDate % 10000) / 100) - 1;
    const day = numericDate % 100;
    const givenDate = new Date(year, month, day);

    const dayOfWeek = givenDate.getDay();
    const startOfWeek = new Date(givenDate);
    const endOfWeek = new Date(givenDate);

    startOfWeek.setDate(
      givenDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    );
    startOfWeek.setHours(0, 0, 0, 0);

    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfWeekNumeric =
      startOfWeek.getFullYear() * 10000 +
      (startOfWeek.getMonth() + 1) * 100 +
      startOfWeek.getDate();
    const endOfWeekNumeric =
      endOfWeek.getFullYear() * 10000 +
      (endOfWeek.getMonth() + 1) * 100 +
      endOfWeek.getDate();
    return { startOfWeekNumeric, endOfWeekNumeric };
  };

  const { startOfWeekNumeric, endOfWeekNumeric } = getWeekBoundaries(date);

  const userBooking = await prisma.bookings.findMany({
    where: {
      userId: user.id,
      roomId: roomId,
      date: {
        gte: startOfWeekNumeric,
        lte: endOfWeekNumeric,
      },
    },
    select: {
      roomId: true,
      date: true,
      type: true,
      startTime: true,
      endTime: true,
    },
  });

  //GET MEMBERSHIP DETAILS FOR WEEK MAX EXCEPTION
  const userMembership = await prisma.memberships.findMany({
    where: {
      userId: user.id,
      roomId: roomId,
    },
    select: {
      weekMax: true,
      roomId: true,
    },
  });

  // CHECK FOR MAX WEEK EXCEPTION
  const hasWeekMaxException = userMembership.some(
    (membership: any) =>
      membership.roomId === roomId && membership.weekMax === false
  );

  if (hasWeekMaxException) {
    return false;
  }

  // RETURN BOOKING LIMIT DETAILS IF NO EXCEPTION
  return userBooking.length > 0;
}

export async function getPricing() {
  noStore();
  // Fetch pricing data from the database
  const prices = await prisma.pricing.findMany({
    select: {
      id: true,
      room: true,
      dayRate: true,
      hourlyRate: true,
      img: true,
      membershipPrice: true,
      engineerPrice: true,
      userId: true,
      blocked: true,
    },
  });
  return prices;
}

// BOOKING TYPES
export async function PostBooking(input: any) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // HANDLE DB UPDATE
  const bookingId: string = require("crypto").randomBytes(16).toString("hex");

  await prisma.bookings.create({
    data: {
      bookingId: bookingId,
      roomId: parseInt(input.room),
      date: formatDate(input.date),
      type: "hour",
      startTime: input.startTime,
      endTime: input.endTime,
      status: "pending",
      userId: user?.id || "",
      stripeProductId: priceId,
      totalHours: input.duration,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      totalPrice: input.price,
      addDetails: "",
      offerCodeId: input.offerCodeId || null,
      discountAmount: input.discountAmount || 0,
    },
  });

  // Process payment
  return HandlePayment(user, bookingId, priceId, input.price);
}

// BOOKING TYPES
export async function PostAdminBooking(input: any) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // HANDLE DB UPDATE
  const bookingId: string = require("crypto").randomBytes(16).toString("hex");

  // Get user details for email notification
  const userToBook = await prisma.user.findUnique({
    where: {
      id: input.user?.id || user?.id,
    },
    select: {
      email: true,
      name: true,
    },
  });

  // Get studio name for the email
  const studioInfo = await prisma.pricing.findFirst({
    where: {
      id: input.room.toString(),
    },
    select: {
      room: true,
    },
  });

  // Create calendar event for admin booking
  let calendarEventId: string | null = null;
  try {
    const { createCalendarEvent } = await import("@/lib/calendar");
    calendarEventId = await createCalendarEvent({
      bookingId,
      roomId: parseInt(input.room),
      date: formatDate(input.date),
      startTime: input.startTime,
      endTime: input.endTime,
      userId: input.user?.id || user?.id || "",
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      totalPrice: input.price,
      status: "success",
    });
  } catch (error) {
    console.error("Failed to create calendar event:", error);
  }

  await prisma.bookings.create({
    data: {
      bookingId: bookingId,
      roomId: parseInt(input.room),
      date: formatDate(input.date),
      type: "hour",
      startTime: input.startTime,
      endTime: input.endTime,
      status: "success",
      userId: input.user?.id || user?.id || "",
      stripeProductId: priceId,
      totalHours: input.duration,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      totalPrice: input.price,
      addDetails: calendarEventId || "",
    },
  });

  try {
    // Import dynamically to avoid circular dependencies
    const { sendBookingConfirmationEmail } = await import("@/lib/email");

    // Format date for email
    const bookingDate = input.date
      ? input.date.toDateString()
      : new Date(
          Math.floor(formatDate(input.date) / 10000),
          Math.floor(formatDate(input.date) % 10000) / 100 - 1,
          formatDate(input.date) % 100
        ).toDateString();

    // Get time slot display strings
    const { timeSlots } = await import(
      "@/app/user/(payment)/book/components/timeSlots"
    );
    const startTimeStr =
      timeSlots[input.startTime]?.displayStart || `${input.startTime}:00`;
    const endTimeStr =
      timeSlots[input.endTime]?.displayEnd || `${input.endTime + 1}:00`;

    if (userToBook?.email) {
      await sendBookingConfirmationEmail(userToBook.email, {
        studioName: `Studio ${studioInfo?.room || input.room}`,
        date: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        duration: input.duration,
        price: input.price,
        engineeringIncluded: input.engDuration > 0,
      });
    }
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    // Don't block the booking process if email fails
  }

  return redirect("/user/admin");
}

export async function PostMembership(input: any) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const membershipId: any = require("crypto").randomBytes(16).toString("hex");

  //HANDLE DB UPDATE
  await prisma.memberships.create({
    data: {
      membershipId: membershipId,
      stripeSessionId: "",
      stripeMembershipId: "",
      interval: "month",
      status: "pending",
      planId: priceId,
      currentPeriodStart: formatDate(new Date()),
      currentPeriodEnd: formatDate(new Date()),
      createdAt: new Date(),
      updtedAt: new Date(),
      roomId: parseInt(input.id),
      availableHours: 16,
      updateHours: new Date(),
      userId: user?.id || "",
    },
  });

  //SEND TO STRIPE
  return HandlePayment(user, membershipId, priceId, input.price);
}

export async function PostMembershipBooking(
  input: any,
  startTime: any,
  endTime: any,
  duration: any
) {
  noStore();
  //GET DETAILS
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  //CREATE BOOKING AND AUTO SET TO SUCCESS FOR PREPAID MEMBERSHIP
  const bookingId: any = require("crypto").randomBytes(16).toString("hex");

  await prisma.bookings.create({
    data: {
      bookingId: bookingId,
      roomId: parseInt(input.room),
      date: formatDate(input.date),
      type: "hour",
      startTime: startTime,
      endTime: endTime,
      userId: user?.id || "",
      status: "pending",
      stripeProductId: "none",
      totalHours: duration,
      totalPrice: input.price,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      addDetails: "",
    },
  });

  //CHECK IF PAYMENT IS NEEDED
  if (input.price > 0) {
    const paymentUrl = await HandlePayment(
      user,
      bookingId,
      priceId,
      input.price
    );
    return { success: true, bookingId, paymentUrl };
  } else {
    //DO THIS IF SUCCESSFUL
    //MARK COMPLETE BOOKING IS SUCCESFUL
    await prisma.bookings.update({
      where: {
        bookingId: bookingId,
      },
      data: {
        status: "success",
      },
    });

    // Create calendar event for successful membership booking
    try {
      const { createCalendarEvent } = await import("@/lib/calendar");
      const calendarEventId = await createCalendarEvent({
        bookingId,
        roomId: parseInt(input.room),
        date: formatDate(input.date),
        startTime: startTime,
        endTime: endTime,
        userId: user?.id || "",
        engineerTotal: input.engDuration,
        engineerStart: input.engStart,
        totalPrice: input.price,
        status: "success",
      });

      // Update booking with calendar event ID
      if (calendarEventId) {
        await prisma.bookings.update({
          where: { bookingId: bookingId },
          data: { addDetails: calendarEventId },
        });
      }
    } catch (error) {
      console.error("Failed to create calendar event for membership booking:", error);
    }
    //FIND MEMBERSHIP FOR THIS USER AND THIS ROOM
    const updatedMembership = await prisma.memberships.findFirst({
      where: {
        userId: user?.id,
        roomId: parseInt(input.room),
      },
    });
    // REMOVE HOURS FROM MEMBERSHIP
    if (updatedMembership) {
      // Update membership hours
      const updatedMembershipResult = await prisma.memberships.update({
        where: {
          membershipId: updatedMembership.membershipId,
        },
        data: {
          availableHours: {
            decrement: duration,
          },
        },
      });

      // Get user email for notification
      try {
        // Get user details for email
        const userDetails = await prisma.user.findUnique({
          where: {
            id: user?.id,
          },
          select: {
            email: true,
            name: true,
          },
        });

        // Get studio info
        const studioInfo = await prisma.pricing.findFirst({
          where: {
            id: input.room.toString(),
          },
          select: {
            room: true,
          },
        });

        // Get formatted time details
        const { timeSlots } = await import(
          "@/app/user/(payment)/book/components/timeSlots"
        );
        const startTimeStr =
          timeSlots[input.startTime]?.displayStart || `${input.startTime}:00`;
        const endTimeStr =
          timeSlots[input.endTime]?.displayEnd || `${input.endTime + 1}:00`;

        // Format date for display
        const bookingDate = input.date.toDateString();

        // Send email notification about hours usage
        if (userDetails?.email) {
          console.log(
            "Sending membership hours usage email to:",
            userDetails.email
          );

          const { sendMembershipUsageEmail } = await import("@/lib/email");
          await sendMembershipUsageEmail(userDetails.email, {
            studioName: `Studio ${studioInfo?.room || input.room}`,
            date: bookingDate,
            startTime: startTimeStr,
            endTime: endTimeStr,
            hoursUsed: duration,
            remainingHours: updatedMembershipResult.availableHours,
            bookingId: bookingId,
          });

          console.log("Membership hours usage email sent successfully");
        }
      } catch (emailError) {
        console.error(
          "Failed to send membership hours usage email:",
          emailError
        );
        // Don't block the booking process if email fails
      }
    }
    return redirect("/user/profile/");
  }
}

export async function HandlePayment(
  user: any,
  bookingId: string,
  priceId: string,
  price: number
) {
  // Calculate the final price including Canadian tax
  const formatPrice = parseInt(price + "00");
  const CANADIAN_TAX_RATE = 0.13;
  const priceWithTax = Math.round(formatPrice * (1 + CANADIAN_TAX_RATE));

  //SEND TO STRIPE
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!dbUser?.stripeCustomerId) {
    throw new Error("Unable to get customer id");
  }

  const membershipUrl = await getStripeSession({
    customerId: dbUser.stripeCustomerId,
    domainUrl:
      process.env.NODE_ENV === "production"
        ? (process.env.PRODUCTION_URL as string)
        : "http://localhost:3000",
    priceId: priceId,
    bookingId: bookingId,
    unit_amount: priceWithTax,
  });

  return redirect(membershipUrl);
}
