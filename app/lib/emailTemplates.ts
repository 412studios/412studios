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

// Dark mode resistant styles - these will force light mode in all email clients
const DARK_MODE_STYLES = `
  /* Force light mode and prevent dark mode overrides */
  [data-ogsc] .email-container,
  [data-ogsb] .email-container,
  .email-container {
    background-color: #ffffff !important;
    color: #111111 !important;
  }
  
  [data-ogsc] .email-header,
  [data-ogsb] .email-header,
  .email-header {
    background-color: #111111 !important;
    color: #ffffff !important;
  }
  
  [data-ogsc] .email-content,
  [data-ogsb] .email-content,
  .email-content {
    background-color: #ffffff !important;
    color: #111111 !important;
  }
  
  [data-ogsc] .email-section,
  [data-ogsb] .email-section,
  .email-section {
    background-color: #efefef !important;
    color: #111111 !important;
  }
  
  [data-ogsc] .email-footer,
  [data-ogsb] .email-footer,
  .email-footer {
    background-color: #111111 !important;
    color: #ffffff !important;
  }
  
  [data-ogsc] .email-text,
  [data-ogsb] .email-text,
  .email-text {
    color: #111111 !important;
  }
  
  [data-ogsc] .email-text-white,
  [data-ogsb] .email-text-white,
  .email-text-white {
    color: #ffffff !important;
  }
  
  [data-ogsc] .email-button,
  [data-ogsb] .email-button,
  .email-button {
    background-color: #111111 !important;
    color: #ffffff !important;
    border: 2px solid #111111 !important;
  }
  
  [data-ogsc] .email-link,
  [data-ogsb] .email-link,
  .email-link {
    color: #111111 !important;
  }
`;

// Email styling utility functions with dark mode resistance
const createSection = (content: string, bgColor: string = "#efefef") => `
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 15px;">
    <tr>
      <td class="email-section" style="background-color: ${bgColor} !important; border-radius: 6px; padding: 15px; color: #111111 !important;">
        ${content}
      </td>
    </tr>
  </table>
`;

const createFirstSection = (content: string, bgColor: string = "#efefef") => `
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td class="email-section" style="background-color: ${bgColor} !important; border-radius: 6px; padding: 15px; color: #111111 !important;">
        ${content}
      </td>
    </tr>
  </table>
`;

// Styles with dark mode resistance
const h1Style =
  "color: #111111 !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 24px !important; font-weight: bold !important; margin: 0 0 10px 0 !important; line-height: 1.2 !important;";
const h3Style =
  "color: #111111 !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 18px !important; font-weight: bold !important; margin: 0 0 10px 0 !important; line-height: 1.2 !important;";
const pStyle =
  "color: #111111 !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 14px !important; line-height: 1.4 !important; margin: 5px 0 !important;";
const pLargeStyle =
  "color: #111111 !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 16px !important; line-height: 1.4 !important; margin: 0 !important;";
const pWhiteStyle =
  "color: #ffffff !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 12px !important; line-height: 1.4 !important; margin: 5px 0 !important;";
const strongStyle = "font-weight: bold !important; color: inherit !important;";
const buttonStyle =
  "display: inline-block !important; background-color: #111111 !important; color: #ffffff !important; text-decoration: none !important; padding: 10px 20px !important; border-radius: 4px !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 14px !important; font-weight: bold !important; margin-top: 10px !important; border: 2px solid #111111 !important;";
const linkStyle =
  "color: #111111 !important; text-decoration: underline !important;";

const createH1 = (text: string) =>
  `<h1 class="email-text" style="${h1Style}">${text}</h1>`;
const createH3 = (text: string) =>
  `<h3 class="email-text" style="${h3Style}">${text}</h3>`;
const createP = (text: string, large: boolean = false) =>
  `<p class="email-text" style="${large ? pLargeStyle : pStyle}">${text}</p>`;
const createPWhite = (text: string) =>
  `<p class="email-text-white" style="${pWhiteStyle}">${text}</p>`;
const createStrong = (text: string) =>
  `<strong style="${strongStyle}">${text}</strong>`;
const createButton = (text: string, href: string) =>
  `<a href="${href}" target="_blank" class="email-button" style="${buttonStyle}">${text}</a>`;
const createLink = (text: string, href: string) =>
  `<a href="${href}" class="email-link" style="${linkStyle}">${text}</a>`;

const createDetailRow = (label: string, value: string) =>
  createP(`${createStrong(label + ":")} ${value}`);

const getLOGO_PNG = () => `
<img 
  src="${EMAIL_CONSTANTS.BASE_URL}/icons/Logo.png" 
  alt="412 Studios" 
  height="60"
  width="auto"
  style="height: 60px !important; width: auto !important; display: block !important; margin: 0 auto !important; max-width: 100% !important;"
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
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>${emailContent.title}</title>
  <style>
    ${DARK_MODE_STYLES}
    
    /* Additional Gmail and iOS overrides */
    @media (prefers-color-scheme: dark) {
      .email-container,
      .email-content,
      .email-section {
        background-color: #ffffff !important;
        color: #111111 !important;
      }
      .email-header,
      .email-footer {
        background-color: #111111 !important;
        color: #ffffff !important;
      }
      .email-text {
        color: #111111 !important;
      }
      .email-text-white {
        color: #ffffff !important;
      }
      .email-button {
        background-color: #111111 !important;
        color: #ffffff !important;
        border: 2px solid #111111 !important;
      }
      .email-link {
        color: #111111 !important;
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f7f7f7 !important; font-family: Arial, Helvetica, sans-serif !important;">
  <div style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0;">
    ${emailContent.title} - ${EMAIL_CONSTANTS.COMPANY_NAME}
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" class="email-container" style="background-color: #f7f7f7 !important; margin: 0 !important; padding: 0 !important;">
    <tr>
      <td align="center" style="padding: 20px 10px !important;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px !important; width: 100% !important; background-color: #ffffff !important; border: 2px solid #111111 !important; border-radius: 8px !important;">
          <!-- Header -->
          <tr>
            <td class="email-header" style="background-color: #111111 !important; color: #ffffff !important; padding: 20px !important; text-align: center !important; border-radius: 6px 6px 0 0 !important;">
              ${getLOGO_PNG()}
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td class="email-content" style="padding: 15px !important; background-color: #ffffff !important; color: #111111 !important;">
              ${emailContent.content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="email-footer" style="background-color: #111111 !important; color: #ffffff !important; padding: 20px !important; text-align: center !important; border-radius: 0 0 6px 6px !important;">
              ${createPWhite(`© ${new Date().getFullYear()} ${EMAIL_CONSTANTS.COMPANY_NAME}. All rights reserved.`)}
              ${createPWhite(EMAIL_CONSTANTS.STUDIO_ADDRESS)}
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
