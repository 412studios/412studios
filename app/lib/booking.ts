"use server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";

export async function getBooking(roomId: number, date: number) {
  noStore();
  const data = await prisma.bookings.findMany({
    where: {
      roomId: roomId,
      date: date,
    },
    select: {
      roomId: true,
      date: true,
      type: true,
      startTime: true,
      endTime: true,
    },
  });

  return data;
}
