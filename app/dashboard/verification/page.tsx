import { Card } from "@/components/ui/card";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import VerificationForm from "./verificationForm";
import { redirect } from "next/navigation";

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
  const userData = await getData(user?.id as string);

  async function handleSubmit(formData: FormData) {
    "use server";
    const name = userData?.name;
    const email = userData?.email;
    const bio = formData.get("bio") as string;
    const sanitizedBio = bio.replace(/[^a-zA-Z0-9 ., _-]/g, "");
    const phone = formData.get("phone") || "";
    const tnc = formData.get("tnc");
    const category = formData.get("categorySelect") || "";

    if (tnc === "off" && sanitizedBio.length >= 1) {
      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name: name ?? undefined,
          email: email ?? undefined,
          userBio: sanitizedBio ?? undefined,
          acceptedTerms: true,
          verifyFormSubmitted: true,
          phone: phone.toString(),
          categories: category.toString(),
        },
      });
      redirect("/dashboard");
    }
  }

  return (
    <main className="m-4">
      <div className="mx-auto grid max-w-4xl items-start gap-2 p-4">
        <Card className="mt-4">
          <form action={handleSubmit}>
            <VerificationForm data={userData} />
          </form>
        </Card>
      </div>
    </main>
  );
}
