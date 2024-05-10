import { ReactNode } from "react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function isAdmin(userId: string): Promise<boolean> {
  const userRole = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return userRole?.role === "admin";
}

export default async function AdminDashboard({
  children,
}: {
  children: ReactNode;
}) {
  "use server";
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userIsAdmin = await isAdmin(user?.id as string);
  if (!userIsAdmin) {
    return redirect("/");
  }
  return (
    <main className="p-8">
      <div className="mx-auto max-w-screen-lg">
        <div className="pb-8">
          <div className="flex">
            <div className="w-full">
              <Link href="/admin/bookings/0" className="w-full">
                <Button className="w-full">Room A</Button>
              </Link>
            </div>
            <div className="w-full px-2">
              <Link href="/admin/bookings/1" className="w-full">
                <Button className="w-full">Room B</Button>
              </Link>
            </div>
            <div className="w-full">
              <Link href="/admin/bookings/2" className="w-full">
                <Button className="w-full">Room C</Button>
              </Link>
            </div>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
