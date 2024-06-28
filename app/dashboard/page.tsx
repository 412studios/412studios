import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  CreditCard,
  Shield,
  Book,
  Plus,
  Notebook,
  RefreshCw,
} from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getData(userId: string) {
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
    },
  });
  return data;
}

export default async function Main() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);
  const subData = await getSubscription(user?.id as string);

  return (
    <main className="pt-8">
      <div className="mx-auto max-w-screen-xl rounded-lg">
        <Card>
          <CardHeader>
            <CardTitle>{data?.name}</CardTitle>
          </CardHeader>
          <div className="border-b-4 p-4">
            <CardDescription>{data?.email}</CardDescription>
            {typeof subData[0] !== "undefined" &&
              subData[0].status === "success" && (
                <p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    Subscribed
                  </span>
                </p>
              )}
          </div>

          <CardContent className="">
            {data?.isUserVerified && (
              <div>
                <Link href="/pricing">
                  <span className="hover:bg-accent hover:text-accent-forground group mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
                    <Plus className="text-primary mr-2 h-4 w-4" />
                    <span>Book Now</span>
                  </span>
                </Link>
              </div>
            )}

            {typeof subData[0] !== "undefined" && subData[0].userId && (
              <Link href="/dashboard/subscriptions">
                <span className="hover:bg-accent hover:text-accent-forground group mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <RefreshCw className="text-primary mr-2 h-4 w-4" />
                  <span>Manage Subscriptions</span>
                </span>
              </Link>
            )}

            {typeof subData[0] !== "undefined" && subData[0].userId && (
              <Link href="/dashboard/bookings">
                <span className="hover:bg-accent hover:text-accent-forground group mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Book className="text-primary mr-2 h-4 w-4" />
                  <span>View Booking Details</span>
                </span>
              </Link>
            )}

            <Link href="/dashboard/settings">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Settings className="text-primary mr-2 h-4 w-4" />
                <span>Settings</span>
              </span>
            </Link>

            {data?.role === "admin" && (
              <Link
                href="/admin"
                className="hover:bg-accent hover:text-accent-forground group mt-2 flex items-center rounded-md px-3 py-2 text-sm font-medium"
              >
                <Shield className="text-primary mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
          </CardContent>

          <CardFooter>
            <LogoutLink>
              <Button>Logout</Button>
            </LogoutLink>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
