import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const data = await prisma.user.findMany({
    where: {
      verifyFormSubmitted: true,
      isUserVerified: false,
    },
  });

  return data;
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
    <main className="p-8">
      <div className="mx-auto max-w-screen-lg">
        <div className="pb-8">
          <Link href="/admin/">
            <Button>Back</Button>
          </Link>
        </div>
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Users pending verification</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Verify</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <form action={verifyUser}>
                        <Button type="submit">Verify</Button>
                        <Input
                          name="userId"
                          id="userId"
                          value={user.id}
                          type="hidden"
                        />
                      </form>
                    </TableCell>
                    <TableCell>
                      <Link
                        key={user.id}
                        href={`/admin/verify/${user.id}`}
                        passHref
                      >
                        <Button>Details</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
