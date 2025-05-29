// Email template constants and configurations
export const EMAIL_CONSTANTS = {
  STUDIO_ADDRESS: "412 Richmond St E, Toronto, ON M5A 1P8",
  GOOGLE_MAPS_URL:
    "https://www.google.com/maps/dir/?api=1&destination=412+Richmond+St+E+Toronto+ON+M5A+1P8",
  SUPPORT_EMAIL: "alec@412studios.com",
  COMPANY_NAME: "412 Studios",
  WEBSITE_URL: "https://412studios.com",
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://412studios.ca"
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
};

export type EmailType =
  | "booking-confirmation"
  | "membership-confirmation"
  | "membership-usage"
  | "booking-reminder";

export interface BookingDetails {
  studioName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  engineeringIncluded?: boolean;
}

export interface MembershipDetails {
  studioName: string;
  availableHours: number;
  membershipPrice: number;
  billingCycle: string;
  status: string;
  validThrough: string;
}

export interface UsageDetails {
  studioName: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursUsed: number;
  remainingHours: number;
  bookingId: string;
}

// Style map for inline replacements
const EMAIL_STYLE_MAP: Record<string, string> = {
  "main-wrapper": `
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    border: 1px solid #111;
    background-color: #f7f7f7;
  `,
  header: `
    background-color: #111;
    color: #ffffff;
    padding: 20px;
    text-align: center;
  `,
  section: `
    padding: 15px;
    background-color: #efefef;
  `,
  footer: `
    background-color: #111;
    color: white;
    text-align: center;
    padding: 15px;
  `,
  link: `
    color: #0000EE;
    text-decoration: underline;
  `,
};

function inlineEmailStyles(html: string): string {
  return html.replace(/class="([^"]+)"/g, (_, classNames: string) => {
    const combinedStyles = classNames
      .split(/\s+/)
      .map((cls) => EMAIL_STYLE_MAP[cls] || "")
      .join(" ")
      .trim();

    return combinedStyles ? `style="${combinedStyles}"` : "";
  });
}

const getLOGO_PNG = () => `
<img 
  src="${EMAIL_CONSTANTS.BASE_URL}/icons/Logo.png" 
  alt="412 Studios" 
  style="height:auto;max-height:60px;width:auto;display:block;margin:0 auto;"/>
`;

export const generateEmail = (
  type: EmailType,
  data: BookingDetails | MembershipDetails | UsageDetails
) => {
  if (type !== "booking-confirmation") {
    throw new Error(`Email type not yet supported: ${type}`);
  }

  const booking = data as BookingDetails;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body>
  <table class="main-wrapper" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td class="header">
        ${getLOGO_PNG()}
      </td>
    </tr>
    <tr>
      <td class="section">
        <h1 style="margin:0;color:#000;">Booking Confirmed</h1>
        <p style="color:#000;">Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
      </td>
    </tr>
    <tr>
      <td class="section">
        <h3 style="margin:0;color:#000;">Booking Details:</h3>
        <p style="color:#000;"><strong>Studio:</strong> ${booking.studioName}</p>
        <p style="color:#000;"><strong>Date:</strong> ${booking.date}</p>
        <p style="color:#000;"><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
        <p style="color:#000;"><strong>Duration:</strong> ${booking.duration} hours</p>
        <p style="color:#000;"><strong>Engineering Services:</strong> ${booking.engineeringIncluded ? "Included" : "Not included"}</p>
        <p style="color:#000;"><strong>Total Price:</strong> $${booking.price}.00 CAD</p>
      </td>
    </tr>
    <tr>
      <td class="section">
        <h3 style="margin:0;color:#000;">Studio Location:</h3>
        <p style="color:#000;"><strong>Address:</strong> <a class="link" href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" target="_blank">${EMAIL_CONSTANTS.STUDIO_ADDRESS}</a></p>
        <p><a class="link" href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" target="_blank" style="display:inline-block;padding:10px 15px;background:#111;color:#fff;text-decoration:none;border-radius:4px;margin-top:10px;">Directions</a></p>
      </td>
    </tr>
    <tr>
      <td class="section">
        <p style="color:#000;">For additional information, please contact us at:</p>
        <p><a class="link" href="mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}">${EMAIL_CONSTANTS.SUPPORT_EMAIL}</a></p>
        <p><a class="link" href="tel:+16475402321">647-540-2321</a></p>
      </td>
    </tr>
    <tr>
      <td class="footer">
        <p>© ${new Date().getFullYear()} ${EMAIL_CONSTANTS.COMPANY_NAME}. All rights reserved.</p>
        <p><a class="link" href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" target="_blank">${EMAIL_CONSTANTS.STUDIO_ADDRESS}</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return {
    html: inlineEmailStyles(html.trim()),
    text: `Booking Confirmed\nThank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!\n\nBooking Details:\n- Studio: ${booking.studioName}\n- Date: ${booking.date}\n- Time: ${booking.startTime} - ${booking.endTime}\n- Duration: ${booking.duration} hours\n- Engineering Services: ${booking.engineeringIncluded ? "Included" : "Not included"}\n- Total Price: $${booking.price}.00 CAD\n\nStudio Location:\n${EMAIL_CONSTANTS.STUDIO_ADDRESS}\nDirections: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}\n\nFor additional information, please contact us at\n${EMAIL_CONSTANTS.SUPPORT_EMAIL}\n647-540-2321`,
  };
};

export const generateBookingConfirmationEmail = (data: BookingDetails) =>
  generateEmail("booking-confirmation", data).html;

export const generateBookingConfirmationText = (data: BookingDetails) =>
  generateEmail("booking-confirmation", data).text;

export const generateMembershipConfirmationEmail = (data: MembershipDetails) =>
  generateEmail("membership-confirmation", data).html;

export const generateMembershipConfirmationText = (data: MembershipDetails) =>
  generateEmail("membership-confirmation", data).text;

export const generateMembershipUsageEmail = (data: UsageDetails) =>
  generateEmail("membership-usage", data).html;

export const generateMembershipUsageText = (data: UsageDetails) =>
  generateEmail("membership-usage", data).text;

export const generateBookingReminderEmail = (data: BookingDetails) =>
  generateEmail("booking-reminder", data).html;

export const generateBookingReminderText = (data: BookingDetails) =>
  generateEmail("booking-reminder", data).text;
