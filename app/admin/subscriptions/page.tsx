import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubTable from "./subtable";
import prisma from "@/app/lib/db";

export default async function Page() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return (
    <>
      <Card>
        <CardHeader className="flex w-full justify-between">
          <CardTitle>Subscriptions</CardTitle>
          <span className="flex-end">
            <Link href="/admin/">
              <Button>Back</Button>
            </Link>
          </span>
        </CardHeader>
        <CardContent>
          <SubTable subscriptions={subscriptions} />
        </CardContent>
      </Card>
    </>
  );
}
