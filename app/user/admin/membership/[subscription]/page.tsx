import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberInput from "./numinput";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";

export default async function Page(id: any) {
  const membership = await prisma.memberships.findUnique({
    where: {
      membershipId: id.params.membership,
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
      await prisma.memberships.update({
        where: {
          membershipId: id.params.membership,
        },
        data: {
          availableHours: Number(formData.get("num")),
        },
      });
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
    redirect(`/admin/users/${String(membership?.userId)}`);
  }
  return (
    <>
      <Card>
        <CardHeader className="flex w-full justify-between">
          <CardTitle>Membership Details</CardTitle>
          <span className="flex-end">
            <Link href={`/admin/users/${String(membership?.userId)}`}>
              <Button>Back</Button>
            </Link>
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>User:</strong> {membership?.user.name}
            </div>
            <div>
              <strong>Status:</strong> {membership?.status}
            </div>
            <div>
              <strong>Interval:</strong> {membership?.interval}
            </div>
            <div>
              <strong>Current Period Start:</strong>{" "}
              {membership?.currentPeriodStart}
            </div>
            <div>
              <strong>Current Period End:</strong>{" "}
              {membership?.currentPeriodEnd}
            </div>
            <div>
              <strong>Available Hours</strong>
              {membership?.availableHours !== undefined ? (
                <div className="mt-4">
                  <form action={submit}>
                    <NumberInput initialNum={membership?.availableHours} />
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
