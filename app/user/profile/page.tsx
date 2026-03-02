import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ensureUser, getActiveMemberships } from "@/lib/userData";
import { H4, Section } from "@/components/ui/copy";
import { User, Book, LogOut, Settings } from "lucide-react";

export default async function Page() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (user) {
    await ensureUser({
      email: user.email as string,
      firstName: user.given_name as string,
      id: user.id as string,
      lastName: user.family_name as string,
    });
  }

  const data = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      name: true,
      email: true,
      role: true,
      isUserVerified: true,
      verifyFormSubmitted: true,
    },
  });

  const membershipData = await getActiveMemberships(user?.id as string);

  return (
    <Section>
      <div className="p-8 rounded-lg font-medium border">
        <div className="flex flex-col gap-4">
          {/* TITLE SECTION */}
          <div className="flex">
            <div className="flex items-center px-4">
              <User />
            </div>
            <div>
              {data?.role === "admin" && (
                <p className="text-xs">
                  <Link href="/user/admin">Admin</Link>
                </p>
              )}
              <H4>{data?.name}</H4>
              <p className="text-xs">{data?.email}</p>
            </div>
          </div>
          {/* Membership badge */}
          {membershipData[0]?.status === "success" && (
            <p>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                Membership
              </span>
            </p>
          )}
          {/* Main Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {membershipData[0]?.userId && (
              <Link href="/user/profile/bookings" className="w-full">
                <Button variant="nav" size="sm" className="w-full">
                  View Bookings
                </Button>
              </Link>
            )}
            {membershipData[0]?.userId && (
              <Link href="/user/profile" className="w-full">
                <Button variant="nav" size="sm" className="w-full">
                  Manage Memberships
                </Button>
              </Link>
            )}
          </div>
          {/* Final Links */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/user/profile/settings" className="flex items-center text-xs gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            {data?.isUserVerified && (
              <Link href="/booking" className="flex items-center text-xs gap-2">
                <Book className="h-4 w-4" />
                Book Now
              </Link>
            )}
            <LogoutLink className="flex items-center text-xs gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </LogoutLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
