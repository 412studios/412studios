import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/app/lib/stripe";
import { H4 } from "@/components/ui/copy";

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

async function getMembership(user: any) {
  noStore();
  //RETURN Membership DETAILS
  const data = await prisma.memberships.findMany({
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
  const membershipData = await getMembership(user);

  return (
    <>
      <section className="block h-[calc(100vh-34px)] p-8">
        <div className="p-2 rounded-lg font-medium">
          {/* TITLE SECTION */}
          <div className="p-2">
            <H4>412 Studios Profile</H4>
            <p>Name: {data?.name}</p>
            <p>Email: {data?.email}</p>
          </div>
          {/* membership DETAILS SECTION */}
          <div>
            {typeof membershipData[0] !== "undefined" &&
              membershipData[0].status === "success" && (
                <p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    Membership
                  </span>
                </p>
              )}
          </div>
          {/* MENU LINKS */}
          <div className="flex flex-col gap-2 max-w-[400px]">
            {typeof membershipData[0] !== "undefined" &&
              membershipData[0].status === "success" && (
                <p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    Membership
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
            {typeof membershipData[0] !== "undefined" &&
              membershipData[0].userId && (
                <Link href="/user/profile/membership">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start px-2"
                  >
                    Manage Memberships
                  </Button>
                </Link>
              )}
            {typeof membershipData[0] !== "undefined" &&
              membershipData[0].userId && (
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
