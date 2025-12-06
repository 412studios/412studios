import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/copy";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Section } from "@/components/ui/copy";
import Dashboard from "@/app/user/admin/components/dashboard";

async function getUserDetails(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
  return data;
}

export default async function Main() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // deletePendingmembership();
  return (
    <Section>
      <div className="h-[80vh] flex flex-col gap-4 shadow-xl rounded-xl p-4">
        <H2>Admin Dashboard</H2>
        {/* <div className="px-4 flex gap-4">
          <Link href="/user/admin/pricing">
            <Button>
              <span>Update Pricing</span>
            </Button>
          </Link>
        </div> */}
        <Dashboard />
      </div>
    </Section>
  );
}
