"use server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";

export async function CheckAdmin(id: string) {
  noStore();
  const data = await prisma.user.findMany({
    where: {
      id: id,
    },
    select: {
      role: true,
    },
  });
  return data;
}
