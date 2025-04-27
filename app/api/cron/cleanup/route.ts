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

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    console.log(
      `[CRON] Checking for pending bookings before ${fifteenMinutesAgo.toISOString()}`
    );

    const pendingBookings = await prisma.bookings.findMany({
      where: { status: "pending" },
      select: { bookingId: true, createdAt: true, status: true },
    });

    console.log(
      `[CRON] Found ${pendingBookings.length} pending bookings:`,
      pendingBookings.map((b) => `${b.bookingId} (created: ${b.createdAt})`)
    );

    const deletedRows = await prisma.bookings.deleteMany({
      where: {
        status: "pending",
        createdAt: {
          lt: fifteenMinutesAgo,
        },
      },
    });

    console.log(`[CRON] Deleted ${deletedRows.count} old pending rows`);

    return NextResponse.json({
      success: true,
      deleted: deletedRows.count,
      message: `Deleted ${deletedRows.count} old pending bookings`,
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
