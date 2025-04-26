import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// Run every minute - cleanup pending bookings older than 15 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    // Create date 15 minutes ago
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    console.log(
      `[CRON] Checking for pending bookings before ${fifteenMinutesAgo.toISOString()}`
    );

    // List pending bookings for debugging
    const pendingBookings = await prisma.bookings.findMany({
      where: { status: "pending" },
      select: { bookingId: true, createdAt: true, status: true },
    });

    console.log(
      `[CRON] Found ${pendingBookings.length} pending bookings:`,
      pendingBookings.map((b) => `${b.bookingId} (created: ${b.createdAt})`)
    );

    // Delete pending bookings older than 15 minutes
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
