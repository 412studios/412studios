import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bookings from "@/app/user/admin/components/bookings";
import Users from "@/app/user/admin/components/users";

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
  return (
    <Tabs defaultValue="bookings">
      <TabsList className="mb-4">
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      {/* BOOKINGS SECTION */}
      <TabsContent value="bookings">
        <Bookings />
      </TabsContent>
      <TabsContent value="users">
        <Users />
      </TabsContent>
    </Tabs>
  );
}
