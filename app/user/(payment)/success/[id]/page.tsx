import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { 
  sendBookingConfirmationEmail, 
  sendMembershipUsageEmail, 
  sendMembershipConfirmationEmail,
  RESEND_API_KEY, 
  RESEND_FROM_EMAIL 
} from "@/app/lib/email";

export default async function PageSuccess({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  // Await the params promise explicitly
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Direct test of email sending to verify configuration
  try {
    console.log("Testing email integration...");
    console.log("API Key:", RESEND_API_KEY ? "Present" : "Missing");
    console.log("From Email:", RESEND_FROM_EMAIL);
    
    if (!RESEND_API_KEY) {
      console.error("Skipping email test - RESEND_API_KEY is missing");
    } else {
      // Use Resend's test email address as required by their API
      const testEmail = "delivered@resend.dev"; // This is Resend's approved test email
      
      // We're using the unified email function
      const testResult = await sendBookingConfirmationEmail(
        testEmail,
        {
          studioName: "Test Studio",
          date: new Date().toDateString(),
          startTime: "10:00 AM",
          endTime: "12:00 PM",
          duration: 2,
          price: 0, // Test email
          engineeringIncluded: false
        }
      );
      
      console.log("Test email result:", testResult);
    }
  } catch (emailTestError) {
    console.error("Error testing email integration:", emailTestError);
    if (emailTestError instanceof Error) {
      console.error("Error details:", emailTestError.message);
    }
  }

  //HANDLE STANDARD BOOKING CONFIMATION
  const successfulBooking = await prisma.bookings.findUnique({
    where: {
      bookingId: id,
    },
    include: {
      user: true,
    },
  });

  if (successfulBooking) {
    if (successfulBooking.engineerTotal > -1) {
      await prisma.bookings.update({
        where: {
          bookingId: id,
        },
        data: {
          status: "success",
          engineerStatus: "success",
        },
      });
    } else {
      await prisma.bookings.update({
        where: {
          bookingId: id,
        },
        data: {
          status: "success",
          engineerStatus: "cancelled",
        },
      });
    }

    const duration =
      successfulBooking.endTime + 1 - successfulBooking.startTime;

    //Update membership details
    const membershipUpdateResult = await prisma.memberships.updateMany({
      where: {
        userId: successfulBooking.userId,
        roomId: successfulBooking.roomId,
      },
      data: {
        availableHours: {
          decrement: duration,
        },
      },
    });
    
    // If membership hours were decremented, send notification email
    if (membershipUpdateResult.count > 0) {
      try {
        console.log("Membership hours were decremented, fetching details for email notification");
        
        // Get updated membership info to get remaining hours
        const updatedMembership = await prisma.memberships.findFirst({
          where: {
            userId: successfulBooking.userId,
            roomId: successfulBooking.roomId,
          },
          select: {
            availableHours: true,
            roomId: true,
          },
        });
        
        if (updatedMembership && successfulBooking.user?.email) {
          // Get studio info
          const studioInfo = await prisma.pricing.findFirst({
            where: {
              id: successfulBooking.roomId.toString(),
            },
            select: {
              room: true,
            },
          });
          
          // Format date for the email
          const bookingDate = new Date(
            Math.floor(successfulBooking.date / 10000),
            (Math.floor(successfulBooking.date % 10000) / 100) - 1,
            successfulBooking.date % 100
          ).toDateString();
          
          // Format time slots with fallback if import fails
          let startTimeStr = `${successfulBooking.startTime}:00`;
          let endTimeStr = `${successfulBooking.endTime + 1}:00`;
          
          try {
            // Try to get formatted time slots
            const { timeSlots } = await import("@/app/user/(payment)/book/components/timeSlots");
            startTimeStr = timeSlots[successfulBooking.startTime]?.displayStart || startTimeStr;
            endTimeStr = timeSlots[successfulBooking.endTime]?.displayEnd || endTimeStr;
          } catch (timeSlotError) {
            console.error("Failed to import timeSlots for usage email, using default format:", timeSlotError);
          }
          
          // Send membership hours usage email
          console.log("Sending membership hours usage email to:", successfulBooking.user.email);
          
          await sendMembershipUsageEmail(
            successfulBooking.user.email,
            {
              studioName: `Studio ${studioInfo?.room || successfulBooking.roomId}`,
              date: bookingDate,
              startTime: startTimeStr,
              endTime: endTimeStr,
              hoursUsed: duration,
              remainingHours: updatedMembership.availableHours,
              bookingId: successfulBooking.bookingId
            }
          );
          
          console.log("Membership hours usage email sent successfully");
        }
      } catch (usageEmailError) {
        console.error("Failed to send membership hours usage email:", usageEmailError);
        // Don't block the rest of the process if email fails
      }
    }

    // Send email confirmation for booking
    try {
      console.log("Starting booking email process...");
      
      // Get studio info
      console.log("Fetching studio info for roomId:", successfulBooking.roomId);
      const studioInfo = await prisma.pricing.findFirst({
        where: {
          id: successfulBooking.roomId.toString(),
        },
        select: {
          room: true,
        },
      });
      console.log("Studio info fetched:", studioInfo);

      // Format date for the email
      console.log("Formatting date from:", successfulBooking.date);
      const bookingDate = new Date(
        Math.floor(successfulBooking.date / 10000),
        (Math.floor(successfulBooking.date % 10000) / 100) - 1,
        successfulBooking.date % 100
      ).toDateString();
      console.log("Formatted date:", bookingDate);
      
      // Format time slots with fallback if import fails
      let startTimeStr = `${successfulBooking.startTime}:00`;
      let endTimeStr = `${successfulBooking.endTime + 1}:00`;
      console.log("Initial time strings:", { startTimeStr, endTimeStr });
      
      try {
        // Try to get formatted time slots from the timeSlots file
        console.log("Importing timeSlots...");
        const { timeSlots } = await import("@/app/user/(payment)/book/components/timeSlots");
        console.log("TimeSlots imported successfully");
        startTimeStr = timeSlots[successfulBooking.startTime]?.displayStart || startTimeStr;
        endTimeStr = timeSlots[successfulBooking.endTime]?.displayEnd || endTimeStr;
        console.log("Formatted time strings:", { startTimeStr, endTimeStr });
      } catch (timeSlotError) {
        console.error("Failed to import timeSlots, using default time format:", timeSlotError);
        // Continue with the default time format
      }
      
      // Send email to the user
      if (successfulBooking.user?.email) {
        console.log("Starting to send booking confirmation email to:", successfulBooking.user.email);
        console.log("Email data:", {
          studioName: `Studio ${studioInfo?.room || successfulBooking.roomId}`,
          date: bookingDate,
          startTime: startTimeStr,
          endTime: endTimeStr,
          duration: duration,
          price: successfulBooking.totalPrice,
          engineeringIncluded: successfulBooking.engineerTotal > 0
        });
        
        const result = await sendBookingConfirmationEmail(
          successfulBooking.user.email,
          {
            studioName: `Studio ${studioInfo?.room || successfulBooking.roomId}`,
            date: bookingDate,
            startTime: startTimeStr,
            endTime: endTimeStr,
            duration: duration,
            price: successfulBooking.totalPrice,
            engineeringIncluded: successfulBooking.engineerTotal > 0,
          }
        );
        console.log("Email send result:", result);
        console.log(`Booking confirmation email sent to ${successfulBooking.user.email}`);
      } else {
        console.warn("No user email found for booking confirmation");
      }
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
      // Continue with the function even if email fails
    }
  }

  // HANDLE CONFIRMING MEMBERSHIP + RETRIEVING ID FOR CANCELLING
  const successfulMembership = await prisma.memberships.findUnique({
    where: {
      membershipId: id,
    },
    include: {
      user: true,
    },
  });

  //Set membership as active when membership is purchased
  if (successfulMembership) {
    const now = new Date();
    // First day of the current month
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const formattedFirstDayOfMonth = `${firstDayOfMonth.getFullYear()}${String(
      firstDayOfMonth.getMonth() + 1
    ).padStart(2, "0")}01`;
    // First day of the next month
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    const formattedFirstDayOfNextMonth = `${firstDayOfNextMonth.getFullYear()}${String(
      firstDayOfNextMonth.getMonth() + 1
    ).padStart(2, "0")}01`;

    await prisma.memberships.update({
      where: {
        membershipId: id,
      },
      data: {
        status: "active",
        currentPeriodStart: parseInt(formattedFirstDayOfMonth),
        currentPeriodEnd: parseInt(formattedFirstDayOfNextMonth),
      },
    });
    
    // Send email confirmation for membership
    try {
      console.log("Starting membership email process...");
      
      // Get studio info
      console.log("Fetching studio info for membership roomId:", successfulMembership.roomId);
      const studioInfo = await prisma.pricing.findFirst({
        where: {
          id: successfulMembership.roomId.toString(),
        },
        select: {
          room: true,
          membershipPrice: true,
        },
      });
      console.log("Membership studio info fetched:", studioInfo);
      
      // Send membership confirmation email if user has email
      if (successfulMembership.user?.email) {
        console.log("Starting to send membership confirmation email to:", successfulMembership.user.email);
        console.log("Membership email data:", {
          studioName: `Studio ${studioInfo?.room || successfulMembership.roomId}`,
          availableHours: successfulMembership.availableHours,
          membershipPrice: studioInfo?.membershipPrice || 0,
          billingCycle: successfulMembership.interval,
          status: successfulMembership.status,
          validThrough: firstDayOfNextMonth.toLocaleDateString()
        });
        
        try {
          // Using the sendMembershipConfirmationEmail function from our unified email module
          console.log("Using sendMembershipConfirmationEmail from email module...");
          
          // Send membership confirmation email
          console.log("Calling sendMembershipConfirmationEmail...");
          const result = await sendMembershipConfirmationEmail(
            successfulMembership.user.email,
            {
              studioName: `Studio ${studioInfo?.room || successfulMembership.roomId}`,
              availableHours: successfulMembership.availableHours,
              membershipPrice: studioInfo?.membershipPrice || 0,
              billingCycle: successfulMembership.interval,
              status: successfulMembership.status,
              validThrough: firstDayOfNextMonth.toLocaleDateString()
            }
          );
          console.log("Membership email send result:", result);
          console.log(`Membership confirmation email sent to ${successfulMembership.user.email}`);
        } catch (importError) {
          console.error("Error in membership email function import or execution:", importError);
        }
      } else {
        console.warn("No user email found for membership confirmation");
      }
    } catch (error) {
      console.error("Failed to send membership confirmation email:", error);
      // Continue with the function even if email fails
    }
  }

  return (
    <>
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Card className="w-[350px]">
          <div className="p-6">
            <div className="flex w-full justify-center">
              <Check className="h-12 w-12 rounded-full bg-green-500/30 p-2 text-green-500" />
            </div>
            <div className="mt-3 w-full text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6">
                Payment Successful
              </h3>
              <div className="mt-5 w-full sm:mt-6">
                <Button className="w-full" asChild>
                  <Link href="/user/profile">Go to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
