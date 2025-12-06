import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, roomId, date, startTime, endTime } = await request.json();

    const conflictingBookings = await prisma.bookings.findMany({
      where: {
        roomId: roomId,
        date: date,
        bookingId: {
          not: bookingId
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });

    return NextResponse.json({ 
      hasConflict: conflictingBookings.length > 0,
      conflictCount: conflictingBookings.length 
    });

  } catch (error) {
    console.error("Error checking booking conflict:", error);
    return NextResponse.json(
      { error: "Failed to check booking conflict" },
      { status: 500 }
    );
  }
}