import Stripe from "stripe";
type StripeMode = "payment" | "setup" | "subscription";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerId,
  quantity,
  mode,
  bookingId,
}: {
  priceId: string;
  domainUrl: string;
  customerId: string;
  quantity: number;
  mode: StripeMode;
  bookingId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    // mode: "subscription",
    mode: mode,
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: quantity }],
    payment_method_types: ["card"],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: `${domainUrl}/booking/success/${bookingId}`,
    cancel_url: `${domainUrl}/booking/cancel/${bookingId}`,
    automatic_tax: { enabled: true },
  });

  return session.url as string;
};

export const getStripeDonation = async ({
  priceId,
  domainUrl,
  customerId,
  quantity,
  mode,
  bookingId,
}: {
  priceId: string;
  domainUrl: string;
  customerId: string;
  quantity: number;
  mode: StripeMode;
  bookingId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    // mode: "subscription",
    mode: mode,
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: quantity }],
    payment_method_types: ["card"],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: `${domainUrl}/admin/`,
    cancel_url: `${domainUrl}/admin/`,
    automatic_tax: { enabled: true },
  });

  return session.url as string;
};
