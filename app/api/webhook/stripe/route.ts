import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use the latest API version available
});

// Handle booking payment success and create calendar event
async function handleBookingPaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    // Get booking ID from session metadata
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.log("No booking ID found in session metadata");
      return;
    }

    // Update booking status to success
    const booking = await prisma.bookings.update({
      where: { bookingId },
      data: { status: "success" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        offerCode: {
          select: {
            code: true,
          },
        },
      },
    });

    if (!booking) {
      console.error(`Booking ${bookingId} not found`);
      return;
    }

    // Create calendar event for the successful booking
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

      // Update booking with calendar event ID
      if (calendarEventId) {
        await prisma.bookings.update({
          where: { bookingId: booking.bookingId },
          data: { addDetails: calendarEventId },
        });

        console.log(`Calendar event ${calendarEventId} created for booking ${bookingId}`);
      }
    } catch (calendarError) {
      console.error("Failed to create calendar event:", calendarError);
    }

    // Send booking confirmation email
    try {
      const { sendBookingConfirmationEmail } = await import("@/lib/email");

      // Get studio name
      const pricing = await prisma.pricing.findFirst({
        where: { id: booking.roomId.toString() },
        select: { room: true },
      });

      // Format date
      const dateStr = booking.date.toString();
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      const bookingDate = new Date(year, month, day).toDateString();

      // Get time slot display strings
      const { timeSlots } = await import("@/app/(public)/booking/components/timeSlots");
      const startTimeStr = timeSlots[booking.startTime]?.displayStart || `${booking.startTime}:00`;
      const endTimeStr = timeSlots[booking.endTime]?.displayEnd || `${booking.endTime + 1}:00`;

      // Calculate original price if discount was applied
      const originalPrice =
        booking.discountAmount && booking.discountAmount > 0
          ? booking.totalPrice + booking.discountAmount
          : undefined;

      if (booking.user?.email) {
        await sendBookingConfirmationEmail(booking.user.email, {
          studioName: `Studio ${pricing?.room || booking.roomId}`,
          date: bookingDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: booking.totalHours,
          price: booking.totalPrice,
          engineeringIncluded: booking.engineerTotal > 0,
          offerCode: booking.offerCode?.code,
          discountAmount: booking.discountAmount || undefined,
          originalPrice: originalPrice,
        });
      }
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
    }

    console.log(`Booking ${bookingId} marked as successful and synced to calendar`);
  } catch (error) {
    console.error("Error handling booking payment success:", error);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout completed:", session.id);

      // Handle booking payment completion
      await handleBookingPaymentSuccess(session);
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);
      // Process successful payment
      break;

    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
