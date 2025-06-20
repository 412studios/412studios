import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ["pending", "success", "cancelled", "failed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.bookings.update({
      where: {
        bookingId: bookingId
      },
      data: {
        status: status
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

    return NextResponse.json({ 
      success: true, 
      booking: updatedBooking 
    });

  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}