import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import prisma from "@/app/lib/db";

export default async function PageSuccess(context: any) {
  async function postData(id: any) {
    "use server";

    const successfulBooking = await prisma.bookings.findUnique({
      where: {
        bookingId: id,
      },
    });

    if (successfulBooking) {
      await prisma.bookings.update({
        where: {
          bookingId: id,
        },
        data: {
          status: "success",
        },
      });

      // Delete duplicate bookings
      await prisma.bookings.deleteMany({
        where: {
          date: successfulBooking.date,
          startTime: successfulBooking.startTime,
          endTime: successfulBooking.endTime,
          roomId: successfulBooking.roomId,
          status: "pending",
          // Do not delete successful booking
          bookingId: {
            not: id,
          },
        },
      });
    }
  }

  await postData(context.params.id);

  return (
    <main className="m-4">
      <div className="flex min-h-[80vh] w-full items-center justify-center ">
        <Card className="w-[350px]">
          <div className="p-6">
            <div className="flex w-full justify-center">
              <Check className="h-12 w-12 rounded-full bg-green-500/30 p-2 text-green-500" />
            </div>
            <div className="mt-3 w-full text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6">
                Payment Successful
              </h3>
              {/* <div className="mt-2">
                <p className="text-muted-foreground text-sm">
                  Payment Successful
                </p>
              </div> */}
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
