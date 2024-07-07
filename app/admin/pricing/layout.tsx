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
      await prisma.pricing.update({
        where: {
          id: i.toString(),
        },
        data: {
          dayRate: parseInt(formData.get(i + "day") as string),
          hourlyRate: parseInt(formData.get(i + "hour") as string),
          subscriptionPrice: parseInt(formData.get(i + "sub") as string),
          engineerPrice: parseInt(formData.get(i + "eng") as string),
        },
      });
    }
    return redirect("/admin");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-screen-xl">
        <Card>
          <form action={submit}>
            <CardHeader className="flex w-full justify-between">
              <CardTitle>Update Pricing</CardTitle>
              <span className="flex-end">
                <Link href="/admin/">
                  <Button>Back</Button>
                </Link>
              </span>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Day Rate</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Subscription Rate</TableHead>
                    <TableHead>Engineer Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Page prices={prices} />
                  <TableRow>
                    <TableCell className="text-center">
                      <Button type="submit">Submit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Link href="/admin">
                <Button>Back</Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
