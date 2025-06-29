import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { google } from "googleapis";

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

    // Test environment variables
    const requiredEnvVars = {
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? "✓ Set" : undefined,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        missing: missingVars,
        setup: requiredEnvVars,
      });
    }

    // Test Google Calendar API connection
    try {
      const credentials = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      await auth.authorize();
      const calendar = google.calendar({ version: 'v3', auth });

      // Test calendar access
      const calendarInfo = await calendar.calendars.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
      });

      return NextResponse.json({
        success: true,
        message: "Google Calendar integration is working!",
        calendar: {
          id: calendarInfo.data.id,
          summary: calendarInfo.data.summary,
          description: calendarInfo.data.description,
        },
        setup: requiredEnvVars,
      });
    } catch (calendarError: any) {
      return NextResponse.json({
        success: false,
        error: "Calendar API connection failed",
        details: calendarError.message,
        setup: requiredEnvVars,
      });
    }
  } catch (error: any) {
    console.error("Calendar test error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Test failed", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}