import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Section } from "@/components/ui/copy";
import Dashboard from "./components/main";

import { Book, Mail } from "lucide-react";

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
          {/* 
          <Link href="/user/admin/email-template">
            <Button>
              <span>Email Template</span>
            </Button>
          </Link> 
          */}
        </div>
        <CardContent className="p-0">
          <div className="p-4">
            <Dashboard />
            {/* <Link href="/user/admin/users">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Book className="text-primary mr-2 h-4 w-4" />
                <span>Users</span>
              </span>
            </Link>
            <Link href="/user/admin/membership">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Book className="text-primary mr-2 h-4 w-4" />
                <span>Memberships</span>
              </span>
            </Link>
            <Link href="/user/admin/book/">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Book className="text-primary mr-2 h-4 w-4" />
                <span>Bookings</span>
              </span>
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
