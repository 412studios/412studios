import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, startTime, endTime } = await request.json();

    if (!bookingId || startTime === undefined || endTime === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    // Calculate actual duration: each slot is 1 hour, so duration = (endTime - startTime + 1)
    const actualDuration = endTime - startTime + 1;
    if (actualDuration < 2) {
      return NextResponse.json(
        { error: "Booking must be at least 2 hours long" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.bookings.update({
      where: {
        bookingId: bookingId
      },
      data: {
        startTime: startTime,
        endTime: endTime,
        totalHours: endTime - startTime
      }
    });

    return NextResponse.json({ 
      success: true, 
      booking: updatedBooking 
    });

  } catch (error) {
    console.error("Error updating booking times:", error);
    return NextResponse.json(
      { error: "Failed to update booking times" },
      { status: 500 }
    );
  }
}