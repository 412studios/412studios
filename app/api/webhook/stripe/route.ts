import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { fulfillBookingPayment, activateMembershipPayment } from "@/lib/fulfillment";

// Initialize Stripe with the secret key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/**
 * Resolves a completed Checkout Session to the booking or membership it paid
 * for, and fulfils it. The same `bookingId` metadata key carries both booking
 * IDs and membership IDs (see getStripeSession in lib/stripe.ts).
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const id = session.metadata?.bookingId;
  if (!id) {
    console.error("Stripe webhook: checkout.session.completed has no id in metadata");
    return;
  }

  const booking = await prisma.bookings.findUnique({
    where: { bookingId: id },
    select: { bookingId: true },
  });
  if (booking) {
    await fulfillBookingPayment(id);
    return;
  }

  const membership = await prisma.memberships.findUnique({
    where: { membershipId: id },
    select: { membershipId: true },
  });
  if (membership) {
    await activateMembershipPayment(id);
    return;
  }

  console.error(`Stripe webhook: no booking or membership found for id ${id}`);
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  // Verify the event really came from Stripe before trusting any of it.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        // No action needed — fulfilment happens on checkout.session.completed.
        break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling Stripe event ${event.type}:`, error);
    // Return 500 so Stripe retries delivery. Fulfilment is idempotent, so a
    // retry cannot double-charge hours or send duplicate emails.
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
