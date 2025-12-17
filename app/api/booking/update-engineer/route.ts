import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { bookingId, hasEngineer, engineerStart, engineerEnd } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Calculate engineer total hours
    const engineerTotal = hasEngineer ? engineerEnd - engineerStart + 1 : 0;

    // Update the booking
    await prisma.bookings.update({
      where: {
        bookingId: bookingId,
      },
      data: {
        engineerTotal: engineerTotal,
        engineerStart: hasEngineer ? engineerStart : 0,
        engineerStatus: hasEngineer ? "pending" : "none",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating booking engineer:", error);
    return NextResponse.json({ error: "Failed to update booking engineer" }, { status: 500 });
  }
}
