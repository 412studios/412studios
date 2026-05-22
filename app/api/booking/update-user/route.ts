import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateCalendarEvent, bookingToEvent } from "@/lib/calendar";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { bookingId, userId } = await request.json();

    if (!bookingId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { bookingId },
      data: { userId },
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
    console.error("Error updating booking user:", error);
    return NextResponse.json({ error: "Failed to update booking user" }, { status: 500 });
  }
}
