import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
      <div className="mx-auto max-w-screen-lg">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b-4 p-4">
              <CardDescription>{data?.name}</CardDescription>
              <CardDescription>{data?.email}</CardDescription>
            </div>
            <div className="p-4">
              <Link href="/admin/bookings/0" className="w-full">
                <Button className="w-full">View Booking Calendar</Button>
              </Link>
              <Link href="/admin/pricing" className="w-full">
                <Button className="w-full mt-4">Update Pricing</Button>
              </Link>
              <Link href="/admin/users" className="w-full">
                <Button className="w-full mt-4">View All Users</Button>
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
    </main>
  );
}
