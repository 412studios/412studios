import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingsTable from "./bookingstable";
import prisma from "@/app/lib/db";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

export default async function Page() {
  noStore();
  const bookings = await prisma.bookings.findMany({
    select: {
      bookingId: true,
      roomId: true,
      date: true,
      type: true,
      startTime: true,
      endTime: true,
      userId: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <Section>
      <div className="flex w-full justify-between px-4 pb-0">
        <H4>Bookings</H4>
        <span className="flex-end">
          <Link href="/user/admin/book/create" className="mr-2">
            <Button>Create</Button>
          </Link>
          <Link href="/user/admin/">
            <Button>Back</Button>
          </Link>
        </span>
      </div>
      <CardContent>
        <BookingsTable bookings={bookings} />
      </CardContent>
    </Section>
  );
}
