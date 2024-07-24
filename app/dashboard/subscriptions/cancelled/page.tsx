import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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

import { DeleteSubscription } from "@/app/lib/booking";

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
  return (
    <Card className="w-[350px] mx-auto">
      <div className="p-6">
        <div className="flex w-full justify-center">
          <Check className="h-12 w-12 rounded-full bg-green-500/30 p-2 text-green-500" />
        </div>
        <div className="mt-3 w-full text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6">
            Your subscription has been cancelled
          </h3>
          <div className="mt-5 w-full sm:mt-6">
            <Button className="w-full" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
