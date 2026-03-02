"use server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";

/**
 * Ensures a user exists in the database with a Stripe customer ID.
 * Creates the user and/or Stripe customer if they don't exist.
 */
export async function ensureUser({
  email,
  id,
  firstName,
  lastName,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
}) {
  noStore();
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, stripeCustomerId: true },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: { id, email, name },
    });
  }

  if (!user?.stripeCustomerId) {
    const customer = await stripe.customers.create({ email });
    await prisma.user.update({
      where: { id },
      data: { stripeCustomerId: customer.id },
    });
  }
}

/**
 * Gets active memberships for a user (active or cancelled-with-hours).
 */
export async function getActiveMemberships(userId: string) {
  noStore();
  return prisma.memberships.findMany({
    where: {
      userId,
      OR: [
        { AND: [{ availableHours: { gt: 0 } }, { status: "cancelled" }] },
        { status: "active" },
      ],
    },
    orderBy: { roomId: "asc" },
  });
}
