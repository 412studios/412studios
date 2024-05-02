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
      <div className="mx-auto max-w-screen-lg border">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>{data?.name}</CardDescription>
            <CardDescription>{data?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users" className="w-full">
              <Button className="w-full">All Users</Button>
            </Link>
          </CardContent>
          <CardFooter>412 Studio</CardFooter>
        </Card>
      </div>
    </main>
  );
}
