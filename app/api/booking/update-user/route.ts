import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateCalendarEvent } from "@/lib/calendar";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, userId } = await request.json();

    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updatedBooking = await prisma.bookings.update({
      where: {
        bookingId: bookingId
      },
      data: {
        userId: userId
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
    console.error("Error updating booking user:", error);
    return NextResponse.json(
      { error: "Failed to update booking user" },
      { status: 500 }
    );
  }
}