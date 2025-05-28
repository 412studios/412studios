// Email template constants and configurations
export const EMAIL_CONSTANTS = {
  STUDIO_ADDRESS: "412 Richmond St E, Toronto, ON M5A 1P8",
  GOOGLE_MAPS_URL:
    "https://www.google.com/maps/dir/?api=1&destination=412+Richmond+St+E+Toronto+ON+M5A+1P8",
  SUPPORT_EMAIL: "alec@412studios.com",
  COMPANY_NAME: "412 Studios",
  WEBSITE_URL: "https://412studios.com",
};

// 412 Studios Logo SVG
const LOGO_SVG = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1372 373"
  style="height: 60px; width: auto;"
  fill="white"
>
  <g clipPath="url(#clip0_567_21)">
    <path d="M1185.5 373H186.482C83.6503 373 0 289.342 0 186.5C0 83.6583 83.6503 0 186.482 0H1185.5C1288.33 0 1371.98 83.6583 1371.98 186.5C1371.98 289.342 1288.33 373 1185.5 373ZM186.482 39.9719C105.69 39.9719 39.9529 105.715 39.9529 186.515C39.9529 267.315 105.69 333.059 186.482 333.059H1185.5C1266.29 333.059 1332.03 267.315 1332.03 186.515C1332.03 105.715 1266.29 39.9719 1185.5 39.9719H186.482Z" />
    <path d="M754.351 153.33C749.215 153.33 745.135 148.775 745.945 143.7C746.969 137.311 749.093 131.732 752.288 126.947C756.995 119.916 763.919 114.275 773.028 110.041C782.138 105.807 793.249 102.811 806.363 101.053C819.462 99.2955 834.409 98.4089 851.191 98.4089C856.785 98.4089 863.251 98.5771 870.618 98.8828C877.969 99.2038 885.566 99.9681 893.391 101.16C901.217 102.353 908.935 104.156 916.531 106.556C924.128 108.956 930.883 112.227 936.798 116.385C942.713 120.543 947.497 125.694 951.181 131.854C954.864 138.014 956.698 145.489 956.698 154.278C956.698 163.862 955.216 171.979 952.266 178.613C949.301 185.247 945.357 190.719 940.405 195.045C935.453 199.355 929.859 202.795 923.623 205.363C917.387 207.915 911.029 209.887 904.564 211.232C898.083 212.593 891.74 213.632 885.504 214.35C879.269 215.069 873.675 215.757 868.722 216.383C863.77 217.025 859.812 217.897 856.847 219.028C853.882 220.144 852.414 221.825 852.414 224.057H942.728C947.405 224.057 951.196 227.848 951.196 232.525V263.769C951.196 268.446 947.405 272.237 942.728 272.237H755.879C751.202 272.237 747.412 268.446 747.412 263.769V239.159C747.412 229.575 749.292 221.214 753.052 214.106C756.812 206.998 761.718 200.838 767.801 195.641C773.869 190.444 780.823 186.087 788.664 182.572C796.489 179.056 804.452 176.06 812.522 173.584C820.593 171.107 828.54 169.029 836.381 167.347C844.207 165.666 851.161 164.152 857.244 162.792C863.312 161.432 868.233 160.041 871.993 158.604C875.753 157.167 877.633 155.485 877.633 153.575C877.633 151.496 875.707 149.784 871.886 148.424C868.05 147.063 861.172 146.391 851.268 146.391C841.99 146.391 835.204 146.987 830.894 148.194C828.204 148.943 826.355 149.891 825.346 151.037C823.909 152.658 821.693 153.345 819.523 153.345H754.427L754.351 153.33Z" />
    <path d="M718.173 103.147H658.091C653.414 103.147 649.624 106.938 649.624 111.616V266.123C649.624 270.8 653.414 274.591 658.091 274.591H718.173C722.85 274.591 726.641 270.8 726.641 266.123V111.616C726.641 106.938 722.85 103.147 718.173 103.147Z" />
    <path d="M521.191 244.692H423.769C419.092 244.692 415.302 240.902 415.302 236.224V200.456C415.302 197.949 416.418 195.564 418.343 193.959L527.32 102.796C528.848 101.527 530.774 100.824 532.761 100.824H597.933C602.61 100.824 606.4 104.615 606.4 109.292V188.013C606.4 192.691 610.191 196.482 614.867 196.482H618.78C623.457 196.482 627.248 200.272 627.248 204.95V236.194C627.248 240.871 623.457 244.662 618.78 244.662H614.867C610.191 244.662 606.4 248.453 606.4 253.13V263.754C606.4 268.431 602.61 272.222 597.933 272.222H538.156C533.479 272.222 529.689 268.431 529.689 263.754V253.13C529.689 248.453 525.898 244.662 521.221 244.662L521.191 244.692Z" />
  </g>
  <defs>
    <clipPath id="clip0_567_21">
      <rect width="1372" height="373" />
    </clipPath>
  </defs>
</svg>
`;

// Base email styles
const BASE_STYLES = `
  body { 
    font-family: Helvetica; 
    line-height: 1.6; 
    color: #333; 
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }
  .email-container { 
    max-width: 600px; 
    margin: 0 auto; 
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header { 
    background-color: #222; 
    color: #fff; 
    padding: 30px; 
    display: flex;
    justify-content: center;
  }
  .header svg {
    heigh: 100%;
    max-heigth: 130px;
    width: auto;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 !important;
  }
  h3 {
    color: #333;
    font-size: 18px;
    font-weight: 700;
    margin: 0 !important;
  }
  p {
    font-size: 14px;
    margin: 0 !important;
  }
  strong {
    font-weight: 700;
  }
  .content { 
    padding: 15px; 
  }
  .title-section {
    text-align: center;
  }
  .details-section { 
    background-color: #f9f9f9; 
    padding: 15px; 
    margin: 15px 0; 
    border-radius: 12px;
    border: 1px solid black;
  }  
  .location-section { 
    background-color: #f9f9f9; 
    padding: 15px; 
    margin: 15px 0; 
    border-radius: 12px;
    border: 1px solid black;
  }
  .map-button { 
    display: inline-block; 
    background-color: #111;
    color: #f9f9f9; 
    padding: 1px 45px; 
    text-decoration: none; 
    border-radius: 30px; 
    margin-top: 10px;
    font-weight: bold;
    font-size: 14px;
  }
  .map-button:hover {
    background-color: #333;
    text-decoration: none;
    transition: background-color 0.5s ease-in-out;
    color: white !important;
  }
  .footer { 
    text-align: center; 
    padding: 20px; 
    background-color: #111;
    font-size: 12px; 
    color: #fff; 
  }
`;

// Email types
export type EmailType =
  | "booking-confirmation"
  | "membership-confirmation"
  | "membership-usage";

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
      <p>For additional information, please contact us at<br /> <a href="mailto:${EMAIL_CONSTANTS.SUPPORT_EMAIL}">${EMAIL_CONSTANTS.SUPPORT_EMAIL}</a>.</p>
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
Address: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

For additional information, please contact us at ${EMAIL_CONSTANTS.SUPPORT_EMAIL}.
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
      <p>Your membership is now active. You can book studio time using your membership hours through your account.</p>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
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
Address: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

Your membership is now active. You can book studio time using your membership hours through your account.
Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!
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
      <p>Your membership is now active. You can book studio time using your membership hours through your account.</p>
      <p>Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!</p>
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
Address: ${EMAIL_CONSTANTS.GOOGLE_MAPS_URL}

Your membership is now active. You can book studio time using your membership hours through your account.
Thank you for choosing ${EMAIL_CONSTANTS.COMPANY_NAME}!
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
    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailContent.title}</title>
  <style>
    ${BASE_STYLES}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      ${LOGO_SVG}
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
