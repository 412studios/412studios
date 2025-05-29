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

// Email styling utility functions
const createSection = (content: string, bgColor: string = "#efefef") => `
  <table cellpadding="15" cellspacing="0" border="0" width="100%" style="margin-top: 15px;">
    <tr>
      <td style="background-color: ${bgColor}; border-radius: 6px; padding: 15px;">
        ${content}
      </td>
    </tr>
  </table>
`;

const createFirstSection = (content: string, bgColor: string = "#efefef") => `
  <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f7f7f7; border-radius: 6px;">
    <tr>
      <td style="background-color: ${bgColor}; border-radius: 6px; padding: 15px;">
        ${content}
      </td>
    </tr>
  </table>
`;

const h1Style =
  "color: #111111; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;";
const h3Style =
  "color: #111111; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;";
const pStyle =
  "color: #111111; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; margin: 5px 0;";
const pLargeStyle =
  "color: #111111; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.4; margin: 0;";
const strongStyle = "font-weight: bold;";
const buttonStyle =
  "display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; margin-top: 10px;";
const linkStyle = "color: #111111; text-decoration: underline;";

const createH1 = (text: string) => `<h1 style="${h1Style}">${text}</h1>`;
const createH3 = (text: string) => `<h3 style="${h3Style}">${text}</h3>`;
const createP = (text: string, large: boolean = false) =>
  `<p style="${large ? pLargeStyle : pStyle}">${text}</p>`;
const createStrong = (text: string) =>
  `<strong style="${strongStyle}">${text}</strong>`;
const createButton = (text: string, href: string) =>
  `<a href="${href}" target="_blank" style="${buttonStyle}">${text}</a>`;
const createLink = (text: string, href: string) =>
  `<a href="${href}" style="${linkStyle}">${text}</a>`;

const createDetailRow = (label: string, value: string) =>
  createP(`${createStrong(label + ":")} ${value}`);

const getLOGO_PNG = () => `
<img 
  src="${EMAIL_CONSTANTS.BASE_URL}/icons/Logo.png" 
  alt="412 Studios" 
  height="60"
  width="auto"
  style="height: 60px; width: auto; display: block; margin: 0 auto; max-width: 100%;"
/>
`;

const createContactSection = () =>
  createSection(`
  ${createP("For additional information, please contact us at")}
  ${createP(createLink(EMAIL_CONSTANTS.SUPPORT_EMAIL, `mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}`))}
  ${createP(createLink("647-540-2321", "tel:+16475402321"))}
`);

const createLocationSection = () =>
  createSection(`
  ${createH3("Studio Location")}
  ${createDetailRow("Address", EMAIL_CONSTANTS.STUDIO_ADDRESS)}
  ${createButton("Get Directions", EMAIL_CONSTANTS.GOOGLE_MAPS_URL)}
`);

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

// Content generators for different email types
const generateBookingContent = (data: BookingDetails) => ({
  title: "Booking Confirmation",
  content: `
    ${createFirstSection(`
      ${createH1("Booking Confirmed")}
      ${createP(`Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!`, true)}
    `)}
    
    ${createSection(`
      ${createH3("Booking Details")}
      ${createDetailRow("Studio", data.studioName)}
      ${createDetailRow("Date", data.date)}
      ${createDetailRow("Time", `${data.startTime} - ${data.endTime}`)}
      ${createDetailRow("Duration", `${data.duration} hours`)}
      ${createDetailRow("Engineering Services", data.engineeringIncluded ? "Included" : "Not included")}
      ${createDetailRow("Total Price", `$${data.price}.00 CAD`)}
    `)}
    
    ${createLocationSection()}
    ${createContactSection()}
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

const generateMembershipContent = (data: MembershipDetails) => ({
  title: "Membership Confirmation",
  content: `
    ${createFirstSection(`
      ${createH1("Membership Confirmed")}
      ${createP(`Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!`, true)}
    `)}
    
    ${createSection(`
      ${createH3("Membership Details")}
      ${createDetailRow("Studio", data.studioName)}
      ${createDetailRow("Available Hours", `${data.availableHours} hours`)}
      ${createDetailRow("Membership Fee", `$${data.membershipPrice}.00 CAD`)}
      ${createDetailRow("Billing Cycle", data.billingCycle)}
      ${createDetailRow("Status", data.status)}
      ${createDetailRow("Valid Through", data.validThrough)}
    `)}
    
    ${createLocationSection()}
    ${createContactSection()}
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
    ${createFirstSection(`
      ${createH1("Membership Update")}
      ${createP(`Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!`, true)}
    `)}
    
    ${createSection(`
      ${createH3("Booking Details")}
      ${createDetailRow("Studio", data.studioName)}
      ${createDetailRow("Date", data.date)}
      ${createDetailRow("Time", `${data.startTime} - ${data.endTime}`)}
      ${createDetailRow("Hours Used", `${data.hoursUsed} hours`)}
      ${createDetailRow("Booking ID", data.bookingId)}
    `)}
    
    ${createSection(`
      ${createH3("Membership Status")}
      ${createDetailRow("Remaining Hours", `${data.remainingHours} hours`)}
    `)}
    
    ${createLocationSection()}
    ${createContactSection()}
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
    ${createFirstSection(`
      ${createH1("Session Reminder")}
      ${createP(`Your studio session is tomorrow at ${EMAIL_CONSTANTS.COMPANY_NAME}!`, true)}
    `)}
    
    ${createSection(`
      ${createH3("Session Details")}
      ${createDetailRow("Studio", data.studioName)}
      ${createDetailRow("Date", data.date)}
      ${createDetailRow("Time", `${data.startTime} - ${data.endTime}`)}
      ${createDetailRow("Duration", `${data.duration} hours`)}
      ${createDetailRow("Engineering Services", data.engineeringIncluded ? "Included" : "Not included")}
      ${createDetailRow("Total Price", `$${data.price}.00 CAD`)}
    `)}
    
    ${createLocationSection()}
    
    ${createSection(`
      ${createP("Looking forward to seeing you tomorrow!")}
      ${createP("For questions, contact us at:")}
      ${createP(createLink(EMAIL_CONSTANTS.SUPPORT_EMAIL, `mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}`))}
      ${createP(createLink("647-540-2321", "tel:+16475402321"))}
    `)}
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
  data: BookingDetails | MembershipDetails | UsageDetails
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
<body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f7f7f7;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="640" style="max-width: 640px; width: 100%; background-color: #ffffff; border: 1px solid #111111; border-radius: 6px;">
          <!-- Header -->
          <tr>
            <td style="background-color: #111111; color: #ffffff; padding: 15px; text-align: center; border-radius: 6px 6px 0 0;">
              ${getLOGO_PNG()}
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 0;">
              ${emailContent.content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #111111; color: #ffffff; padding: 15px; text-align: center; border-radius: 0 0 6px 6px;">
              <p style="color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; margin: 5px 0;">© ${new Date().getFullYear()} ${EMAIL_CONSTANTS.COMPANY_NAME}. All rights reserved.</p>
              <p style="color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; margin: 5px 0;">${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
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
