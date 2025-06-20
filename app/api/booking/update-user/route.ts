import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

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