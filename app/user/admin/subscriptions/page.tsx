import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionTable from "./subscriptiontable";
import prisma from "@/app/lib/db";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

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
      <Section>
        <div className="flex w-full justify-between px-4 pb-0">
          <H4>Subscriptions</H4>
          <span className="flex-end">
            <Link href="/user/admin/">
              <Button>Back</Button>
            </Link>
          </span>
        </div>
        <CardContent>
          <SubscriptionTable subscriptions={subscriptions} />
        </CardContent>
      </Section>
    </>
  );
}
