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

  const getWeekBoundaries = (numericDate: number) => {
    const year = Math.floor(numericDate / 10000);
    const month = Math.floor((numericDate % 10000) / 100) - 1;
    const day = numericDate % 100;
    const givenDate = new Date(year, month, day);

    const dayOfWeek = givenDate.getDay();
    const startOfWeek = new Date(givenDate);
    const endOfWeek = new Date(givenDate);

    startOfWeek.setDate(
      givenDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1),
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
  //GET SUBSCRIPTION DETAILS FOR WEEK MAX EXCEPTION
  const userSubscription = await prisma.subscription.findMany({
    where: {
      userId: user.id,
      roomId: parseInt(roomId),
    },
    select: {
      weekMax: true,
      roomId: true,
    },
  });

  //CHECK FOR MAX WEEK EXCEPTION
  const hasWeekMaxException = userSubscription.some(
    (subscription: any) =>
      subscription.roomId === parseInt(roomId) &&
      subscription.weekMax === false,
  );
  if (hasWeekMaxException) {
    return false;
  }
  //RETURN BOOKING LIMIT DETAILS IF NO EXCEPTION
  return userBooking.length > 0;
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

  let engineerTotal = input.endTime;
  let engineerStart = input.duration;
  if (input.engDuration == -1) {
    engineerTotal = -1;
    engineerStart = -1;
  }

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
      engineerTotal: engineerTotal,
      engineerStart: engineerStart,
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

  // Calculate the final price including Canadian tax
  const CANADIAN_TAX_RATE = 0.13;
  const priceWithTax = Math.round(price * (1 + CANADIAN_TAX_RATE));
  console.log(priceWithTax);

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
    unitAmount: priceWithTax,
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
  duration: number,
) {
  noStore();

  // DATE FORMAT OPTIONS
  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    date.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return year + month + day;
  };

  // GET DETAILS
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const roomId = input.room;
  const date = new Date(input.date); // Ensure the input date is a Date object

  // CREATE BOOKING AND AUTO SET TO SUCCESS FOR PREPAID SUBSCRIPTION
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
      status: "success",
      stripeProductId: "none",
      totalHours: duration,
      totalPrice: 0,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      addDetails: "",
    },
  });

  // FIND SUBSCRIPTION FOR THIS USER AND THIS ROOM
  const updatedSubscription = await prisma.subscription.findFirst({
    where: {
      userId: user?.id,
      roomId: parseInt(input.room),
    },
  });

  // REMOVE HOURS FROM SUBSCRIPTION
  if (updatedSubscription) {
    await prisma.subscription.update({
      where: {
        subscriptionId: updatedSubscription.subscriptionId,
      },
      data: {
        availableHours: {
          decrement: duration,
        },
      },
    });
  }
  return redirect("/dashboard/bookings");
}

export async function PostSubscriptionBookingWithPurchase(
  input: any,
  startTime: number,
  endTime: number,
  duration: number,
  total: number,
) {
  noStore();
  //DATE FORMAT OPTIONS
  const formatDateToNumeric = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  };
  //GET DETAILS
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const roomId = input.room;
  const date = input.date;
  //CREATE BOOKING PENDING ENGINEER PAYMENT
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
      status: "pending",
      stripeProductId: "none",
      totalHours: duration,
      totalPrice: total,
      engineerTotal: input.engDuration,
      engineerStart: input.engStart,
      engineerStatus: "pending",
      addDetails: "",
    },
  });
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
  const subscriptionUrl = await getStripeSession({
    customerId: dbUser.stripeCustomerId,
    domainUrl:
      process.env.NODE_ENV === "production"
        ? (process.env.PRODUCTION_URL as string)
        : "http://localhost:3000",
    priceId: priceId,
    bookingId: bookingId,
    unit_amount: total,
  });
  return redirect(subscriptionUrl);
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

export async function getSubscriptions(id: number) {
  noStore();

  const data = await prisma.subscription.findMany({
    where: {
      roomId: id,
    },
    select: {
      subscriptionId: true,
      user: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      createdAt: true,
      updtedAt: true,
      roomId: true,
      availableHours: true,
      userId: true,
      weekMax: true,
    },
  });
  return data;
}

export async function getBookingsWithUser() {
  noStore();
  const data = await prisma.bookings.findMany({
    select: {
      bookingId: true,
      roomId: true,
      date: true,
      type: true,
      startTime: true,
      endTime: true,
      userId: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
}

export async function getSubscriptionsWithUser() {
  const data = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
}

export async function getSubscriptionWithUser(id: string) {
  const data = await prisma.subscription.findUnique({
    where: {
      subscriptionId: id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
}

export async function updateSubscription(id: string, hours: number) {
  const updatedSubscription = await prisma.subscription.update({
    where: {
      subscriptionId: id,
    },
    data: {
      availableHours: hours,
    },
  });
  return updatedSubscription;
}
