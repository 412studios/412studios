import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateBookingConfirmationEmail } from "@/lib/emailTemplates";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

import { Mail } from "lucide-react";

import {
  sendBookingConfirmationEmail,
  sendMembershipConfirmationEmail,
  sendMembershipUsageEmail,
  sendBookingReminderEmail,
} from "@/lib/email";

async function getUserDetails(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });
  return data;
}

async function sendTestBookingEmail(formData: FormData) {
  "use server";
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);

  if (!userDetails?.email) {
    console.error("User email not found");
    return;
  }

  try {
    const result = await sendBookingConfirmationEmail(userDetails.email, {
      studioName: "Studio A",
      date: new Date().toDateString(),
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      duration: 3,
      price: 150,
      engineeringIncluded: true,
    });

    console.log("Test booking email sent:", result);
    revalidatePath("/user/admin/email-template");
  } catch (error) {
    console.error("Failed to send test booking email:", error);
  }
}

async function sendTestMembershipEmail(formData: FormData) {
  "use server";

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);

  if (!userDetails?.email) {
    console.error("User email not found");
    return;
  }

  try {
    const result = await sendMembershipConfirmationEmail(userDetails.email, {
      studioName: "Studio B",
      availableHours: 20,
      membershipPrice: 200,
      billingCycle: "monthly",
      status: "active",
      validThrough: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
    });

    console.log("Test membership email sent:", result);
    revalidatePath("/user/admin/email-template");
  } catch (error) {
    console.error("Failed to send test membership email:", error);
  }
}

async function sendTestUsageEmail(formData: FormData) {
  "use server";

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);

  if (!userDetails?.email) {
    console.error("User email not found");
    return;
  }

  try {
    const result = await sendMembershipUsageEmail(userDetails.email, {
      studioName: "Studio C",
      date: new Date().toDateString(),
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      hoursUsed: 2,
      remainingHours: 18,
      bookingId: "test-booking-123",
    });
    console.log("Test usage email sent:", result);
    revalidatePath("/user/admin/email-template");
  } catch (error) {
    console.error("Failed to send test usage email:", error);
  }
}

async function sendTestReminderEmail(formData: FormData) {
  "use server";

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);

  if (!userDetails?.email) {
    console.error("User email not found");
    return;
  }

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await sendBookingReminderEmail(userDetails.email, {
      studioName: "Studio A",
      date: tomorrow.toDateString(),
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      duration: 3,
      price: 150,
      engineeringIncluded: true,
    });
    console.log("Test reminder email sent:", result);
    revalidatePath("/user/admin/email-template");
  } catch (error) {
    console.error("Failed to send test reminder email:", error);
  }
}

export default async function EmailTemplate() {
  // Get user details for display
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);

  const bookingDetails = {
    studioName: "Studio A",
    date: "Mon Dec 25 2023",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    duration: 3,
    price: 150,
    engineeringIncluded: true,
  };

  const emailHTML = generateBookingConfirmationEmail(bookingDetails);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="w-full max-w-[600px] mx-auto flex justify-end">
        <Link href="/user/admin">
          <Button>Back</Button>
        </Link>
      </div>
      {/* display email */}
      <div dangerouslySetInnerHTML={{ __html: emailHTML }} />
      {/* display email */}
      <div className="border rounded-xl py-4 px-4 w-full max-w-[600px] mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Mail className="text-primary mr-2 h-5 w-5" />
            Email Testing
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          <form action={sendTestBookingEmail}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Test Booking Email
            </Button>
          </form>
          <form action={sendTestMembershipEmail}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Test Membership Email
            </Button>
          </form>
          <form action={sendTestUsageEmail}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Test Usage Email
            </Button>
          </form>
          <form action={sendTestReminderEmail}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Test Reminder Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
