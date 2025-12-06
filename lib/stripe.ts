import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerId,
  bookingId,
  unit_amount,
}: {
  priceId: string;
  domainUrl: string;
  customerId: string;
  bookingId: string;
  unit_amount: number;
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    billing_address_collection: "auto",
    metadata: {
      bookingId: bookingId,
    },
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: "412 Studios Booking",
            metadata: { bookingId },
          },
          unit_amount: unit_amount,
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: `${domainUrl}/user/success/${bookingId}`,
    cancel_url: `${domainUrl}/user/cancel/${bookingId}`,
    automatic_tax: { enabled: false },
  });
  return session.url as string;
};
