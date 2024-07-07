import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import Page from "./page";
import { getPricing } from "@/app/lib/booking";

async function getData({
  email,
  id,
  firstName,
  lastName,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
}) {
  noStore();
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }
}

async function checkVerification(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      role: true,
      isUserVerified: true,
      verifyFormSubmitted: true,
    },
  });
  return data;
}

const formatDateToNumeric = (date: Date | undefined): string => {
  if (!date) return "";
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return year + month + day;
};

async function getSubscription(userId: string) {
  noStore();
  const data = await prisma.subscription.findMany({
    where: {
      userId: userId,
      OR: [
        {
          AND: [{ availableHours: { gt: 0 } }, { status: "cancelled" }],
        },
        {
          status: "active",
        },
      ],
    },
    select: {
      availableHours: true,
      userId: true,
      status: true,
      roomId: true,
    },
    orderBy: {
      roomId: "asc",
    },
  });

  const today = new Date();
  const numericToday = parseInt(formatDateToNumeric(today));

  // Fetch the current subscription details
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: userId,
      currentPeriodEnd: {
        lt: numericToday,
      },
      status: "active",
    },
    select: {
      currentPeriodStart: true,
      currentPeriodEnd: true,
      subscriptionId: true,
    },
  });

  //ADDING HOURS IF ACTIVE SUBSCRIPTION RENEWS
  for (const subscription of subscriptions) {
    //JS AUTO CHANGES DATE TO 01
    const originalDate = new Date(subscription.currentPeriodStart);
    const updatedStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      originalDate.getDate(),
    );
    const numericNewStart = parseInt(formatDateToNumeric(updatedStart));

    const updatedEnd = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      originalDate.getDate(),
    );
    const numericNewEnd = parseInt(formatDateToNumeric(updatedEnd));
    await prisma.subscription.updateMany({
      where: {
        userId: userId,
        subscriptionId: subscription.subscriptionId,
      },
      data: {
        currentPeriodStart: numericNewStart,
        currentPeriodEnd: numericNewEnd,
        availableHours: 16,
      },
    });
  }
  return data;
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  //redirect user of not logged in
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  await getData({
    email: user.email as string,
    firstName: user.given_name as string,
    id: user.id as string,
    lastName: user.family_name as string,
  });

  const subData = await getSubscription(user?.id as string);
  const userDetails = await checkVerification(user?.id as string);
  if (userDetails?.isUserVerified != true) {
    return redirect("/");
  }

  const prices = await getPricing();
  return (
    <>
      <Page user={user} sub={subData} prices={prices} />
    </>
  );
}
