import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      role: true,
      isUserVerified: true,
      verifyFormSubmitted: true,
    },
  });
  return data;
}

async function getSubscription(userId: string) {
  noStore();
  const data = await prisma.subscription.findMany({
    where: {
      userId: userId,
      OR: [
        {
          AND: [{ availableHours: { gt: 0 } }, { status: "cancelled" }],
        },
        {
          status: "active",
        },
      ],
    },
    select: {
      stripeSubscriptionId: true,
      availableHours: true,
      userId: true,
      roomId: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
    },
  });
  return data;
}

export default async function Main() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);
  const subData = await getSubscription(user?.id as string);

  const rooms = ["A", "B", "C"];

  return (
    <>
      <section className="block h-[calc(100vh-34px)] p-8">
        <div className="p-2 rounded-lg font-medium">
          <Link href="/user/profile">
            <Button>Back</Button>
          </Link>
          <H4 className="mt-4 mb-2">Upcoming Bookings</H4>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remaining Hours</TableCell>
                <TableCell>Book Time</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subData.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>Room {rooms[sub.roomId]}</TableCell>
                  <TableCell>{sub.status}</TableCell>
                  <TableCell>{sub.availableHours}</TableCell>
                  <TableCell>
                    <Link href="/user/book">
                      <Button>Book</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
