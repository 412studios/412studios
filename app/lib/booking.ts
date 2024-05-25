"use server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import {
  getStripeSession,
  createStripeSubscription,
  deleteStripeSub,
} from "@/app/lib/stripe";

export async function getBooking(roomId: string, date: number, user: any) {
  noStore();
  const data = await prisma.bookings.findMany({
    where: {
      roomId: parseInt(roomId),
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

export async function getSubWeek(roomId: string, date: number, user: any) {
  noStore();
  //CHECK IF A SUBSCRIBED USER HAS ALREADY BOOKED A SESSION THIS WEEK.
  const getWeekBoundaries = (numericDate: number) => {
    const year = Math.floor(numericDate / 10000);
    // Month is zero-based in JavaScript Date
    const month = Math.floor((numericDate % 10000) / 100) - 1;
    const day = numericDate % 100;
    const givenDate = new Date(year, month, day);
    // 0 (Sunday) to 6 (Saturday)
    const dayOfWeek = givenDate.getDay();
    const startOfWeek = new Date(givenDate);
    const endOfWeek = new Date(givenDate);
    // Adjust startOfWeek to the previous Monday (or today if it's Monday)
    startOfWeek.setDate(
      givenDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1),
    );
    startOfWeek.setHours(0, 0, 0, 0);
    // Adjust endOfWeek to the following Sunday
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    // Convert to numeric format YYYYMMDD
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
      roomId: parseInt(roomId),
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
  if (userBooking.length > 0) {
    return true;
  } else {
    return false;
  }
}

export async function PostBooking(input: any, price: number) {
  noStore();
  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  };

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const roomId = input.room;
  const date = input.date;
  const startTime = input.startTime;
  const endTime = input.endTime;
  const duration = input.duration;

  let rate = "hour";
  let priceId = process.env.STRIPE_PRICE_ID_STANDARD_BOOKING as string;

  //HANDLE DB UPDATE
  const bookingId: any = require("crypto").randomBytes(16).toString("hex");
  await prisma.bookings.create({
    data: {
      bookingId: bookingId,
      roomId: parseInt(roomId),
      date: parseInt(formatDateToNumeric(date)),
      type: rate,
      startTime: startTime,
      endTime: endTime,
      userId: user?.id || "",
      status: "pending",
      stripeProductId: priceId,
      totalHours: duration,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      totalPrice: price,
      addDetails: "",
    },
  });

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
  const subscriptionUrl = await getStripeSession({
    customerId: dbUser.stripeCustomerId,
    domainUrl:
      process.env.NODE_ENV === "production"
        ? (process.env.PRODUCTION_URL as string)
        : "http://localhost:3000",
    priceId: priceId,
    bookingId: bookingId,
    unit_amount: price,
  });
  return redirect(subscriptionUrl);
}

export async function PostSubscription(input: any, price: number) {
  noStore();

  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  };

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let subscriptionPriceId = process.env
    .STRIPE_PRICE_ID_STANDARD_SUBSCRIPTION as string;
  const subscriptionId: any = require("crypto").randomBytes(16).toString("hex");

  if (!user) {
    return redirect(`/booking/cancel/${subscriptionId}`);
  } else {
    //HANDLE DB UPDATE
    await prisma.subscription.create({
      data: {
        subscriptionId: subscriptionId,
        stripeSessionId: "",
        stripeSubscriptionId: "",
        interval: "month",
        status: "pending",
        planId: subscriptionPriceId,
        currentPeriodStart: parseInt(formatDateToNumeric(new Date())),
        currentPeriodEnd: parseInt(formatDateToNumeric(new Date())),
        createdAt: new Date(),
        updtedAt: new Date(),
        roomId: input.room,
        availableHours: 16,
        updateHours: new Date(),
        userId: user?.id || "",
      },
    });
  }

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
  const subscriptionUrl = await createStripeSubscription({
    customerId: dbUser.stripeCustomerId,
    domainUrl:
      process.env.NODE_ENV === "production"
        ? (process.env.PRODUCTION_URL as string)
        : "http://localhost:3000",
    priceId: subscriptionPriceId,
    bookingId: subscriptionId,
    unitAmount: price,
  });
  const updatedSubscription = await prisma.subscription.update({
    where: {
      subscriptionId: subscriptionId,
    },
    data: {
      stripeSessionId: subscriptionUrl.id,
    },
  });
  return redirect(subscriptionUrl.url);
}

export async function PostSubscriptionBooking(
  input: any,
  startTime: number,
  endTime: number,
  engFee: number,
) {
  noStore();

  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  };

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const roomId = input.room;
  const date = input.date;
  const duration = endTime - startTime;

  let status = "success";
  if (engFee > 0) {
    status = "pending";
  }

  const bookingId: any = require("crypto").randomBytes(16).toString("hex");
  await prisma.bookings.create({
    data: {
      bookingId: bookingId,
      roomId: parseInt(roomId),
      date: parseInt(formatDateToNumeric(date)),
      type: "hour",
      startTime: startTime,
      endTime: endTime,
      userId: user?.id || "",
      status: status,
      stripeProductId: "none",
      totalHours: duration,
      totalPrice: 0,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      addDetails: "",
    },
  });

  if (engFee > 0) {
    //SEND TO STRIPE
    let priceId = process.env.STRIPE_PRICE_ID_STANDARD_BOOKING as string;
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
    const formatPrice = parseInt(engFee + "00");
    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000",
      priceId: priceId,
      bookingId: bookingId,
      unit_amount: formatPrice,
    });
    return redirect(subscriptionUrl);
  } else {
    //Update subscription details
    await prisma.subscription.updateMany({
      where: {
        userId: input.subscription[input.room].userId,
        roomId: parseInt(input.room),
      },
      data: {
        availableHours:
          input.subscription[input.room].availableHours - (duration + 1),
      },
    });
    return redirect("/dashboard/bookings");
  }
}

export async function CheckAvailability(roomId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const checkRoom = await prisma.subscription.findMany({
    where: {
      roomId: parseInt(roomId),
    },
    select: {
      roomId: true,
      availableHours: true,
    },
  });

  const checkUser = await prisma.subscription.findMany({
    where: {
      userId: user?.id,
      roomId: parseInt(roomId),
    },
    select: {
      roomId: true,
      availableHours: true,
    },
  });
  return [checkRoom.length, checkUser.length];
}

export async function DeleteSubscription(id: string) {
  noStore();
  try {
    const result = await deleteStripeSub(id);
    if (result == true) {
      const deleteSub = await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: id,
        },
        data: {
          status: "cancelled",
        },
      });
    } else {
      const deleteSub = await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: id,
        },
        data: {
          status: "cancelled",
        },
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
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
      subscriptionPrice: true,
      engineerPrice: true,
      userId: true,
    },
  });
  return prices;
}
