import Link from "next/link";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";
import {
  sendBookingConfirmationEmail,
  sendMembershipConfirmationEmail,
  sendMembershipUsageEmail,
} from "@/app/lib/email";
import { revalidatePath } from "next/cache";

import {
  Settings,
  CreditCard,
  Shield,
  Book,
  Plus,
  Notebook,
  RefreshCw,
  Mail,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    revalidatePath("/user/admin");
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
    revalidatePath("/user/admin");
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
    revalidatePath("/user/admin");
  } catch (error) {
    console.error("Failed to send test usage email:", error);
  }
}

export default async function Main() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userDetails = await getUserDetails(user?.id as string);
  // deletePendingmembership();
  return (
    <Section>
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <div className="px-4">
          <Link href="/user/admin/pricing">
            <Button>
              <span>Update Pricing</span>
            </Button>
          </Link>
        </div>
        <CardContent className="p-0">
          <div className="p-4">
            <Link href="/user/admin/users">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Book className="text-primary mr-2 h-4 w-4" />
                <span>Users</span>
              </span>
            </Link>
            <Link href="/user/admin/membership">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Book className="text-primary mr-2 h-4 w-4" />
                <span>Memberships</span>
              </span>
            </Link>
            <Link href="/user/admin/book/">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Book className="text-primary mr-2 h-4 w-4" />
                <span>Bookings</span>
              </span>
            </Link>
            <Link href="/user/admin/email-template">
              <span className="hover:bg-accent hover:text-accent-forground group flex items-center rounded-md px-3 py-2 text-sm font-medium">
                <Mail className="text-primary mr-2 h-4 w-4" />
                <span>Email Template</span>
              </span>
            </Link>
            {/* Email Testing Section */}
            <div className="border rounded-xl py-4 px-4 mt-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Mail className="text-primary mr-2 h-4 w-4" />
                Email Testing
              </h3>
              <div className="space-y-2">
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
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Test emails will be sent to: {userDetails?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
