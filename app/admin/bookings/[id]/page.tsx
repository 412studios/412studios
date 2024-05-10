import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { redirect } from "next/navigation";
import { prices } from "@/app/booking/components/variables/prices";
import { timeSlots } from "@/app/booking/components/variables/timeSlots";

async function getData() {
  noStore();
  const users = await prisma.user.findMany();
  return users;
}

async function verifyUser(formData: FormData) {
  "use server";
  const id = formData.get("userId") as string;
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      acceptedTerms: true,
      verifyFormSubmitted: true,
      isUserVerified: true,
    },
  });
  redirect("/admin/verify");
}

export default async function Main(context: any) {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight
  const todayISOString = today.toISOString().split("T")[0];

  const bookings = await prisma.bookings.findMany({
    where: {
      roomId: parseInt(context.params.id),
      date: {
        gte: parseInt(todayISOString),
      },
    },
    orderBy: {
      date: "asc",
    },
    select: {
      bookingId: true,
      date: true,
      startTime: true,
      endTime: true,
      userId: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  console.log(bookings);

  function formatNumericDate(numericDate: number): string {
    const dateStr = numericDate.toString();
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const dateObj = new Date(`${year}-${month}-${day}`);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dateObj.toLocaleDateString("en-US", options);
  }

  function convertToStandardHour(militaryHour: any) {
    const period = militaryHour >= 12 ? "PM" : "AM";
    const standardHour = militaryHour % 12 === 0 ? 12 : militaryHour % 12;
    return `${standardHour} ${period}`;
  }

  return (
    <>
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Room {prices[context.params.id].room}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{formatNumericDate(booking.date)}</TableCell>
                  <TableCell>
                    {convertToStandardHour(
                      parseInt(timeSlots[booking.startTime].startTime),
                    )}
                  </TableCell>
                  <TableCell>
                    {convertToStandardHour(
                      parseInt(timeSlots[booking.endTime].startTime) + 1,
                    )}
                  </TableCell>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{booking.user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Link href="/admin/">
            <Button>Back</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
