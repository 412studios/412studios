import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateCalendarEvent, bookingToEvent } from "@/lib/calendar";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validStatuses = ["pending", "success", "cancelled", "failed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { bookingId },
      data: { status },
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
    console.error("Error updating booking status:", error);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
