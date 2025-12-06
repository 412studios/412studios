import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";

// Using a separate API route pattern for Next.js 15.2+
export default async function PageCancel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params promise explicitly
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Process the cancellation with the resolved ID
  try {
    // Handle booking cancellation
    const bookingToDelete = await prisma.bookings.findUnique({
      where: {
        bookingId: id,
      },
    });

    if (bookingToDelete) {
      await prisma.bookings.deleteMany({
        where: {
          date: bookingToDelete.date,
          startTime: bookingToDelete.startTime,
          endTime: bookingToDelete.endTime,
          roomId: bookingToDelete.roomId,
          status: "pending",
        },
      });
    }

    // Handle membership cancellation
    const successfulMembership = await prisma.memberships.findUnique({
      where: {
        membershipId: id,
      },
    });

    if (successfulMembership) {
      await prisma.memberships.deleteMany({
        where: {
          membershipId: id,
        },
      });
    }
  } catch (error) {
    console.error("Error in cancellation process:", error);
    // Continue to show the cancellation page even if there's an error
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex w-full justify-center">
            <XIcon className="h-12 w-12 rounded-full bg-red-500/30 p-2 text-red-500" />
          </div>
          <div className="mt-3 w-full text-center sm:mt-5">
            <h3 className="text-lg font-medium leading-6">Payment Cancelled</h3>
            <div className="mt-2">
              <p className="text-muted-foreground text-sm">
                Unfortunately a processing error has occured. You wont be
                charged. Please try to book again through the dashboard.
              </p>
            </div>
            <div className="mt-5 w-full sm:mt-6">
              <Button className="w-full" asChild>
                <Link href="/studios">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
