import { ReactNode } from "react";

export default async function PricingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-[100vh] max-w-screen-xl p-2 md:p-8">
      {children}
    </main>
  );
}
