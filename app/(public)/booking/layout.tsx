import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { getPricing } from "@/lib/booking";
import { ensureUser, getActiveMemberships } from "@/lib/userData";
import { DashboardProvider } from "./context";
import { Pricing, Memberships, User } from "@prisma/client";

type PricesMap = {
  [key: string]: Pricing;
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let fullUser: User | null = null;
  let membershipData: Memberships[] = [];

  if (user) {
    await ensureUser({
      email: user.email as string,
      firstName: user.given_name as string,
      id: user.id as string,
      lastName: user.family_name as string,
    });

    membershipData = await getActiveMemberships(user.id as string);

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
