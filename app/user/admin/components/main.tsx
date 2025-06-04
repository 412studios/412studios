import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Dashboard() {
  noStore();
  const room = ["A", "B", "C"];
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  const members = await prisma.memberships.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  const bookings = await prisma.bookings.findMany({
    select: {
      bookingId: true,
      roomId: true,
      date: true,
      startTime: true,
      endTime: true,
      user: true,
    },

    // bookingId       String   @id
    // roomId          Int
    // date            Int
    // user            User     @relation(fields: [userId], references: [id])
    // bookingId       String   @id
    // roomId          Int
    // date            Int
    // type            String   @default("hour")
    // startTime       Int
    // endTime         Int
    // status          String   @default("pending")
    // userId          String
    // stripeProductId String
    // totalHours      Int
    // totalPrice      Float
    // engineerTotal   Int
    // engineerStart   Int
    // engineerStatus  String
    // addDetails      String
    // createdAt       DateTime @default(now())
    // user            User     @relation(fields: [userId], references: [id])
  });

  return (
    <Tabs defaultValue="users">
      <TabsList className="mb-4">
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="bookings" className="overflow-hidden">
        {bookings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell>{room[booking.roomId]}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.startTime}</TableCell>
                  <TableCell>{booking.endTime}</TableCell>
                  <TableCell>{booking.user.name ?? ""}</TableCell>
                  <TableCell>
                    <Link href={`/user/admin/book/${booking.bookingId}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
            No bookings available
          </div>
        )}
      </TabsContent>
      <TabsContent value="users">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="p-4 border-b">
              <h3 className="font-semibold">{user.name ?? ""}</h3>
              <p className="text-gray-600">{user.email ?? ""}</p>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
            No users available
          </div>
        )}
      </TabsContent>
      <TabsContent value="members">
        {members.length > 0 ? (
          members.map((membership) => (
            <div key={membership.user.id} className="p-4 border-b">
              <h3 className="font-semibold">{membership.user.name ?? ""}</h3>
              <p className="text-gray-600">{membership.user.email ?? ""}</p>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
            No members available
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
