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

// 412 Studios Logo PNG (email-compatible)
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

// Base email styles with dark mode prevention
const BASE_STYLES = `
  .email-container {
    max-width: 640px !Important;
    margin: 0 auto !Important;
    overflow: hidden !Important;
    border: 1px solid #111 !Important;
    border-radius: 6px !important;
  }
  .email-header {
    background-color: #111 !important;
    color: white !important;
    padding: 15px !important;
  }
  .email-content {
    padding: 15px !important;
    background-color:rgb(247, 247, 247) !important;
    display: flex !important; 
    flex-direction: column !important; 
    gap: 15px !important;
    
  }
  .email-footer {
    background-color: #111 !important;
    color: white !important;
    padding: 15px !important;
    text-align: center !important;
  }
  .email-section {
    padding: 15px !important;
    background-color:rgb(239, 239, 239) !important;
    border-radius: 6px !important;
  }

  strong {
    font-weight: 700 !important;
  }

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

// Content generators for different email types
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

const generateMembershipContent = (data: MembershipDetails) => ({
  title: "Membership Confirmation",
  content: `
    <div class="email-section">
      <h1>Membership Confirmed</h1>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="email-section">
      <h3>Membership Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Available Hours:</strong> ${data.availableHours} hours</p>
      <p><strong>Membership Fee:</strong> $${data.membershipPrice}.00 CAD</p>
      <p><strong>Billing Cycle:</strong> ${data.billingCycle}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Valid Through:</strong> ${data.validThrough}</p>
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
    <div class="email-section">
      <h1>Membership Update</h1>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="email-section">
      <h3>Booking Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
      <p><strong>Hours Used:</strong> ${data.hoursUsed} hours</p>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
    </div>
    <div class="email-section">
      <h3>Membership Status:</h3>
      <p><strong>Remaining Hours:</strong> <span>${data.remainingHours} hours</span></p>
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
    <div class="email-section">
      <h1>Session Reminder</h1>
      <p>Your studio session is tomorrow at ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="email-section">
      <h3>Session Details:</h3>
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
      <p>Looking forward to seeing you tomorrow!</p>
      <p>For questions, contact us at:</p>
      <p><a href="mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}">${EMAIL_CONSTANTS.SUPPORT_EMAIL}</a></p>
      <p><a href="tel:+16475402321">647-540-2321</a></p>
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
  <style>
    ${BASE_STYLES}
  </style>
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
      <p>
        ${EMAIL_CONSTANTS.STUDIO_ADDRESS}
      </p>
    </div>
  </div>
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
