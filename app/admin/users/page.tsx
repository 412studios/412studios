import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserTable from "./usertable";

export default async function Page() {
  noStore();

  const users = await prisma.user.findMany();

  // Map the user data to include id, name, and email
  const userData = users.map((user) => ({
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
  }));

  return (
    <Card className="">
      <CardHeader className="flex w-full justify-between">
        <CardTitle>Users</CardTitle>
        <span className="flex-end">
          <Link href="/admin/">
            <Button>Back</Button>
          </Link>
        </span>
      </CardHeader>
      <CardContent>
        <UserTable users={userData} />
      </CardContent>
    </Card>
  );
}
