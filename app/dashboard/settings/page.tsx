import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/app/components/Themetoggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/app/components/SubmitButtons";
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
    <main className="p-8">
      <Card className="mx-auto mt-4 max-w-screen-lg">
        <form action={postData}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Details</CardTitle>
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent>
            <div className="spac-y-2">
              <div className="spac-y-1">
                <Label className="px-3">Name</Label>
                <Input
                  name="name"
                  type="text"
                  id="name"
                  className="mt-2"
                  placeholder="Your Name"
                  defaultValue={data?.name ?? undefined}
                  disabled
                />
              </div>

              <div className="spac-y-1 mt-2">
                <Label className="px-3">Email</Label>
                <Input
                  name="email"
                  type="text"
                  id="email"
                  className="mt-2"
                  placeholder="Your Email"
                  defaultValue={data?.email ?? undefined}
                  disabled
                />
              </div>

              {/* <div className="spac-y-1 mt-2">
                    <Label className="px-3">Color Scheme</Label>
                    <Select name="color" defaultValue={data?.colorScheme}>
                      <SelectTrigger className="mt-2 w-full">
                        <SelectValue placeholder="select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Color</SelectLabel>
                          <SelectItem value="theme-green">Green</SelectItem>
                          <SelectItem value="theme-blue">Blue</SelectItem>
                          <SelectItem value="theme-orange">Orange</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div> */}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <SubmitButton />
              <Link href="/dashboard">
                <Button>Back</Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
