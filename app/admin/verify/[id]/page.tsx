import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

async function getData(id: string) {
  noStore();

  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      isUserVerified: true,
      verifyFormSubmitted: true,
      userBio: true,
    },
  });
  return data;
}

export default async function Main(context: any) {
  noStore();
  const data = await getData(context.params.id);

  async function postData(formData: FormData) {
    "use server";
    const id = context.params.id;
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
    redirect("/admin");
  }

  return (
    <main className="m-4">
      <form action={postData} className="mx-auto max-w-screen-md">
        <Link href="/admin/verify">
          <Button>Back</Button>
        </Link>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>412 Applicants Profile</CardTitle>
            <CardDescription>
              {data?.name}
              <br />
              {data?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <h3 className="text-2xl font-bold dark:text-white">
              Studio {prices[context.params.room - 1].room}
            </h3> */}
            <ul className="mt-4 list-inside list-none space-y-1 text-gray-500 dark:text-gray-400">
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Name:
                </span>
                {data?.name}
              </li>
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Email:
                </span>
                {data?.email}
              </li>
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Bio
                </span>
              </li>
              <li className="rounded-md border p-4">{data?.userBio}</li>
            </ul>
          </CardContent>
          {!data?.isUserVerified && (
            <CardFooter>
              <Button type="submit" className="w-fit">
                Verify User
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </main>
  );
}
