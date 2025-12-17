import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { unstable_noStore as noStore } from "next/cache";
import { getPricing } from "@/lib/booking";
import { DashboardProvider } from "./context";
import { Pricing, Memberships, User } from "@prisma/client";

// Define the type for prices
type PricesMap = {
  [key: string]: Pricing;
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
    orderBy: {
      roomId: "asc",
    },
  });

  return data;
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Check if user is logged in but don't redirect
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let fullUser: User | null = null;
  let membershipData: Memberships[] = [];

  // If user is logged in, fetch their data
  if (user) {
    await getData({
      email: user.email as string,
      firstName: user.given_name as string,
      id: user.id as string,
      lastName: user.family_name as string,
    });

    membershipData = await getMembership(user?.id as string);

    // Convert user to full Prisma User object
    fullUser = (await prisma.user.findUnique({
      where: { id: user.id as string },
    })) as User;
  }

  const pricingArray = await getPricing();
  const prices: PricesMap = pricingArray.reduce((acc, price) => {
    acc[price.id] = price;
    return acc;
  }, {} as PricesMap);

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
