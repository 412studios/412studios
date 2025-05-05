import { Resend } from "resend";

// Constants for 412 Studios
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "booking@412studios.com";
export const STUDIO_ADDRESS = "412 Richmond St E, Toronto, ON M5A 1P8";
export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=412+Richmond+St+E+Toronto+ON+M5A+1P8";
export const SUPPORT_EMAIL = "alec@412studios.com";

// Initialize Resend with API key
console.log(
  "Initializing Resend client with API key:",
  RESEND_API_KEY ? "Present" : "Missing",
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
  html?: string,
) => {
  console.log(`Starting to send email to ${to} with subject "${subject}"`);

  try {
    // If Resend client isn't available, create a new instance just for this request
    const emailClient = resendClient || new Resend(RESEND_API_KEY);

    // Verify resend instance
    if (!emailClient || typeof emailClient.emails?.send !== "function") {
      console.error("Resend client not properly initialized:", emailClient);
      return {
        success: false,
        error: "Resend client not properly initialized",
      };
    }

    const { data, error } = await emailClient.emails.send({
      from: `412 Studios <${RESEND_FROM_EMAIL}>`,
      to: [to],
      subject,
      text,
      html: html || undefined,
    });

    if (error) {
      console.error("Error sending email with Resend:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully to:", to);
    return { success: true, data };
  } catch (error) {
    console.error("Exception sending email with Resend:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error",
    );
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
  bookingDetails: {
    studioName: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
    engineeringIncluded?: boolean;
  },
) => {
  const {
    studioName,
    date,
    startTime,
    endTime,
    duration,
    price,
    engineeringIncluded,
  } = bookingDetails;

  const subject = `Your Studio Booking Confirmation - ${studioName}`;

  const text = `
Booking Confirmation - 412 Studios

Thank you for booking with 412 Studios!

Booking Details:
- Studio: ${studioName}
- Date: ${date}
- Time: ${startTime} - ${endTime}
- Duration: ${duration} hours
- Engineering Services: ${engineeringIncluded ? "Included" : "Not included"}
- Total Price: $${price}.00 CAD

Studio Location:
${STUDIO_ADDRESS}
Get directions: ${GOOGLE_MAPS_URL}

Your booking has been confirmed. If you need to make any changes, please contact us at ${SUPPORT_EMAIL}.

Thank you for choosing 412 Studios!
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .booking-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #ff4500; }
    .location { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4285F4; }
    .map-button { 
      display: inline-block; 
      border: 1px solid #4285F4; 
      background-color: white;
      color: white; 
      padding: 10px 15px; 
      text-decoration: none; 
      border-radius: 4px; 
      margin-top: 10px;
    }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
      <p>412 Studios</p>
    </div>
    <div class="content">
      <p>Thank you for booking with 412 Studios!</p>
      
      <div class="booking-details">
        <h3>Booking Details:</h3>
        <p><strong>Studio:</strong> ${studioName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Duration:</strong> ${duration} hours</p>
        <p><strong>Engineering Services:</strong> ${engineeringIncluded ? "Included" : "Not included"}</p>
        <p><strong>Total Price:</strong> $${price}.00 CAD</p>
      </div>
      
      <div class="location">
        <h3>Studio Location:</h3>
        <p><strong>Address:</strong> ${STUDIO_ADDRESS}</p>
        <a href="${GOOGLE_MAPS_URL}" class="map-button" target="_blank">Get Directions</a>
      </div>
      
      <p>Your booking has been confirmed. If you need to make any changes, please contact us at ${SUPPORT_EMAIL}.</p>
      
      <p>Thank you for choosing 412 Studios!</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} 412 Studios. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  return sendEmail(to, subject, text, html);
};

/**
 * Send a membership confirmation email
 * @param to Recipient email address
 * @param membershipDetails Membership information
 */
export const sendMembershipConfirmationEmail = async (
  to: string,
  membershipDetails: {
    studioName: string;
    availableHours: number;
    membershipPrice: number;
    billingCycle: string;
    status: string;
    validThrough: string;
  },
) => {
  const {
    studioName,
    availableHours,
    membershipPrice,
    billingCycle,
    status,
    validThrough,
  } = membershipDetails;

  const subject = `Your 412 Studios Membership Confirmation`;

  const text = `
Membership Confirmation - 412 Studios

Thank you for purchasing a membership with 412 Studios!

Membership Details:
- Studio: ${studioName}
- Available Hours: ${availableHours} hours
- Membership Fee: $${membershipPrice}.00 CAD
- Billing Cycle: ${billingCycle}
- Status: ${status}
- Valid Through: ${validThrough}

Studio Location:
${STUDIO_ADDRESS}
Get directions: ${GOOGLE_MAPS_URL}

Your membership is now active. You can book studio time using your membership hours through your account.

Thank you for choosing 412 Studios!
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .membership-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #ff4500; }
    .location { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4285F4; }
    .map-button { 
      display: inline-block; 
      border: 1px solid #4285F4; 
      background-color: white;
      color: white; 
      padding: 10px 15px; 
      text-decoration: none; 
      border-radius: 4px; 
      margin-top: 10px;
    }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Membership Confirmation</h1>
      <p>412 Studios</p>
    </div>
    <div class="content">
      <p>Thank you for purchasing a membership with 412 Studios!</p>
      
      <div class="membership-details">
        <h3>Membership Details:</h3>
        <p><strong>Studio:</strong> ${studioName}</p>
        <p><strong>Available Hours:</strong> ${availableHours} hours</p>
        <p><strong>Membership Fee:</strong> $${membershipPrice}.00 CAD</p>
        <p><strong>Billing Cycle:</strong> ${billingCycle}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Valid Through:</strong> ${validThrough}</p>
      </div>
      
      <div class="location">
        <h3>Studio Location:</h3>
        <p><strong>Address:</strong> ${STUDIO_ADDRESS}</p>
        <a href="${GOOGLE_MAPS_URL}" class="map-button" target="_blank">Get Directions</a>
      </div>
      
      <p>Your membership is now active. You can book studio time using your membership hours through your account.</p>
      
      <p>Thank you for choosing 412 Studios!</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} 412 Studios. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  return sendEmail(to, subject, text, html);
};

/**
 * Send a membership hours usage notification email
 * @param to Recipient email address
 * @param usageDetails Usage information
 */
export const sendMembershipUsageEmail = async (
  to: string,
  usageDetails: {
    studioName: string;
    date: string;
    startTime: string;
    endTime: string;
    hoursUsed: number;
    remainingHours: number;
    bookingId: string;
  },
) => {
  const {
    studioName,
    date,
    startTime,
    endTime,
    hoursUsed,
    remainingHours,
    bookingId,
  } = usageDetails;

  const subject = `Membership Hours Used - 412 Studios`;

  const text = `
Membership Hours Usage - 412 Studios

Thank you for using your membership hours at 412 Studios!

Booking Details:
- Studio: ${studioName}
- Date: ${date}
- Time: ${startTime} - ${endTime}
- Hours Used: ${hoursUsed} hours

Membership Status:
- Remaining Hours: ${remainingHours} hours

You can view your full booking history and membership details in your 412 Studios account.

If you have any questions about your membership or need assistance, please contact us at ${SUPPORT_EMAIL}.

Thank you for choosing 412 Studios!
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .booking-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #ff4500; }
    .membership-status { background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #4285F4; }
    .progress-container { 
      width: 100%; 
      background-color: #e0e0e0; 
      border-radius: 5px; 
      margin: 10px 0; 
    }
    .warning { color: ${remainingHours <= 4 ? "#F44336" : "#333"}; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Membership Hours Used</h1>
      <p>412 Studios</p>
    </div>
    <div class="content">
      <p>Thank you for using your membership hours at 412 Studios!</p>
      
      <div class="booking-details">
        <h3>Booking Details:</h3>
        <p><strong>Studio:</strong> ${studioName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Hours Used:</strong> ${hoursUsed} hours</p>
      </div>
      
      <div class="membership-status">
        <h3>Membership Status:</h3>
        <p><strong>Remaining Hours:</strong> ${remainingHours} hours</p>
      </div>
      
      <p>You can view your full booking history and membership details in your 412 Studios account.</p>
      
      <p>If you have any questions about your membership or need assistance, please contact us at ${SUPPORT_EMAIL}.</p>
      
      <p>Thank you for choosing 412 Studios!</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} 412 Studios. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  return sendEmail(to, subject, text, html);
};
