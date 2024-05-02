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
import { prices } from "@/app/booking/components/variables/prices";

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
      roomId: roomId,
      date: parseInt(formatDateToNumeric(date)),
      type: rate,
      startTime: startTime,
      endTime: endTime,
      userId: user?.id || "",
      status: "pending",
      stripeProductId: priceId,
      totalHours: duration,
      totalPrice: price,
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
    // unit_amount: price,
    unit_amount: 100,
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

  const bookingId: any = require("crypto").randomBytes(16).toString("hex");
  await prisma.bookings.create({
    data: {
      bookingId: bookingId,
      roomId: roomId,
      date: parseInt(formatDateToNumeric(date)),
      type: "hour",
      startTime: startTime,
      endTime: endTime,
      userId: user?.id || "",
      status: "pending",
      stripeProductId: "none",
      totalHours: duration,
      totalPrice: 0,
    },
  });

  await prisma.subscription.updateMany({
    where: {
      userId: input.subscription[input.room].userId,
      roomId: input.room,
    },
    data: {
      availableHours:
        input.subscription[input.room].availableHours - (duration + 1),
    },
  });
  return redirect("/dashboard/bookings");
}

export async function CheckAvailability(roomId: number) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const checkRoom = await prisma.subscription.findMany({
    where: {
      roomId: roomId,
    },
    select: {
      roomId: true,
      availableHours: true,
    },
  });

  const checkUser = await prisma.subscription.findMany({
    where: {
      userId: user?.id,
      roomId: roomId,
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
