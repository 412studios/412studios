import Link from "next/link";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return data;
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function postData(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? undefined,
      },
    });
  }

  return (
    <section className="block mt-[34px] h-[calc(100vh-34px)] p-8">
      <form action={postData} className="p-2 rounded-lg font-medium">
        <Link href="/user/profile">
          <Button>Back</Button>
        </Link>
        <H4 className="mt-4 mb-2">Profile Details</H4>
        <div className="flex flex-col gap-2">
          <Label className="px-3">Name</Label>
          <Input
            name="name"
            type="text"
            id="name"
            placeholder="Your Name"
            defaultValue={data?.name ?? undefined}
            disabled
            className="border-none"
          />
          <Label className="px-3">Email</Label>
          <Input
            name="email"
            type="text"
            id="email"
            placeholder="Your Email"
            defaultValue={data?.email ?? undefined}
            disabled
            className="border-none"
          />
          <Button>Submit</Button>
        </div>
      </form>
    </section>
  );
}
