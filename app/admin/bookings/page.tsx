import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";

async function getData() {
  noStore();

  const users = await prisma.user.findMany();

  return users;
}

async function verifyUser(formData: FormData) {
  "use server";
  const id = formData.get("userId") as string;
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      acceptedTerms: true,
      verifyFormSubmitted: true,
      isUserVerified: true,
    },
  });
  redirect("/admin/verify");
}

export default async function Main() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData();

  return (
    <>
      <Card className="p-4">
        <CardHeader></CardHeader>
        <CardContent>Select a room</CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
