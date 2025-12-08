import { Resend } from "resend";
import {
  generateEmail,
  generateBookingConfirmationEmail,
  generateBookingConfirmationText,
  generateMembershipConfirmationEmail,
  generateMembershipConfirmationText,
  generateMembershipUsageEmail,
  generateMembershipUsageText,
  generateBookingReminderEmail,
  generateBookingReminderText,
  EMAIL_CONSTANTS,
  type BookingDetails,
  type MembershipDetails,
  type UsageDetails,
} from "./emailTemplates";

// Email service configuration
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "booking@412studios.com";

// Re-export constants for backwards compatibility
export const STUDIO_ADDRESS = EMAIL_CONSTANTS.STUDIO_ADDRESS;
export const GOOGLE_MAPS_URL = EMAIL_CONSTANTS.GOOGLE_MAPS_URL;
export const SUPPORT_EMAIL = EMAIL_CONSTANTS.SUPPORT_EMAIL;

// Initialize Resend with API key
console.log(
  "Initializing Resend client with API key:",
  RESEND_API_KEY ? "Present" : "Missing"
);
let resendClient: Resend;

try {
  resendClient = new Resend(RESEND_API_KEY);
  console.log("Resend client initialized successfully");
} catch (err) {
  console.error("Failed to initialize Resend client:", err);
  resendClient = null as any;
}

/**
 * Base function to send emails with Resend
 * @param to Recipient email address
 * @param subject Email subject line
 * @param text Plain text email content
 * @param html Optional HTML email content
 * @returns Promise with the send result
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  console.log(`=== EMAIL SENDING DEBUG ===`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`From: 412 Studios <${RESEND_FROM_EMAIL}>`);
  console.log(`API Key present: ${RESEND_API_KEY ? "Yes" : "No"}`);
  console.log(`API Key length: ${RESEND_API_KEY?.length || 0}`);

  try {
    // If Resend client isn't available, create a new instance just for this request
    const emailClient = resendClient || new Resend(RESEND_API_KEY);
    console.log(`Using email client:`, typeof emailClient);

    // Verify resend instance
    if (!emailClient || typeof emailClient.emails?.send !== "function") {
      console.error("Resend client not properly initialized:", emailClient);
      return {
        success: false,
        error: "Resend client not properly initialized",
      };
    }

    console.log("Attempting to send email via Resend...");
    const { data, error } = await emailClient.emails.send({
      from: `412 Studios <${RESEND_FROM_EMAIL}>`,
      to: [to],
      subject,
      text,
      html: html || undefined,
    });

    if (error) {
      console.error("Error sending email with Resend:", error);
      console.error("Error type:", typeof error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return { success: false, error };
    }

    console.log("Email sent successfully!");
    console.log("Response data:", JSON.stringify(data, null, 2));
    console.log("=== EMAIL SENDING COMPLETE ===");
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending email with Resend:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    console.log("=== EMAIL SENDING FAILED ===");
    return { success: false, error };
  }
};

/**
 * Send a booking confirmation email
 * @param to Recipient email address
 * @param bookingDetails Booking information
 */
export const sendBookingConfirmationEmail = async (
  to: string,
  bookingDetails: BookingDetails
) => {
  const subject = `Your Studio Booking Confirmation - ${bookingDetails.studioName}`;
  const emailContent = generateEmail("booking-confirmation", bookingDetails);

  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Send a membership confirmation email
 * @param to Recipient email address
 * @param membershipDetails Membership information
 */
export const sendMembershipConfirmationEmail = async (
  to: string,
  membershipDetails: MembershipDetails
) => {
  const subject = `Your 412 Studios Membership Confirmation`;
  const emailContent = generateEmail(
    "membership-confirmation",
    membershipDetails
  );

  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Send a membership hours usage notification email
 * @param to Recipient email address
 * @param usageDetails Usage information
 */
export const sendMembershipUsageEmail = async (
  to: string,
  usageDetails: UsageDetails
) => {
  const subject = `Membership Hours Used - 412 Studios`;
  const emailContent = generateEmail("membership-usage", usageDetails);

  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Send a booking reminder email
 * @param to Recipient email address
 * @param bookingDetails Booking information
 */
export const sendBookingReminderEmail = async (
  to: string,
  bookingDetails: BookingDetails
) => {
  const subject = `Reminder: Your studio session is tomorrow at ${bookingDetails.studioName}`;
  const emailContent = generateEmail("booking-reminder", bookingDetails);

  return sendEmail(to, subject, emailContent.text, emailContent.html);
};

/**
 * Generate booking confirmation email HTML for display purposes
 * @param bookingDetails Booking information
 */
export const generateBookingConfirmationHTML = (
  bookingDetails: BookingDetails
) => {
  return generateBookingConfirmationEmail(bookingDetails);
};

/**
 * Send a test email to verify Resend configuration
 */
export const sendTestEmail = async () => {
  try {
    console.log("Testing email integration...");
    console.log("API Key:", RESEND_API_KEY ? "Present" : "Missing");
    console.log("From Email:", RESEND_FROM_EMAIL);

    if (!RESEND_API_KEY) {
      console.error("Skipping email test - RESEND_API_KEY is missing");
      return { success: false, error: "RESEND_API_KEY is missing" };
    }

    const testEmail = "delivered@resend.dev";

    const testResult = await sendBookingConfirmationEmail(testEmail, {
      studioName: "Test Studio",
      date: new Date().toDateString(),
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      duration: 2,
      price: 0,
      engineeringIncluded: false,
    });

    console.log("Test email result:", testResult);
    return testResult;
  } catch (emailTestError) {
    console.error("Error testing email integration:", emailTestError);
    if (emailTestError instanceof Error) {
      console.error("Error details:", emailTestError.message);
    }
    return { success: false, error: emailTestError };
  }
};

/**
 * Handle booking confirmation email with all necessary data fetching
 */
export const handleBookingConfirmationEmail = async (
  booking: any,
  prisma: any
) => {
  try {
    console.log("Starting booking email process...");

    const studioInfo = await prisma.pricing.findFirst({
      where: {
        id: booking.roomId.toString(),
      },
      select: {
        room: true,
      },
    });
    console.log("Studio info fetched:", studioInfo);

    const bookingDate = new Date(
      Math.floor(booking.date / 10000),
      Math.floor(booking.date % 10000) / 100 - 1,
      booking.date % 100
    ).toDateString();
    console.log("Formatted date:", bookingDate);

    let startTimeStr = `${booking.startTime}:00`;
    let endTimeStr = `${booking.endTime + 1}:00`;
    console.log("Initial time strings:", { startTimeStr, endTimeStr });

    try {
      const { timeSlots } = await import(
        "@/app/(public)/booking/components/timeSlots"
      );
      console.log("TimeSlots imported successfully");
      startTimeStr = timeSlots[booking.startTime]?.displayStart || startTimeStr;
      endTimeStr = timeSlots[booking.endTime]?.displayEnd || endTimeStr;
      console.log("Formatted time strings:", { startTimeStr, endTimeStr });
    } catch (timeSlotError) {
      console.error(
        "Failed to import timeSlots, using default time format:",
        timeSlotError
      );
    }

    const duration = booking.endTime + 1 - booking.startTime;

    if (booking.user?.email) {
      console.log(
        "Starting to send booking confirmation email to:",
        booking.user.email
      );
      console.log("Email data:", {
        studioName: `Studio ${studioInfo?.room || booking.roomId}`,
        date: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        duration: duration,
        price: booking.totalPrice,
        engineeringIncluded: booking.engineerTotal > 0,
      });

      const result = await sendBookingConfirmationEmail(booking.user.email, {
        studioName: `Studio ${studioInfo?.room || booking.roomId}`,
        date: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        duration: duration,
        price: booking.totalPrice,
        engineeringIncluded: booking.engineerTotal > 0,
      });
      console.log("Email send result:", result);
      console.log(`Booking confirmation email sent to ${booking.user.email}`);
      return result;
    } else {
      console.warn("No user email found for booking confirmation");
      return { success: false, error: "No user email found" };
    }
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return { success: false, error };
  }
};

/**
 * Handle membership usage email notification with all necessary data fetching
 */
export const handleMembershipUsageEmail = async (booking: any, prisma: any) => {
  try {
    console.log(
      "Membership hours were decremented, fetching details for email notification"
    );

    const updatedMembership = await prisma.memberships.findFirst({
      where: {
        userId: booking.userId,
        roomId: booking.roomId,
      },
      select: {
        availableHours: true,
        roomId: true,
      },
    });

    if (updatedMembership && booking.user?.email) {
      const studioInfo = await prisma.pricing.findFirst({
        where: {
          id: booking.roomId.toString(),
        },
        select: {
          room: true,
        },
      });

      const bookingDate = new Date(
        Math.floor(booking.date / 10000),
        Math.floor(booking.date % 10000) / 100 - 1,
        booking.date % 100
      ).toDateString();

      let startTimeStr = `${booking.startTime}:00`;
      let endTimeStr = `${booking.endTime + 1}:00`;

      try {
        const { timeSlots } = await import(
          "@/app/(public)/booking/components/timeSlots"
        );
        startTimeStr =
          timeSlots[booking.startTime]?.displayStart || startTimeStr;
        endTimeStr = timeSlots[booking.endTime]?.displayEnd || endTimeStr;
      } catch (timeSlotError) {
        console.error(
          "Failed to import timeSlots for usage email, using default format:",
          timeSlotError
        );
      }

      const duration = booking.endTime + 1 - booking.startTime;

      console.log(
        "Sending membership hours usage email to:",
        booking.user.email
      );

      const result = await sendMembershipUsageEmail(booking.user.email, {
        studioName: `Studio ${studioInfo?.room || booking.roomId}`,
        date: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        hoursUsed: duration,
        remainingHours: updatedMembership.availableHours,
        bookingId: booking.bookingId,
      });

      console.log("Membership hours usage email sent successfully");
      return result;
    } else {
      console.warn("No updated membership or user email found");
      return {
        success: false,
        error: "No updated membership or user email found",
      };
    }
  } catch (usageEmailError) {
    console.error(
      "Failed to send membership hours usage email:",
      usageEmailError
    );
    return { success: false, error: usageEmailError };
  }
};

/**
 * Handle membership confirmation email with all necessary data fetching
 */
export const handleMembershipConfirmationEmail = async (
  membership: any,
  prisma: any
) => {
  try {
    console.log("Starting membership email process...");

    const studioInfo = await prisma.pricing.findFirst({
      where: {
        id: membership.roomId.toString(),
      },
      select: {
        room: true,
        membershipPrice: true,
      },
    });
    console.log("Membership studio info fetched:", studioInfo);

    const now = new Date();
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    if (membership.user?.email) {
      console.log(
        "Starting to send membership confirmation email to:",
        membership.user.email
      );
      console.log("Membership email data:", {
        studioName: `Studio ${studioInfo?.room || membership.roomId}`,
        availableHours: membership.availableHours,
        membershipPrice: studioInfo?.membershipPrice || 0,
        billingCycle: membership.interval,
        status: membership.status,
        validThrough: firstDayOfNextMonth.toLocaleDateString(),
      });

      const result = await sendMembershipConfirmationEmail(
        membership.user.email,
        {
          studioName: `Studio ${studioInfo?.room || membership.roomId}`,
          availableHours: membership.availableHours,
          membershipPrice: studioInfo?.membershipPrice || 0,
          billingCycle: membership.interval,
          status: membership.status,
          validThrough: firstDayOfNextMonth.toLocaleDateString(),
        }
      );
      console.log("Membership email send result:", result);
      console.log(
        `Membership confirmation email sent to ${membership.user.email}`
      );
      return result;
    } else {
      console.warn("No user email found for membership confirmation");
      return { success: false, error: "No user email found" };
    }
  } catch (error) {
    console.error("Failed to send membership confirmation email:", error);
    return { success: false, error };
  }
};
