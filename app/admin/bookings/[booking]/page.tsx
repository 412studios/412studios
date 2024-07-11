import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { timeSlots } from "@/app/booking/components/timeSlots";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function Page(id: any) {
  noStore();

  const roomName = ["A", "B", "C"];

  const booking = await prisma.bookings.findUnique({
    where: {
      bookingId: id.params.booking,
    },
    select: {
      roomId: true,
      date: true,
      startTime: true,
      endTime: true,
      status: true,
      userId: true,
      totalPrice: true,
      engineerTotal: true,
      engineerStart: true,
      engineerStatus: true,
    },
  });

  async function submit() {
    "use server";
    await prisma.bookings.delete({
      where: {
        bookingId: id.params.booking,
      },
    });
    redirect(`/admin/bookings/`);
  }

  const numericToDate = (numericDate: string): string => {
    if (numericDate.length !== 8) return "";

    const year = numericDate.substring(0, 4);
    const month = parseInt(numericDate.substring(4, 6), 10) - 1;
    const day = numericDate.substring(6, 8);

    const date = new Date(parseInt(year), month, parseInt(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(price / 100);
  }

  return (
    <main className="pt-8">
      <div className="mx-auto max-w-screen-xl">
        <Card className="">
          <CardHeader className="flex w-full justify-between">
            <CardTitle>Bookings</CardTitle>
            <span className="flex-end">
              <Link href="/admin/">
                <Button>Back</Button>
              </Link>
            </span>
          </CardHeader>
          <CardContent>
            <form action={submit}>
              <div className="space-y-4">
                <Table className="h-[40vh]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Room</TableCell>
                      <TableCell>
                        {booking ? roomName[booking?.roomId] : <></>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>
                        {booking ? (
                          numericToDate(booking?.date.toString())
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Start Time</TableCell>
                      <TableCell>
                        {booking ? (
                          timeSlots[booking.startTime].displayStart
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>End Time</TableCell>
                      <TableCell>
                        {booking ? (
                          timeSlots[booking.endTime].displayEnd
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>{booking?.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Price</TableCell>
                      <TableCell>
                        {booking ? formatPrice(booking?.totalPrice) : <></>}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Engineer Total</TableCell>
                      <TableCell>
                        {booking?.engineerTotal === -1 ? (
                          <>NA</>
                        ) : (
                          <>{booking?.engineerTotal}</>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Engineer Start</TableCell>
                      <TableCell>
                        {booking?.engineerStart === -1 ? (
                          <>NA</>
                        ) : (
                          <>{booking?.engineerStart}</>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Engineer Status</TableCell>
                      <TableCell>{booking?.engineerStatus}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Button type="submit" className="mt-4 w-full">
                  Delete Booking
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
