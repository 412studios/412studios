import { Resend } from "resend";
import {
  generateEmail,
  EMAIL_CONSTANTS,
  type BookingDetails,
  type MembershipDetails,
  type UsageDetails,
} from "./emailTemplates";

// Email service configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "booking@412studios.com";

// Re-export for consumers
export { EMAIL_CONSTANTS };
export type { BookingDetails, MembershipDetails, UsageDetails };

// Initialize Resend client
const resendClient = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/**
 * Base function to send emails via Resend.
 */
const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const emailClient = resendClient || new Resend(RESEND_API_KEY);

    if (!emailClient || typeof emailClient.emails?.send !== "function") {
      return { success: false, error: "Resend client not properly initialized" };
    }

    const { data, error } = await emailClient.emails.send({
      from: `412 Studios <${RESEND_FROM_EMAIL}>`,
      to: [to],
      subject,
      text,
      html: html || undefined,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending email:", error);
    return { success: false, error };
  }
};

/**
 * Send a booking confirmation email.
 */
export const sendBookingConfirmationEmail = async (to: string, bookingDetails: BookingDetails) => {
  const subject = `Your Studio Booking Confirmation - ${bookingDetails.studioName}`;
  const emailContent = generateEmail("booking-confirmation", bookingDetails);
  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Send a membership confirmation email.
 */
export const sendMembershipConfirmationEmail = async (
  to: string,
  membershipDetails: MembershipDetails
) => {
  const subject = `Your 412 Studios Membership Confirmation`;
  const emailContent = generateEmail("membership-confirmation", membershipDetails);
  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Send a membership hours usage notification email.
 */
export const sendMembershipUsageEmail = async (to: string, usageDetails: UsageDetails) => {
  const subject = `Membership Hours Used - 412 Studios`;
  const emailContent = generateEmail("membership-usage", usageDetails);
  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Send a booking reminder email.
 */
export const sendBookingReminderEmail = async (to: string, bookingDetails: BookingDetails) => {
  const subject = `Reminder: Your studio session is tomorrow at ${bookingDetails.studioName}`;
  const emailContent = generateEmail("booking-reminder", bookingDetails);
  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Handle booking confirmation email with all necessary data fetching.
 */
export const handleBookingConfirmationEmail = async (booking: any, prisma: any) => {
  try {
    const studioInfo = await prisma.pricing.findFirst({
      where: { id: booking.roomId.toString() },
      select: { room: true },
    });

    const bookingDate = new Date(
      Math.floor(booking.date / 10000),
      Math.floor(booking.date % 10000) / 100 - 1,
      booking.date % 100
    ).toDateString();

    let startTimeStr = `${booking.startTime}:00`;
    let endTimeStr = `${booking.endTime + 1}:00`;

    try {
      const { timeSlots } = await import("@/app/(public)/booking/components/timeSlots");
      startTimeStr = timeSlots[booking.startTime]?.displayStart || startTimeStr;
      endTimeStr = timeSlots[booking.endTime]?.displayEnd || endTimeStr;
    } catch {
      // Fall back to default time format
    }

    const duration = booking.endTime + 1 - booking.startTime;

    if (booking.user?.email) {
      return await sendBookingConfirmationEmail(booking.user.email, {
        studioName: `Studio ${studioInfo?.room || booking.roomId}`,
        date: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        duration,
        price: booking.totalPrice,
        engineeringIncluded: booking.engineerTotal > 0,
      });
    }

    return { success: false, error: "No user email found" };
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return { success: false, error };
  }
};

/**
 * Handle membership usage email notification with all necessary data fetching.
 */
export const handleMembershipUsageEmail = async (booking: any, prisma: any) => {
  try {
    const updatedMembership = await prisma.memberships.findFirst({
      where: { userId: booking.userId, roomId: booking.roomId },
      select: { availableHours: true, roomId: true },
    });

    if (!updatedMembership || !booking.user?.email) {
      return { success: false, error: "No updated membership or user email found" };
    }

    const studioInfo = await prisma.pricing.findFirst({
      where: { id: booking.roomId.toString() },
      select: { room: true },
    });

    const bookingDate = new Date(
      Math.floor(booking.date / 10000),
      Math.floor(booking.date % 10000) / 100 - 1,
      booking.date % 100
    ).toDateString();

    let startTimeStr = `${booking.startTime}:00`;
    let endTimeStr = `${booking.endTime + 1}:00`;

    try {
      const { timeSlots } = await import("@/app/(public)/booking/components/timeSlots");
      startTimeStr = timeSlots[booking.startTime]?.displayStart || startTimeStr;
      endTimeStr = timeSlots[booking.endTime]?.displayEnd || endTimeStr;
    } catch {
      // Fall back to default time format
    }

    const duration = booking.endTime + 1 - booking.startTime;

    return await sendMembershipUsageEmail(booking.user.email, {
      studioName: `Studio ${studioInfo?.room || booking.roomId}`,
      date: bookingDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      hoursUsed: duration,
      remainingHours: updatedMembership.availableHours,
      bookingId: booking.bookingId,
    });
  } catch (error) {
    console.error("Failed to send membership usage email:", error);
    return { success: false, error };
  }
};

/**
 * Handle membership confirmation email with all necessary data fetching.
 */
export const handleMembershipConfirmationEmail = async (membership: any, prisma: any) => {
  try {
    const studioInfo = await prisma.pricing.findFirst({
      where: { id: membership.roomId.toString() },
      select: { room: true, membershipPrice: true },
    });

    const now = new Date();
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    if (membership.user?.email) {
      return await sendMembershipConfirmationEmail(membership.user.email, {
        studioName: `Studio ${studioInfo?.room || membership.roomId}`,
        availableHours: membership.availableHours,
        membershipPrice: studioInfo?.membershipPrice || 0,
        billingCycle: membership.interval,
        status: membership.status,
        validThrough: firstDayOfNextMonth.toLocaleDateString(),
      });
    }

    return { success: false, error: "No user email found" };
  } catch (error) {
    console.error("Failed to send membership confirmation email:", error);
    return { success: false, error };
  }
};
