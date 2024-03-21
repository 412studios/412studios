import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "../../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe, getStripeSession } from "@/app/lib/stripe";
import { redirect } from "next/navigation";
import {
  StripePortal,
  StripeSubscriptionCreationButton,
} from "@/app/components/SubmitButtons";
import { unstable_noStore as noStore } from "next/cache";

const featureItems = [{ name: "test 1" }];

async function getData(userId: string) {
  noStore();
  const data = await prisma.subscription.findUnique({
    where: { userId: userId },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  return data;
}

export default async function BillingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function createSubscription() {
    "use server";

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
    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000",
      priceId: process.env.STRIPE_PRICE_ID as string,
      quantity: 1,
      mode: "subscription",
    });
    return redirect(subscriptionUrl);
  }
  async function createCustomerPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      // return_url: "http://localhost:3000/dashboard",
      return_url:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000/dashboard",
    });
    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="felx justify-betwen items-center px-2">
          <div className="grid gap-1">
            <h1 className="text-xl md:text-4xl">Subscription</h1>
            <p className="text-muted-foreground text-lg">
              Subscription settings
            </p>
          </div>
        </div>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Edit Subscription</CardTitle>
            <CardDescription>
              Change payment details and view statement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <StripePortal />
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="font-semiboild bg-primary/10 text-primary inline-flex rounded-full px-4 py-1 text-sm uppercase tracking-wide">
              Monthly
            </h3>
          </div>

          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            $30 <span className="text-muted-forground ml-1 text-2xl">mo</span>
          </div>
          <p className="text-muted-foreground mt-5 text-lg">sub title</p>
        </CardContent>
        <div className="bg-secondary m1 sp:pt-6 flex flex-1 flex-col justify-between space-y-6 rounded-lg px-6 pb-8 pt-6 sm:p-10">
          <ul className="space-y-4">
            {featureItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base">{item.name}</p>
              </li>
            ))}
          </ul>
          <form action={createSubscription}>
            <StripeSubscriptionCreationButton />
          </form>
        </div>
      </Card>
    </div>
  );
}
