import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bookings from "@/app/user/admin/components/bookings";
import Users from "@/app/user/admin/components/users";
import Pricing from "@/app/user/admin/components/pricing";
import CalendarSync from "@/app/user/admin/components/calendarSync";

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
  const pricing = await prisma.pricing.findMany({
    select: {
      id: true,
      room: true,
      dayRate: true,
      hourlyRate: true,
      membershipPrice: true,
      engineerPrice: true,
      blocked: true,
    },
  });
  return (
    <Tabs defaultValue="bookings">
      <TabsList className="mb-4">
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>
      {/* BOOKINGS SECTION */}
      <TabsContent value="bookings">
        <Bookings />
      </TabsContent>
      <TabsContent value="users">
        <Users />
      </TabsContent>
      <TabsContent value="pricing">
        <Pricing pricing={pricing} />
      </TabsContent>
      <TabsContent value="calendar">
        <CalendarSync />
      </TabsContent>
    </Tabs>
  );
}
