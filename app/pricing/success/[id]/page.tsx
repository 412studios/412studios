import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { getStripeSubId } from "@/app/lib/stripe";

export default async function PageSuccess(context: any) {
  //GET ID
  // console.log(context.params.id);

  //HANDLE STANDARD BOOKING CONFIMATION
  const successfulBooking = await prisma.bookings.findUnique({
    where: {
      bookingId: context.params.id,
    },
  });
  if (successfulBooking) {
    await prisma.bookings.update({
      where: {
        bookingId: context.params.id,
      },
      data: {
        status: "success",
      },
    });
  }

  // HANDLE CONFIRMING SUBSCRIPTION + RETRIEVING ID FOR CANCELLING
  const successfulSub = await prisma.subscription.findUnique({
    where: {
      subscriptionId: context.params.id,
    },
  });

  if (successfulSub?.stripeSessionId) {
    const test = await getStripeSubId(successfulSub?.stripeSessionId);
    await prisma.subscription.update({
      where: {
        subscriptionId: context.params.id,
      },
      data: {
        stripeSubscriptionId: test.subscription?.toString(),
        status: "active",
      },
    });
  }

  return (
    <main className="m-4">
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Card className="w-[350px]">
          <div className="p-6">
            <div className="flex w-full justify-center">
              <Check className="h-12 w-12 rounded-full bg-green-500/30 p-2 text-green-500" />
            </div>
            <div className="mt-3 w-full text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6">
                Payment Successful
              </h3>
              <div className="mt-5 w-full sm:mt-6">
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
