import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { unstable_noStore as noStore } from "next/cache";
import { getPricing } from "@/app/lib/booking";
import { DashboardProvider } from "./context";
import { Pricing, Memberships, User } from "@prisma/client";

// Define the type for prices
type PricesMap = {
  [key: number]: Pricing;
};

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

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
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

async function getMembership(userId: string) {
  noStore();
  const data = await prisma.memberships.findMany({
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

  // Fetch the current membership details
  const membership = await prisma.memberships.findMany({
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
      membershipId: true,
    },
  });
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

  const membershipData = await getMembership(user?.id as string);
  const userDetails = await checkVerification(user?.id as string);
  if (userDetails?.isUserVerified != true) {
    return redirect("/");
  }

  // Convert user to full Prisma User object
  const fullUser = (await prisma.user.findUnique({
    where: { id: user.id as string },
  })) as User;

  const prices = (await getPricing()) as PricesMap;

  return (
    <DashboardProvider
      userData={fullUser}
      membershipData={membershipData as Memberships[]}
      pricingData={prices}
    >
      {children}
    </DashboardProvider>
  );
}
