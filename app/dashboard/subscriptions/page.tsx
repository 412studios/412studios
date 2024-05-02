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

import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { prices } from "../../booking/components/variables/prices";
import { DeleteSubscription } from "@/app/lib/booking";
import { redirect } from "next/navigation";

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
          AND: [{ availableHours: { lte: 0 } }, { status: "active" }],
        },
      ],
    },
    select: {
      stripeSubscriptionId: true,
      availableHours: true,
      userId: true,
      roomId: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
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

  async function submit(formData: FormData) {
    "use server";
    const itemId = formData.get("itemId") as string;
    try {
      await DeleteSubscription(itemId);
      redirect("/dashboard/subscriptions/cancelled");
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
    redirect("/dashboard/subscriptions/cancelled");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-screen-lg rounded-lg">
        <Card className="p-8">
          <CardHeader>
            {/* <CardTitle>{data?.name}</CardTitle>
            <CardDescription>{data?.email}</CardDescription> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Room</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remaining Hours</TableCell>
                  <TableCell>Book Time</TableCell>
                  <TableCell>Cancel Subscription</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subData.map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell>Room {prices[sub.roomId].room}</TableCell>
                    <TableCell>{sub.status}</TableCell>
                    <TableCell>{sub.availableHours}</TableCell>
                    <TableCell>
                      <Link href="/booking">
                        <Button>Book</Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <form action={submit}>
                        <input
                          name="itemId"
                          className="hidden"
                          value={sub.stripeSubscriptionId}
                        />
                        <Button type="submit">Cancel Subscription</Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard">
              <Button>Back</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
