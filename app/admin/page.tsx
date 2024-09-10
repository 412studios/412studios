import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
  Settings,
  CreditCard,
  Shield,
  Book,
  Plus,
  Notebook,
  RefreshCw,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getUserDetails(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
  return data;
}

async function deletePendingSubscriptions() {
  noStore();
  try {
    const today = new Date();
    // Delete subscriptions where status is 'pending' and createdAt is before today
    const deletedSubscriptions = await prisma.subscription.deleteMany({
      where: {
        status: "pending",
        createdAt: {
          lt: today,
        },
      },
    });
    // Log the number of deleted subscriptions
    console.log("Deleted Subscriptions:", deletedSubscriptions.count);
    return deletedSubscriptions;
  } catch (error) {
    console.error("Error deleting pending subscriptions:", error);
    throw error; // Rethrow the error if needed for further handling
  }
}

export default async function Main() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);

  deletePendingSubscriptions();

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b-4 p-4">
              <CardDescription>{userDetails?.name}</CardDescription>
              <CardDescription>{userDetails?.email}</CardDescription>
            </div>
            <div className="p-4">
              <Link href="/admin/users">
                <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Book className="text-primary mr-2 h-4 w-4" />
                  <span>Users</span>
                </span>
              </Link>
              <Link href="/admin/subscriptions">
                <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Book className="text-primary mr-2 h-4 w-4" />
                  <span>Subscriptions</span>
                </span>
              </Link>
              <Link href="/admin/bookings/">
                <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Book className="text-primary mr-2 h-4 w-4" />
                  <span>Bookings</span>
                </span>
              </Link>
              <Link href="/admin/pricing">
                <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                  <Book className="text-primary mr-2 h-4 w-4" />
                  <span>Update Pricing</span>
                </span>
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Back</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
