import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import BookingTable from "./bookingtable";

export default async function Page(props: any) {
  noStore();
  const userDetails = await prisma.user.findUnique({
    where: {
      id: props.params.user,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  const userBookings = await prisma.bookings.findMany({
    where: {
      userId: props.params.user,
    },
    orderBy: {
      date: "asc",
    },
  });

  const userSubs = await prisma.subscription.findMany({
    where: {
      userId: props.params.user,
    },
  });

  return (
    <>
      <BookingTable
        user={userDetails}
        subs={userSubs}
        bookings={userBookings}
      />
    </>
  );
}
