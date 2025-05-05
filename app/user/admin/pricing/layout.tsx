import prisma from "@/app/lib/db";
import Page from "./page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";

import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

async function getPricing() {
  const prices = await prisma.pricing.findMany();
  return prices;
}

export default async function Main() {
  "use server";
  const prices = await getPricing();
  async function submit(formData: FormData) {
    "use server";
    for (let i = 0; i < prices.length; i++) {
      const data: any = {
        dayRate: parseInt(formData.get(i + "day") as string),
        hourlyRate: parseInt(formData.get(i + "hour") as string),
        membershipPrice: parseInt(formData.get(i + "membership") as string),
        engineerPrice: parseInt(formData.get(i + "eng") as string),
        blocked: formData.get(i + "blocked") === "true",
      };
      await prisma.pricing.update({
        where: {
          id: i.toString(),
        },
        data,
      });
    }
    return redirect("/user/admin");
  }

  return (
    <>
      <Section>
      <Card>
        <form action={submit}>
          <CardHeader>
            <CardTitle>Update Pricing</CardTitle>
          </CardHeader>
          <div className="px-4 flex gap-4">
            <Link href="/user/admin">
              <Button>Back</Button>
            </Link>
            <Button type="submit">Submit</Button>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio</TableHead>
                  <TableHead>Blocked</TableHead>
                  <TableHead>Day Rate</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead>Membership Rate</TableHead>
                  <TableHead>Engineer Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Page prices={prices} />
              </TableBody>
            </Table>
          </CardContent>
        </form>
        </Card>
      </Section>
    </>
  );
}
