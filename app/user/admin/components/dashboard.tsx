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
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      {/* BOOKINGS SECTION */}
      <TabsContent value="bookings">
        <Bookings />
      </TabsContent>
      <TabsContent value="users">
        <Users />
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
