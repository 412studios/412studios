import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberInput from "./numinput";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";

export default async function Page(id: any) {

  const subscription = await prisma.subscription.findUnique({
    where: {
      subscriptionId: id.params.subscription,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  async function submit(formData: FormData) {
    "use server";
    try {
      await prisma.subscription.update({
        where: {
          subscriptionId: id.params.subscription,
        },
        data: {
          availableHours: Number(formData.get("num")),
        },
      });
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
    redirect(`/admin/users/${String(subscription?.userId)}`);
  }
  return (
    <>
      <Card>
        <CardHeader className="flex w-full justify-between">
          <CardTitle>Subscription Details</CardTitle>
          <span className="flex-end">
            <Link href={`/admin/users/${String(subscription?.userId)}`}>
              <Button>Back</Button>
            </Link>
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>User:</strong> {subscription?.user.name}
            </div>
            <div>
              <strong>Status:</strong> {subscription?.status}
            </div>
            <div>
              <strong>Interval:</strong> {subscription?.interval}
            </div>
            <div>
              <strong>Current Period Start:</strong>{" "}
              {subscription?.currentPeriodStart}
            </div>
            <div>
              <strong>Current Period End:</strong>{" "}
              {subscription?.currentPeriodEnd}
            </div>
            <div>
              <strong>Available Hours</strong>
              {subscription?.availableHours !== undefined ? (
                <div className="mt-4">
                  <form action={submit}>
                    <NumberInput initialNum={subscription?.availableHours} />
                    <Button type="submit" className="mt-4 w-full">
                      Submit
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="mt-4">Not available</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
