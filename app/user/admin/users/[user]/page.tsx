import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import BookingTable from "./bookingtable";

export default async function Page(props: { params: Promise<{ user: string }> }) {
  noStore();
  const { user } = await props.params;
  const userDetails = await prisma.user.findUnique({
    where: {
      id: user,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  const userBookings = await prisma.bookings.findMany({
    where: {
      userId: user,
    },
    orderBy: {
      date: "asc",
    },
  });

  const userMembership = await prisma.memberships.findMany({
    where: {
      userId: user,
    },
  });

  return (
    <>
      <BookingTable user={userDetails} membership={userMembership} bookings={userBookings} />
    </>
  );
}
