import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { syncAllBookingsToCalendar } from "@/app/lib/calendar";

export const runtime = 'nodejs';
export const maxDuration = 60;

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

    // Check if Google Calendar is configured
    if (!process.env.GOOGLE_CALENDAR_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: "Google Calendar not configured",
        message: "Please configure Google Calendar environment variables first",
      }, { status: 400 });
    }

    // Trigger calendar sync
    console.log("Starting calendar sync from API endpoint...");
    await syncAllBookingsToCalendar();
    console.log("Calendar sync completed from API endpoint");

    return NextResponse.json({
      success: true,
      message: "Calendar sync completed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Calendar sync error:", error);
    
    // More specific error handling
    let errorMessage = "Failed to sync calendar";
    let statusCode = 500;
    
    if (error.message?.includes("authentication")) {
      errorMessage = "Google Calendar authentication failed - check service account credentials";
      statusCode = 401;
    } else if (error.message?.includes("connection pool")) {
      errorMessage = "Database connection timeout - try again in a moment";
      statusCode = 503;
    } else if (error.message?.includes("Calendar not found")) {
      errorMessage = "Google Calendar not found - check calendar ID and permissions";
      statusCode = 404;
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }
}

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      syncEnabled: !!(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    });
  } catch (error) {
    console.error("Calendar info error:", error);
    return NextResponse.json(
      { error: "Failed to get calendar info" },
      { status: 500 }
    );
  }
}