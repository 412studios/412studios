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
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/app/lib/stripe";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

async function getData(user: any) {
  noStore();

  //POPULATE USER DETAILS IF USER IS NEW
  if (user) {
    const checkUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        id: true,
        stripeCustomerId: true,
      },
    });

    const name = `${user.given_name ?? ""} ${user.family_name ?? ""}`;
    const email = `${user.email ?? ""}`;

    if (!checkUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: email,
          name: name,
        },
      });
    }

    const data = await stripe.customers.create({
      email: email,
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }

  //RETURN USER DETAILS
  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
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

async function getSubscription(user: any) {
  noStore();
  //RETURN SUBSCRIPTION DETAILS
  const data = await prisma.subscription.findMany({
    where: {
      userId: user.id,
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

export default async function Page() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user);
  const subData = await getSubscription(user);

  return (
    <>
      <section className="block mt-[34px] h-[calc(100vh-34px)] p-8">
        <div className="p-2 rounded-lg font-medium">
          {/* TITLE SECTION */}
          <div className="p-2">
            <H4>412 Studios Profile</H4>
            <p>Name: {data?.name}</p>
            <p>Email: {data?.email}</p>
          </div>
          {/* SUBSCRIPTION DETAILS SECTION */}
          <div>
            {typeof subData[0] !== "undefined" &&
              subData[0].status === "success" && (
                <p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    Subscribed
                  </span>
                </p>
              )}
          </div>
          {/* MENU LINKS */}
          <div className="flex flex-col gap-2 max-w-[400px]">
            {typeof subData[0] !== "undefined" &&
              subData[0].status === "success" && (
                <p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    Subscribed
                  </span>
                </p>
              )}
            {data?.isUserVerified && (
              <Link href="/user/book/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start px-2"
                >
                  Book Now
                </Button>
              </Link>
            )}
            {typeof subData[0] !== "undefined" && subData[0].userId && (
              <Link href="/user/profile/subscriptions">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start px-2"
                >
                  Manage Memberships
                </Button>
              </Link>
            )}
            {typeof subData[0] !== "undefined" && subData[0].userId && (
              <Link href="/user/profile/bookings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start px-2"
                >
                  View Booking Details
                </Button>
              </Link>
            )}
            <Link href="/user/profile/settings">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left justify-start px-2"
              >
                Settings
              </Button>
            </Link>
            {data?.role === "admin" && (
              <Link href="/user/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start px-2"
                >
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <LogoutLink>
              <Button variant="ghost" size="sm" className="px-2 border-[1px]">
                Logout
              </Button>
            </LogoutLink>
          </div>
        </div>
      </section>
    </>
  );
}
