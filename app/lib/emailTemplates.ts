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

// Style map for inline replacements
const EMAIL_STYLE_MAP: Record<string, string> = {
  "email-container": `
    max-width: 640px;
    margin: 0 auto;
    overflow: hidden;
    border: 1px solid #111;
    border-radius: 6px;
  `,
  "email-header": `
    background-color: #111;
    color: white;
    padding: 15px;
    text-align: center;
  `,
  "email-content": `
    padding: 15px;
    background-color: rgb(247, 247, 247);
    display: flex;
    flex-direction: column;
    gap: 15px;
  `,
  "email-footer": `
    background-color: #111;
    color: white;
    padding: 15px;
    text-align: center;
  `,
  "email-section": `
    padding: 15px;
    background-color: rgb(239, 239, 239);
    border-radius: 6px;
  `,
  "map-button": `
    display: inline-block;
    padding: 10px 15px;
    background-color: #111;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 10px;
  `,
};

// Utility to replace class attributes with inline styles
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
  style="
    height: auto;
    max-height: 60px;
    width: auto;
    display: block;
    margin: 0 auto;
  "
/>
`;

// Email types
export type EmailType =
  | "booking-confirmation"
  | "membership-confirmation"
  | "membership-usage"
  | "booking-reminder";

// Email data interfaces
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

const generateBookingContent = (data: BookingDetails) => ({
  title: "Booking Confirmation",
  content: `
    <div class="email-section">
      <h1>Booking Confirmed</h1>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="email-section">
      <h3>Booking Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
      <p><strong>Duration:</strong> ${data.duration} hours</p>
      <p><strong>Engineering Services:</strong> ${data.engineeringIncluded ? "Included" : "Not included"}</p>
      <p><strong>Total Price:</strong> $${data.price}.00 CAD</p>
    </div>
    <div class="email-section">
      <h3>Studio Location:</h3>
      <p><strong>Address:</strong> ${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
      <a href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" class="map-button" target="_blank">Directions</a>
    </div>
    <div class="email-section">
      <p>For additional information, please contact us at</p>
      <p><a href="mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}">${EMAIL_CONSTANTS.SUPPORT_EMAIL}</a></p>
      <p><a href="tel:+16475402321">647-540-2321</a></p>
    </div>
  `,
  plainText: `
Booking Confirmed
Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!

Booking Details:
- Studio: ${data.studioName}
- Date: ${data.date}
- Time: ${data.startTime} - ${data.endTime}
- Duration: ${data.duration} hours
- Engineering Services: ${data.engineeringIncluded ? "Included" : "Not included"}
- Total Price: $${data.price}.00 CAD

Studio Location:
${EMAIL_CONSTANTS.STUDIO_ADDRESS}
Directions: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

For additional information, please contact us at
${EMAIL_CONSTANTS.SUPPORT_EMAIL}
647-540-2321
  `,
});

export const generateEmail = (
  type: EmailType,
  data: BookingDetails | MembershipDetails | UsageDetails
) => {
  let emailContent;

  switch (type) {
    case "booking-confirmation":
      emailContent = generateBookingContent(data as BookingDetails);
      break;
    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  const rawHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailContent.title}</title>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      ${getLOGO_PNG()}
    </div>
    <div class="email-content">
      ${emailContent.content}
    </div>
    <div class="email-footer">
      <p>© ${new Date().getFullYear()} ${EMAIL_CONSTANTS.COMPANY_NAME}. All rights reserved.</p>
      <p>${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    html: inlineEmailStyles(rawHtml.trim()),
    text: emailContent.plainText.trim(),
  };
};

// Convenience functions for backwards compatibility
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
