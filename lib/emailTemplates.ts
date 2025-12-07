// Email template constants and configurations
export const EMAIL_CONSTANTS = {
  STUDIO_ADDRESS: "412 Richmond St E, Toronto, ON M5A 1P8",
  GOOGLE_MAPS_URL:
    "https://www.google.com/maps/dir/?api=1&destination=412+Richmond+St+E+Toronto+ON+M5A+1P8",
  SUPPORT_EMAIL: "alec@412studios.com",
  COMPANY_NAME: "412 Studios",
  WEBSITE_URL: "https://412studios.ca",
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? (process.env.PRODUCTION_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://412studios.ca"))
      : "http://localhost:3000",
};

const getLOGO_PNG = () => `
<img 
  src="${EMAIL_CONSTANTS.BASE_URL}/images/email-head.gif" 
  alt="412 Studios" 
  style="
    width: 100%;
    max-height: 200px;
    height: auto;
    display: block;
    margin: 0 auto;
    object-fit: cover;
  "
/>
`;

// Email-compatible inline styles
const INLINE_STYLES = {
  container:
    "width: 100%; max-width: 640px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;",
  header: "background-color: #111; color: white; text-align: center;",
  content: "padding: 15px; background-color: rgb(247, 247, 247);",
  section:
    "padding: 15px; background-color: rgb(239, 239, 239); border-radius: 6px; margin-bottom: 15px;",
  h1: "font-size: 24px; font-weight: bold; margin: 0 0 10px 0; color: #333;",
  h3: "font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #333;",
  p: "font-size: 14px; margin: 5px 0; color: #333;",
  strong: "font-weight: bold;",
  button:
    "display: inline-block; background-color: #111; color: white; padding: 2px 30px; border-radius: 25px; text-decoration: none; margin-top: 10px;",
  link: "color: #111; text-decoration: none;",
  footer:
    "background-color: #111; color: white; padding: 15px; text-align: center;",
};

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
  offerCode?: string;
  discountAmount?: number;
  originalPrice?: number;
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

// Content generators for different email types
const generateBookingContent = (data: BookingDetails) => ({
  title: "Booking Confirmation",
  content: `
    <div style="${INLINE_STYLES.section}">
      <h1 style="${INLINE_STYLES.h1}">Booking Confirmed</h1>
      <p style="${INLINE_STYLES.p}">Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div style="${INLINE_STYLES.section}">
      <h3 style="${INLINE_STYLES.h3}">Booking Details:</h3>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Studio:</span> ${data.studioName}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Date:</span> ${data.date}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Time:</span> ${data.startTime} - ${data.endTime}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Duration:</span> ${data.duration} hours</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Engineering Services:</span> ${data.engineeringIncluded ? "Included" : "Not included"}</p>
      ${data.offerCode && data.discountAmount ? `
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Original Price:</span> $${data.originalPrice}.00 CAD</p>
      <p style="${INLINE_STYLES.p}; color: #16a34a;"><span style="${INLINE_STYLES.strong}">Discount (${data.offerCode}):</span> -$${data.discountAmount}.00 CAD</p>
      ` : ''}
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Total Price:</span> $${data.price}.00 CAD</p>
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
${data.offerCode && data.discountAmount ? `- Original Price: $${data.originalPrice}.00 CAD
- Discount (${data.offerCode}): -$${data.discountAmount}.00 CAD
` : ''}- Total Price: $${data.price}.00 CAD

Studio Location:
${EMAIL_CONSTANTS.STUDIO_ADDRESS}
Directions: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

For additional information, please contact us at
${EMAIL_CONSTANTS.SUPPORT_EMAIL}
647-540-2321
  `,
});

const generateMembershipContent = (data: MembershipDetails) => ({
  title: "Membership Confirmation",
  content: `
    <div style="${INLINE_STYLES.section}">
      <h1 style="${INLINE_STYLES.h1}">Membership Confirmed</h1>
      <p style="${INLINE_STYLES.p}">Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div style="${INLINE_STYLES.section}">
      <h3 style="${INLINE_STYLES.h3}">Membership Details:</h3>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Studio:</span> ${data.studioName}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Available Hours:</span> ${data.availableHours} hours</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Membership Fee:</span> $${data.membershipPrice}.00 CAD</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Billing Cycle:</span> ${data.billingCycle}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Status:</span> ${data.status}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Valid Through:</span> ${data.validThrough}</p>
    </div>
  `,
  plainText: `
Membership Confirmed
Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!

Membership Details:
- Studio: ${data.studioName}
- Available Hours: ${data.availableHours} hours
- Membership Fee: $${data.membershipPrice}.00 CAD
- Billing Cycle: ${data.billingCycle}
- Status: ${data.status}
- Valid Through: ${data.validThrough}

Studio Location:
${EMAIL_CONSTANTS.STUDIO_ADDRESS}
Directions: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

For additional information, please contact us at
${EMAIL_CONSTANTS.SUPPORT_EMAIL}
647-540-2321
  `,
});

const generateUsageContent = (data: UsageDetails) => ({
  title: "Membership Hours Used",
  content: `
    <div style="${INLINE_STYLES.section}">
      <h1 style="${INLINE_STYLES.h1}">Membership Update</h1>
      <p style="${INLINE_STYLES.p}">Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div style="${INLINE_STYLES.section}">
      <h3 style="${INLINE_STYLES.h3}">Booking Details:</h3>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Studio:</span> ${data.studioName}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Date:</span> ${data.date}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Time:</span> ${data.startTime} - ${data.endTime}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Hours Used:</span> ${data.hoursUsed} hours</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Booking ID:</span> ${data.bookingId}</p>
    </div>
    <div style="${INLINE_STYLES.section}">
      <h3 style="${INLINE_STYLES.h3}">Membership Status:</h3>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Remaining Hours:</span> ${data.remainingHours} hours</p>
    </div>
  `,
  plainText: `
Membership Update
Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!

Booking Details:
- Studio: ${data.studioName}
- Date: ${data.date}
- Time: ${data.startTime} - ${data.endTime}
- Hours Used: ${data.hoursUsed} hours
- Booking ID: ${data.bookingId}

Membership Status:
- Remaining Hours: ${data.remainingHours} hours

Studio Location:
${EMAIL_CONSTANTS.STUDIO_ADDRESS}
Directions: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

For additional information, please contact us at
${EMAIL_CONSTANTS.SUPPORT_EMAIL}
647-540-2321
  `,
});

const generateReminderContent = (data: BookingDetails) => ({
  title: "Session Reminder",
  content: `
    <div style="${INLINE_STYLES.section}">
      <h1 style="${INLINE_STYLES.h1}">Session Reminder</h1>
      <p style="${INLINE_STYLES.p}">Your studio session is tomorrow at ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div style="${INLINE_STYLES.section}">
      <h3 style="${INLINE_STYLES.h3}">Session Details:</h3>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Studio:</span> ${data.studioName}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Date:</span> ${data.date}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Time:</span> ${data.startTime} - ${data.endTime}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Duration:</span> ${data.duration} hours</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Engineering Services:</span> ${data.engineeringIncluded ? "Included" : "Not included"}</p>
      <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Total Price:</span> $${data.price}.00 CAD</p>
    </div>
  `,
  plainText: `
Session Reminder
Your studio session is tomorrow at ${EMAIL_CONSTANTS.COMPANY_NAME}!

Session Details:
- Studio: ${data.studioName}
- Date: ${data.date}
- Time: ${data.startTime} - ${data.endTime}
- Duration: ${data.duration} hours
- Engineering Services: ${data.engineeringIncluded ? "Included" : "Not included"}
- Total Price: $${data.price}.00 CAD

Studio Location:
${EMAIL_CONSTANTS.STUDIO_ADDRESS}
Directions: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

Looking forward to seeing you tomorrow! 
For questions, contact us at:
${EMAIL_CONSTANTS.SUPPORT_EMAIL}
647-540-2321
  `,
});

// Universal email template generator
export const generateEmail = (
  type: EmailType,
  data: BookingDetails | MembershipDetails | UsageDetails,
) => {
  let emailContent;

  switch (type) {
    case "booking-confirmation":
      emailContent = generateBookingContent(data as BookingDetails);
      break;
    case "membership-confirmation":
      emailContent = generateMembershipContent(data as MembershipDetails);
      break;
    case "membership-usage":
      emailContent = generateUsageContent(data as UsageDetails);
      break;
    case "booking-reminder":
      emailContent = generateReminderContent(data as BookingDetails);
      break;
    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${emailContent.title}</title>
</head>
<body style="margin: 0; padding: 0;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tbody>
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="${INLINE_STYLES.container}">
            <tbody>
              <tr>
                <td style="${INLINE_STYLES.header}">
                  ${getLOGO_PNG()}
                </td>
              </tr>
              <tr>
                <td style="${INLINE_STYLES.content}">
                  ${emailContent.content}
                  <div style="${INLINE_STYLES.section}">
                    <h3 style="${INLINE_STYLES.h3}">Studio Location:</h3>
                    <p style="${INLINE_STYLES.p}"><span style="${INLINE_STYLES.strong}">Address:</span></p>
                    <p style="${INLINE_STYLES.p}">${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
                    <p style="${INLINE_STYLES.p}"><a href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" style="${INLINE_STYLES.button}" target="_blank">Get Directions</a></p>
                  </div>
                  <div style="${INLINE_STYLES.section}">
                    <p style="${INLINE_STYLES.p}">For additional information, please contact us at:</p>
                    <p style="${INLINE_STYLES.p}"><a href="mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}" style="${INLINE_STYLES.link}">${EMAIL_CONSTANTS.SUPPORT_EMAIL}</a></p>
                    <p style="${INLINE_STYLES.p}"><a href="tel:+16475402321" style="${INLINE_STYLES.link}">647-540-2321</a></p>
                  </div>
                  <div style="${INLINE_STYLES.section} margin-bottom: 0px">
                    <p style="${INLINE_STYLES.p}; text-align: center;">© ${new Date().getFullYear()} ${EMAIL_CONSTANTS.COMPANY_NAME}. All rights reserved.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  `;

  return {
    html: html.trim(),
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
