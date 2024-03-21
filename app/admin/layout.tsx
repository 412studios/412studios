import { ReactNode } from "react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

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
  return <>{children}</>;
}
