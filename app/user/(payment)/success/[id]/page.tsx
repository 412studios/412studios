import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import {
  handleBookingConfirmationEmail,
  handleMembershipUsageEmail,
  handleMembershipConfirmationEmail,
} from "@/lib/email";

export default async function PageSuccess({ params }: { params: Promise<{ id: string }> }) {
  noStore();
  // Await the params promise explicitly
  const resolvedParams = await params;
  const id = resolvedParams.id;

  //HANDLE STANDARD BOOKING CONFIMATION
  const successfulBooking = await prisma.bookings.findUnique({
    where: {
      bookingId: id,
    },
    include: {
      user: true,
    },
  });

  if (successfulBooking) {
    if (successfulBooking.engineerTotal > -1) {
      await prisma.bookings.update({
        where: {
          bookingId: id,
        },
        data: {
          status: "success",
          engineerStatus: "success",
        },
      });
    } else {
      await prisma.bookings.update({
        where: {
          bookingId: id,
        },
        data: {
          status: "success",
          engineerStatus: "cancelled",
        },
      });
    }

    const duration = successfulBooking.endTime + 1 - successfulBooking.startTime;

    //Update membership details
    const membershipUpdateResult = await prisma.memberships.updateMany({
      where: {
        userId: successfulBooking.userId,
        roomId: successfulBooking.roomId,
      },
      data: {
        availableHours: {
          decrement: duration,
        },
      },
    });

    // If membership hours were decremented, send notification email
    if (membershipUpdateResult.count > 0) {
      await handleMembershipUsageEmail(successfulBooking, prisma);
    }

    // Send email confirmation for booking
    await handleBookingConfirmationEmail(successfulBooking, prisma);
  }

  // HANDLE CONFIRMING MEMBERSHIP + RETRIEVING ID FOR CANCELLING
  const successfulMembership = await prisma.memberships.findUnique({
    where: {
      membershipId: id,
    },
    include: {
      user: true,
    },
  });

  //Set membership as active when membership is purchased
  if (successfulMembership) {
    const now = new Date();
    // First day of the current month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const formattedFirstDayOfMonth = `${firstDayOfMonth.getFullYear()}${String(
      firstDayOfMonth.getMonth() + 1
    ).padStart(2, "0")}01`;
    // First day of the next month
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const formattedFirstDayOfNextMonth = `${firstDayOfNextMonth.getFullYear()}${String(
      firstDayOfNextMonth.getMonth() + 1
    ).padStart(2, "0")}01`;

    await prisma.memberships.update({
      where: {
        membershipId: id,
      },
      data: {
        status: "active",
        currentPeriodStart: parseInt(formattedFirstDayOfMonth),
        currentPeriodEnd: parseInt(formattedFirstDayOfNextMonth),
      },
    });

    // Send email confirmation for membership
    await handleMembershipConfirmationEmail(successfulMembership, prisma);
  }

  return (
    <>
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Card className="w-[350px]">
          <div className="p-6">
            <div className="flex w-full justify-center">
              <Check className="h-12 w-12 rounded-full bg-green-500/30 p-2 text-green-500" />
            </div>
            <div className="mt-3 w-full text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6">Payment Successful</h3>
              <div className="mt-5 w-full sm:mt-6">
                <Button className="w-full" asChild>
                  <Link href="/user/profile">Go to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
