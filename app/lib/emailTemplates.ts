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
  /* Dark mode prevention for all email clients */
  [data-ogsc] body,
  [data-ogsc] .email-container,
  [data-ogsc] .content,
  [data-ogsc] .details-section,
  [data-ogsc] .location-section,
  [data-ogsc] h1,
  [data-ogsc] h3,
  [data-ogsc] p,
  [data-ogsc] a,
  [data-ogsc] strong {
    background-color: white !important;
    color: #333 !important;
  }

  /* Outlook dark mode prevention */
  [data-ogsb] body,
  [data-ogsb] .email-container,
  [data-ogsb] .content,
  [data-ogsb] .details-section,
  [data-ogsb] .location-section,
  [data-ogsb] h1,
  [data-ogsb] h3,
  [data-ogsb] p,
  [data-ogsb] a,
  [data-ogsb] strong {
    background-color: white !important;
    color: #333 !important;
  }

  /* Gmail dark mode prevention */
  [data-ogsc] .go-button,
  [data-ogsb] .go-button {
    background-color: #111 !important;
    color: #f9f9f9 !important;
  }

  /* Force light mode using CSS custom properties */
  :root {
    color-scheme: light only;
    supported-color-schemes: light;
  }

  /* Meta tag approach for dark mode prevention */
  @media (prefers-color-scheme: dark) {
    body,
    .email-container,
    .content,
    .details-section,
    .location-section,
    h1,
    h3,
    p,
    a,
    strong {
      background-color: white !important;
      color: #333 !important;
    }
    
    .header{
      background-color: #111 !important;
    }
    .footer {
      background-color: #111 !important;
    }
    .footer p {
      background-color: #111 !important;
      color: #fff !important;
    }
    
    .map-button {
      background-color: #111 !important;
      color: #f9f9f9 !important;
    }
  }

  body { 
    font-family: Helvetica, Arial, sans-serif !important; 
    line-height: 1.6 !important; 
    color: #333 !important; 
    margin: 0 !important;
    padding: 0 !important;
    background-color: #f4f4f4 !important;
    color-scheme: light !important;
    supported-color-schemes: light !important;
  }
  
  .email-container { 
    max-width: 600px !important; 
    margin: 0 auto !important; 
    background-color: white !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    border: 1px solid #111 !important;
  }
  
  .header { 
    padding: 30px !important; 
    display: flex !important;
    justify-content: center !important;
  }
  
  .header svg {
    height: 100% !important;
    max-height: 130px !important;
    width: auto !important;
  }
  
  h1 {
    font-size: 28px !important;
    font-weight: 700 !important;
    margin: 0 !important;
    color: #333 !important;
  }
  
  h3 {
    color: #333 !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
  
  p {
    font-size: 14px !important;
    margin: 0 !important;
    color: #333 !important;
  }
  
  a {
    color: #333 !important;
    text-decoration: underline !important;
  }
  
  strong {
    font-weight: 700 !important;
    color: #333 !important;
  }
  
  .content { 
    padding: 15px !important; 
    background-color: white !important;
  }
  
  .title-section {
    text-align: center !important;
    background-color: white !important;
  }
  
  .details-section { 
    background-color: #f9f9f9 !important; 
    padding: 15px !important; 
    margin: 15px 0 !important; 
    border-radius: 12px !important;
  }  
  
  .location-section { 
    background-color: #f9f9f9 !important; 
    padding: 15px !important; 
    margin: 15px 0 !important; 
    border-radius: 12px !important;
  }
  
  .map-button { 
    display: inline-block !important; 
    background-color: #111 !important;
    color: #f9f9f9 !important; 
    padding: 10px 45px !important; 
    text-decoration: none !important; 
    border-radius: 30px !important; 
    margin-top: 10px !important;
    font-weight: bold !important;
    font-size: 14px !important;
  }
  
  .map-button:hover {
    background-color: #333 !important;
    text-decoration: none !important;
    transition: background-color 0.5s ease-in-out !important;
  }
  
  .footer { 
    text-align: center !important; 
    padding: 20px !important; 
    background-color: #111 !important;
    font-size: 12px !important; 
  }
  
  .footer p {
    color: #fff !important;
  }

  /* Additional mobile-specific fixes */
  @media only screen and (max-width: 600px) {
    .email-container {
      width: 100% !important;
      margin: 0 !important;
      border-radius: 0 !important;
    }
    
    .header {
      padding: 20px !important;
    }
    
    .content {
      padding: 10px !important;
    }
    
    .details-section,
    .location-section {
      margin: 10px 0 !important;
      padding: 12px !important;
    }
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
    <div class="title-section">
      <h1>Booking Confirmed</h1>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="details-section">
      <h3>Booking Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
      <p><strong>Duration:</strong> ${data.duration} hours</p>
      <p><strong>Engineering Services:</strong> ${data.engineeringIncluded ? "Included" : "Not included"}</p>
      <p><strong>Total Price:</strong> $${data.price}.00 CAD</p>
    </div>
    <div class="location-section">
      <h3>Studio Location:</h3>
      <p><strong>Address:</strong> ${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
      <a href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" class="map-button" target="_blank">Directions</a>
    </div>
    <div class="title-section">
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
    <div class="title-section">
      <h1>Membership Confirmed</h1>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="details-section">
      <h3>Membership Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Available Hours:</strong> ${data.availableHours} hours</p>
      <p><strong>Membership Fee:</strong> $${data.membershipPrice}.00 CAD</p>
      <p><strong>Billing Cycle:</strong> ${data.billingCycle}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Valid Through:</strong> ${data.validThrough}</p>
    </div>
    <div class="location-section">
      <h3>Studio Location:</h3>
      <p><strong>Address:</strong> ${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
      <a href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" class="map-button" target="_blank">Directions</a>
    </div>
    <div class="title-section">
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
    <div class="title-section">
      <h1>Membership Update</h1>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="details-section">
      <h3>Booking Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
      <p><strong>Hours Used:</strong> ${data.hoursUsed} hours</p>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
    </div>
    <div class="location-section">
      <h3>Membership Status:</h3>
      <p><strong>Remaining Hours:</strong> <span>${data.remainingHours} hours</span></p>
    </div>
    <div class="location-section">
      <h3>Studio Location:</h3>
      <p><strong>Address:</strong> ${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
      <a href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" class="map-button" target="_blank">Directions</a>
    </div>
    <div class="title-section">
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
    <div class="title-section">
      <h1>Session Reminder</h1>
      <p>Your studio session is tomorrow at ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
    </div>
    <div class="details-section">
      <h3>Session Details:</h3>
      <p><strong>Studio:</strong> ${data.studioName}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
      <p><strong>Duration:</strong> ${data.duration} hours</p>
      <p><strong>Engineering Services:</strong> ${data.engineeringIncluded ? "Included" : "Not included"}</p>
      <p><strong>Total Price:</strong> $${data.price}.00 CAD</p>
    </div>
    <div class="location-section">
      <h3>Studio Location:</h3>
      <p><strong>Address:</strong> ${EMAIL_CONSTANTS.STUDIO_ADDRESS}</p>
      <a href="${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}" class="map-button" target="_blank">Directions</a>
    </div>
    <div class="title-section">
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
    <div class="header">
      ${getLOGO_PNG()}
    </div>
    <div class="content">
      ${emailContent.content}
    </div>
    <div class="footer">
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
