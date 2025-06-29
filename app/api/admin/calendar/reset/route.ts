import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const { getPermission } = getKindeServerSession();
    const admin = await getPermission("admin");
    
    if (!admin?.isGranted) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Reset addDetails field for all successful bookings to allow re-sync
    const result = await prisma.bookings.updateMany({
      where: {
        status: 'success',
      },
      data: {
        addDetails: '', // Clear calendar event IDs to allow re-sync
      },
    });

    console.log(`Reset ${result.count} bookings for calendar re-sync`);

    return NextResponse.json({
      success: true,
      message: `Reset ${result.count} bookings for calendar sync`,
      count: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Calendar reset error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to reset calendar sync",
      details: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}