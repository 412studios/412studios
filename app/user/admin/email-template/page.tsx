import { generateBookingConfirmationEmail } from "@/app/lib/emailTemplates";

export default function EmailTemplate() {
  const bookingDetails = {
    studioName: "Studio A",
    date: new Date().toDateString(),
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    duration: 3,
    price: 150,
    engineeringIncluded: true,
  };

  const emailHTML = generateBookingConfirmationEmail(bookingDetails);

  return (
    <div className="p-8">
      <div dangerouslySetInnerHTML={{ __html: emailHTML }} />
    </div>
  );
}
