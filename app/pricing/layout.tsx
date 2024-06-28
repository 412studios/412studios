import { ReactNode } from "react";

export default async function PricingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <main className="mx-auto max-w-screen-xl">{children}</main>;
}
