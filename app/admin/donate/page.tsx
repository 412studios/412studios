import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { getStripeDonation } from "@/app/lib/stripe";
import { unstable_noStore as noStore } from "next/cache";
import { Button } from "@/components/ui/button";

export default async function ConfirmDonation() {
  noStore();

  async function onSubmit() {
    "use server";
    noStore();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    //SEND TO STRIPE
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get customer id");
    }
    const stripeURL = await getStripeDonation({
      customerId: dbUser.stripeCustomerId,
      domainUrl:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000",
      priceId: "price_1OwRowIZy9dQPWTEV9lUCWFY",
      quantity: 1,
      mode: "payment",
      bookingId: "",
    });
    return redirect(stripeURL);
  }

  return (
    <main className="mx-auto mb-8 max-w-screen-md p-8">
      <div className="mb-4 w-full">
        <Link href="/admin/" className="w-full">
          <Button className="w-full">Back</Button>
        </Link>
      </div>
      <form action={onSubmit}>
        <Button className="w-full">Donate $1</Button>
      </form>
    </main>
  );
}
