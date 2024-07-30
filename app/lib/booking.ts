"use server";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { getStripeSession } from "@/app/lib/stripe";
const priceId = process.env.STRIPE_PRICE_ID_STANDARD_BOOKING as string;

//FUNCTIONS
const formatDate = (date: Date | undefined): number => {
  if (!date) return 0;
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return parseInt(year + month + day);
};

//GET DB DETAILS
export async function getBooking(roomId: string, date: number) {
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

//BOOKING TYPES
export async function PostBooking(input: any) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  //HANDLE DB UPDATE
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
    },
  });
  //SEND TO STRIPE
  return HandlePayment(user, bookingId, priceId, input.price);
}

export async function PostSubscription(input: any) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const subscriptionId: any = require("crypto").randomBytes(16).toString("hex");
  //HANDLE DB UPDATE
  await prisma.subscription.create({
    data: {
      subscriptionId: subscriptionId,
      stripeSessionId: "",
      stripeSubscriptionId: "",
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
  return HandlePayment(user, subscriptionId, priceId, input.price);
}

export async function PostSubscriptionBooking(
  input: any,
  startTime: any,
  endTime: any,
  duration: any,
) {
  noStore();
  //GET DETAILS
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  //CREATE BOOKING AND AUTO SET TO SUCCESS FOR PREPAID SUBSCRIPTION
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
    return HandlePayment(user, bookingId, priceId, input.price);
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
    //FIND SUBSCRIPTION FOR THIS USER AND THIS ROOM
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
}

export async function HandlePayment(
  user: any,
  bookingId: string,
  priceId: string,
  price: number,
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
  const subscriptionUrl = await getStripeSession({
    customerId: dbUser.stripeCustomerId,
    domainUrl:
      process.env.NODE_ENV === "production"
        ? (process.env.PRODUCTION_URL as string)
        : "http://localhost:3000",
    priceId: priceId,
    bookingId: bookingId,
    unit_amount: priceWithTax,
  });
  return redirect(subscriptionUrl);
}
