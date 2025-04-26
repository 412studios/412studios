"use server";

import prisma from "./db";

declare module "node-cron";

async function setupCron() {
  const cron = (await import("node-cron")).default;

  // Run every 30 minutes - cleanup pending bookings older than 15 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
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
    } catch (error) {
      console.error("[CRON] Error in cleanup job:", error);
    }
  });
}

// Only call setupCron if running server-side
if (typeof window === "undefined") {
  setupCron();
}
