import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendBookingReminderEmail } from "@/lib/email";
export const dynamic = "force-dynamic";

async function sendReminderEmails() {
  try {
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Create date range for tomorrow (start and end of day)
    const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const tomorrowEnd = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate() + 1
    );

    // Convert to the date format used in your database (YYYYMMDD as number)
    const tomorrowDateNumber = parseInt(
      tomorrow.getFullYear().toString() +
        (tomorrow.getMonth() + 1).toString().padStart(2, "0") +
        tomorrow.getDate().toString().padStart(2, "0")
    );

    console.log(`[CRON REMINDERS] Looking for bookings on date: ${tomorrowDateNumber}`);

    // Find all confirmed bookings for tomorrow
    const tomorrowBookings = await prisma.bookings.findMany({
      where: {
        date: tomorrowDateNumber,
        status: "confirmed",
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`[CRON REMINDERS] Found ${tomorrowBookings.length} bookings for tomorrow`);

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send reminder emails for each booking
    for (const booking of tomorrowBookings) {
      if (!booking.user?.email) {
        console.warn(`[CRON REMINDERS] No email found for booking ${booking.bookingId}`);
        emailsFailed++;
        continue;
      }

      try {
        // Get studio information
        const studioInfo = await prisma.pricing.findFirst({
          where: {
            id: booking.roomId.toString(),
          },
          select: {
            room: true,
          },
        });

        // Format the booking date
        const bookingDate = new Date(
          Math.floor(booking.date / 10000),
          Math.floor(booking.date % 10000) / 100 - 1,
          booking.date % 100
        ).toDateString();

        // Format time slots
        let startTimeStr = `${booking.startTime}:00`;
        let endTimeStr = `${booking.endTime + 1}:00`;

        try {
          const { timeSlots } = await import("@/app/(public)/booking/components/timeSlots");
          startTimeStr = timeSlots[booking.startTime]?.displayStart || startTimeStr;
          endTimeStr = timeSlots[booking.endTime]?.displayEnd || endTimeStr;
        } catch (timeSlotError) {
          console.warn("[CRON REMINDERS] Could not import timeSlots, using default format");
        }

        const duration = booking.endTime + 1 - booking.startTime;

        // Send reminder email
        const emailResult = await sendBookingReminderEmail(booking.user.email, {
          studioName: `Studio ${studioInfo?.room || booking.roomId}`,
          date: bookingDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: duration,
          price: booking.totalPrice,
          engineeringIncluded: booking.engineerTotal > 0,
        });

        if (emailResult.success) {
          console.log(
            `[CRON REMINDERS] Reminder sent to ${booking.user.email} for booking ${booking.bookingId}`
          );
          emailsSent++;
        } else {
          console.error(
            `[CRON REMINDERS] Failed to send reminder to ${booking.user.email}:`,
            emailResult.error
          );
          emailsFailed++;
        }
      } catch (error) {
        console.error(`[CRON REMINDERS] Error processing booking ${booking.bookingId}:`, error);
        emailsFailed++;
      }
    }

    console.log(
      `[CRON REMINDERS] COMPLETED || ${emailsSent} emails sent || ${emailsFailed} failed`
    );

    return NextResponse.json({
      success: true,
      emailsSent,
      emailsFailed,
      totalBookings: tomorrowBookings.length,
      message: `Sent ${emailsSent} reminder emails for tomorrow's bookings`,
    });
  } catch (error) {
    console.error("[CRON REMINDERS] Error in reminder job:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// GET handler for Vercel cron jobs
export async function GET() {
  return sendReminderEmails();
}

// POST handler for backward compatibility
export async function POST() {
  return sendReminderEmails();
}
