import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Section } from "@/components/ui/copy";
import Dashboard from "@/app/user/admin/components/dashboard";

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

export default async function Main() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // deletePendingmembership();
  return (
    <Section>
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <div className="px-4 flex gap-4">
          <Link href="/user/admin/pricing">
            <Button>
              <span>Update Pricing</span>
            </Button>
          </Link>
        </div>
        <CardContent className="p-0">
          <div className="p-4">
            <Dashboard />
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
