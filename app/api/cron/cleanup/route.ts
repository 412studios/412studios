import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
export const dynamic = "force-dynamic";

async function cleanupPendingBookings() {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const deletedBookings = await prisma.bookings.deleteMany({
      where: {
        status: "pending",
        createdAt: {
          lt: fifteenMinutesAgo,
        },
      },
    });

    const deletedSubscriptions = await prisma.subscription.deleteMany({
      where: {
        status: "pending",
        createdAt: {
          lt: fifteenMinutesAgo,
        },
      },
    });

    console.log(
      `[CRON] DELETED || ${deletedBookings.count} bookings || ${deletedSubscriptions.count} subscriptions`
    );

    return NextResponse.json({
      success: true,
      deletedBookings: deletedBookings.count,
      deletedSubscriptions: deletedSubscriptions.count,
      message: `Deleted ${deletedBookings.count} old pending bookings and ${deletedSubscriptions.count} old pending subscriptions`,
    });
  } catch (error) {
    console.error("[CRON] Error in cleanup job:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Added GET handler to support Vercel cron jobs
export async function GET() {
  return cleanupPendingBookings();
}

// Maintain POST handler for backward compatibility
export async function POST() {
  return cleanupPendingBookings();
}
