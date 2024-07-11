import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingsTable from "./bookingstable";
import { getBookingsWithUser } from "@/app/lib/booking";

export default async function Page() {
  noStore();
  const bookings = await getBookingsWithUser();
  return (
    <main className="pt-8">
      <div className="mx-auto max-w-screen-xl">
        <Card className="">
          <CardHeader className="flex w-full justify-between">
            <CardTitle>Bookings</CardTitle>
            <span className="flex-end">
              <Link href="/admin/bookings/create" className="mr-2">
                <Button>Create</Button>
              </Link>
              <Link href="/admin/">
                <Button>Back</Button>
              </Link>
            </span>
          </CardHeader>
          <CardContent>
            <BookingsTable bookings={bookings} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
