import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { updateCalendarEvent } from "@/app/lib/calendar";

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
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Update calendar event if it exists
    if (updatedBooking.addDetails) {
      try {
        const bookingEvent = {
          bookingId: updatedBooking.bookingId,
          roomId: updatedBooking.roomId,
          date: updatedBooking.date,
          startTime: updatedBooking.startTime,
          endTime: updatedBooking.endTime,
          userId: updatedBooking.userId,
          userName: updatedBooking.user?.name || undefined,
          userEmail: updatedBooking.user?.email || "",
          engineerTotal: updatedBooking.engineerTotal,
          engineerStart: updatedBooking.engineerStart,
          totalPrice: updatedBooking.totalPrice,
          status: updatedBooking.status
        };
        
        await updateCalendarEvent(updatedBooking.addDetails, bookingEvent);
      } catch (calendarError) {
        console.error("Error updating calendar event:", calendarError);
        // Continue even if calendar update fails
      }
    }

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