import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateCalendarEvent, bookingToEvent } from "@/lib/calendar";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { bookingId, startTime, endTime } = await request.json();

    if (!bookingId || startTime === undefined || endTime === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (startTime >= endTime) {
      return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 });
    }

    const actualDuration = endTime - startTime + 1;
    if (actualDuration < 2) {
      return NextResponse.json({ error: "Booking must be at least 2 hours long" }, { status: 400 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { bookingId },
      data: { startTime, endTime, totalHours: endTime - startTime },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (updatedBooking.addDetails) {
      try {
        await updateCalendarEvent(updatedBooking.addDetails, await bookingToEvent(updatedBooking));
      } catch (calendarError) {
        console.error("Error updating calendar event:", calendarError);
      }
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking times:", error);
    return NextResponse.json({ error: "Failed to update booking times" }, { status: 500 });
  }
}
