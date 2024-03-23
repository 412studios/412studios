import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  CreditCard,
  Shield,
  Book,
  Plus,
  Notebook,
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

export default async function Main() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  return (
    <main className="p-8">
      <div className="mx-auto max-w-screen-lg rounded-lg">
        <Card className="p-8">
          <h1 className="text-4xl">{data?.name}</h1>
          <p className="text-muted-foreground text-lg">{data?.email}</p>

          <div className="mb-4 mt-4 border"></div>
          {data?.isUserVerified && (
            <div>
              <Link href="/booking">
                <span className="hover:bg-accent hover:text-accent-forground group mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Plus className="text-primary mr-2 h-4 w-4" />
                  <span>Book Now</span>
                </span>
              </Link>
              <Link href="/dashboard/bookings">
                <span className="hover:bg-accent hover:text-accent-forground group mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Notebook className="text-primary mr-2 h-4 w-4" />
                  <span>View Bookings</span>
                </span>
              </Link>
            </div>
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

          <div className="mb-4 mt-4 border"></div>

          <p>
            <LogoutLink>
              <Button>Logout</Button>
            </LogoutLink>
          </p>
        </Card>
      </div>
    </main>
  );
}
