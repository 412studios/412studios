import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

// Disable Next.js body parsing, we don't need it for this endpoint
export const dynamic = "force-dynamic";

// Common function for both GET and POST requests
async function cleanupPendingBookings() {
  try {
    // Vercel secret verification, if desired
    // const authorization = request.headers.get("authorization");
    // if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const fifteenMinutesAgo = new Date(Date.now());

    // Check all statuses for bookings
    const allBookingStatuses = await prisma.bookings.findMany({
      select: { status: true },
      distinct: ["status"],
    });

    const pendingBookings = await prisma.bookings.findMany({
      where: { status: "pending" },
      select: { bookingId: true, createdAt: true, status: true },
    });

    const pendingSubscriptions = await prisma.subscription.findMany({
      where: { status: "pending" },
      select: { subscriptionId: true, createdAt: true, status: true },
    });

    // First find the pending bookings that are older than 15 minutes
    const bookingsToDelete = await prisma.bookings.findMany({
      where: {
        status: "pending",
        createdAt: {
          lt: fifteenMinutesAgo,
        },
      },
      select: { bookingId: true, createdAt: true, status: true },
    });

    // Then attempt to delete them
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
