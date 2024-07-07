import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubTable from "./subtable";
import { getSubscriptionsWithUser } from "@/app/lib/booking";

export default async function Page() {
  const subscriptions = await getSubscriptionsWithUser();

  return (
    <>
      <main className="pt-8">
        <div className="mx-auto max-w-screen-xl">
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
        </div>
      </main>
    </>
  );
}
