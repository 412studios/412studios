import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

/**
 * Payment success screen.
 *
 * This page is purely informational. Bookings and memberships are activated
 * ONLY by the verified Stripe webhook (app/api/webhook/stripe/route.ts) — never
 * here. Previously this page marked the booking in the URL as "success" on
 * every visit, which let anyone confirm a booking (or re-decrement membership
 * hours) without paying simply by navigating to /user/success/<id>.
 */
export default function PageSuccess() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="flex w-full justify-center">
            <Check className="h-12 w-12 rounded-full bg-green-500/30 p-2 text-green-500" />
          </div>
          <div className="mt-3 w-full text-center sm:mt-5">
            <h3 className="text-lg font-medium leading-6">Payment Successful</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you! Your payment was received. A confirmation email will
              arrive shortly once your booking is finalized.
            </p>
            <div className="mt-5 w-full sm:mt-6">
              <Button className="w-full" asChild>
                <Link href="/user/profile">Go to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
