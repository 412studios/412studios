import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { timeSlots } from "@/app/user/(payment)/book/components/timeSlots";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

async function getBookings(userId: string) {
  noStore();
  const today = new Date();
  // Ensure the integer date format matches your database format (YYYYMMDD)
  const todayInt = parseInt(
    `${today.getFullYear()}${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`
  );

  const bookings = await prisma.bookings.findMany({
    where: {
      userId: userId,
      date: {
        gte: todayInt, // Filters out bookings before today's date
      },
    },
    orderBy: {
      date: "asc", // Ensures bookings are ordered by date in ascending order
    },
  });
  return bookings;
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const bookings = await getBookings(user?.id as string);

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

  function fromatTime(i: number): string {
    const hour = i % 24;
    return `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour} ${
      hour < 12 || hour === 24 ? "AM" : "PM"
    }`;
  }

  const rooms = ["A", "B", "C"];

  return (
    <>
      <section className="block mt-[34px] h-[calc(100vh-34px)] p-8">
        <div className="p-2 rounded-lg font-medium">
          <Link href="/user/profile">
            <Button>Back</Button>
          </Link>
          <H4 className="mt-4 mb-2">Upcoming Bookings</H4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                {/* <TableHead>Total</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>Studio {rooms[booking.roomId]}</TableCell>
                  <TableCell>
                    {numericToDate(booking.date.toString())}
                  </TableCell>
                  <TableCell>
                    {fromatTime(
                      parseInt(timeSlots[booking.startTime].startTime)
                    )}
                  </TableCell>
                  <TableCell>
                    {fromatTime(
                      parseInt(timeSlots[booking.endTime].startTime) + 1
                    )}
                  </TableCell>
                  {/* <TableCell>$ {booking.totalPrice}.00</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
