import prisma from "@/lib/db";

/**
 * Payment fulfilment — the single source of truth for activating a booking or
 * membership after money has actually changed hands.
 *
 * SECURITY: these functions must only ever be called from the Stripe webhook
 * (app/api/webhook/stripe/route.ts), which verifies the event signature with
 * STRIPE_WEBHOOK_SECRET. They must never be called from a page or route the
 * user can reach directly — that was the original payment-bypass bug, where
 * visiting /user/success/<id> marked a booking paid for free.
 *
 * Both functions are idempotent: the state change is performed with a
 * conditional updateMany, so the side effects (calendar event, membership-hour
 * decrement, emails) run exactly once even if Stripe delivers the same event
 * multiple times.
 */

/**
 * Marks a booking as paid and runs all post-payment side effects.
 */
export async function fulfillBookingPayment(bookingId: string): Promise<void> {
  // Atomically claim the booking. Only the first call flips it to "success",
  // so everything below runs exactly once.
  const claim = await prisma.bookings.updateMany({
    where: { bookingId, status: { not: "success" } },
    data: { status: "success", engineerStatus: "success" },
  });

  if (claim.count === 0) {
    // Already fulfilled, or no such booking — nothing more to do.
    return;
  }

  const booking = await prisma.bookings.findUnique({
    where: { bookingId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!booking) return;

  // Create the Google Calendar event (skip if one is already attached).
  if (!booking.addDetails) {
    try {
      const { createCalendarEvent } = await import("@/lib/calendar");
      const calendarEventId = await createCalendarEvent({
        bookingId: booking.bookingId,
        roomId: booking.roomId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        userId: booking.userId,
        engineerTotal: booking.engineerTotal,
        engineerStart: booking.engineerStart,
        totalPrice: booking.totalPrice,
        status: "success",
      });

      if (calendarEventId) {
        await prisma.bookings.update({
          where: { bookingId: booking.bookingId },
          data: { addDetails: calendarEventId },
        });
      }
    } catch (error) {
      console.error(`fulfillBookingPayment: calendar event failed for ${bookingId}`, error);
    }
  }

  // If the user holds a membership for this room, draw the hours down.
  const duration = booking.endTime + 1 - booking.startTime;
  const membershipUpdate = await prisma.memberships.updateMany({
    where: { userId: booking.userId, roomId: booking.roomId },
    data: { availableHours: { decrement: duration } },
  });

  // Confirmation emails.
  try {
    const { handleBookingConfirmationEmail, handleMembershipUsageEmail } = await import(
      "@/lib/email"
    );
    if (membershipUpdate.count > 0) {
      await handleMembershipUsageEmail(booking, prisma);
    }
    await handleBookingConfirmationEmail(booking, prisma);
  } catch (error) {
    console.error(`fulfillBookingPayment: email failed for ${bookingId}`, error);
  }
}

/**
 * Activates a membership after a verified Stripe payment.
 */
export async function activateMembershipPayment(membershipId: string): Promise<void> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const toNumericDate = (d: Date): number =>
    d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

  // Atomically claim the membership. Only the first call flips it to "active".
  const claim = await prisma.memberships.updateMany({
    where: { membershipId, status: { not: "active" } },
    data: {
      status: "active",
      currentPeriodStart: toNumericDate(firstDayOfMonth),
      currentPeriodEnd: toNumericDate(firstDayOfNextMonth),
    },
  });

  if (claim.count === 0) {
    // Already active, or no such membership — nothing more to do.
    return;
  }

  // Confirmation email.
  try {
    const membership = await prisma.memberships.findUnique({
      where: { membershipId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (membership) {
      const { handleMembershipConfirmationEmail } = await import("@/lib/email");
      await handleMembershipConfirmationEmail(membership, prisma);
    }
  } catch (error) {
    console.error(`activateMembershipPayment: email failed for ${membershipId}`, error);
  }
}
