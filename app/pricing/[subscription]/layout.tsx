import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getPricing } from "@/app/lib/booking";
import Page from "./page";

export default async function PricingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { subscription: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const prices = await getPricing();
  if (!user) {
    return redirect("/");
  }
  return (
    <Page
      prices={prices}
      params={params}
      className="mx-auto max-w-screen-xl p-2 md:p-8"
    >
      {children}
    </Page>
  );
}
