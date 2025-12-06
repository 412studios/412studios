import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserTable from "./usertable";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

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
    <Section>
      <div className="flex w-full justify-between px-4 pb-0">
        <H4>Users</H4>
        <span className="flex-end">
          <Link href="/user/admin/">
            <Button>Back</Button>
          </Link>
        </span>
      </div>
      <CardContent>
        <UserTable users={userData} />
      </CardContent>
    </Section>
  );
}
