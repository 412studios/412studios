import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { prices } from "../../../prices";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { getStripeSession } from "@/app/lib/stripe";
import { unstable_noStore as noStore } from "next/cache";

import { Button } from "@/components/ui/button";

export default async function ConfirmBookingPage(context: any) {
  noStore();

  //Format Date and Time
  let duration = 0;
  let price = 0;

  const numericToDate = (numericDate: string): string => {
    if (numericDate.length !== 8) return "";

    const year = numericDate.substring(0, 4);
    const month = parseInt(numericDate.substring(4, 6), 10) - 1;
    const day = numericDate.substring(6, 8);

    const date = new Date(parseInt(year), month, parseInt(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const convertTimeRange = (timeRange: string): string => {
    if (timeRange.length !== 4) return "";
    const startTimeHour = parseInt(timeRange.substring(0, 2), 10);
    let endTimeHour = parseInt(timeRange.substring(2, 4), 10) + 1;
    duration = endTimeHour - startTimeHour;
    if (duration >= 16) {
      price = prices[context.params.room - 1].dayRate;
    } else {
      price = duration * prices[context.params.room - 1].hourlyRate;
    }
    const formatHour = (hour: number): string => {
      if (hour === 24) {
        return "12 AM";
      }
      const isAM = hour < 12 || hour === 24;
      let formattedHour = hour % 12;
      formattedHour = formattedHour === 0 ? 12 : formattedHour;
      return `${formattedHour} ${isAM ? "AM" : "PM"}`;
    };
    return `${formatHour(startTimeHour)} to ${formatHour(endTimeHour)}`;
  };

  const displaydDate = numericToDate(context.params.date);
  const displayTime = convertTimeRange(context.params.time);

  const startTime = context.params.time.toString().substring(0, 2);
  const endTime = context.params.time.toString().substring(2);

  //Find rate
  let bookingType = "";
  let numUnites = duration;
  if (duration <= 15) {
    bookingType = "hour";
  } else {
    bookingType = "day";
    numUnites = 1;
  }

  async function onSubmit(formData: FormData) {
    "use server";
    noStore();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const roomId = parseInt(formData.get("roomVal") as string);
    const date = parseInt(formData.get("dateVal") as string);
    const rate = formData.get("rateVal") as string;
    const startTime = parseInt(formData.get("startTimeVal") as string) - 8;
    const endTime = parseInt(formData.get("endTimeVal") as string) - 8;

    let priceId: string = "";
    if (roomId == 1) {
      if (rate == "hour") {
        priceId = process.env.STRIPE_PRICE_ID_ROOM_A_HOUR as string;
      } else {
        priceId = process.env.STRIPE_PRICE_ID_ROOM_A_DAY as string;
      }
    } else if (roomId == 2) {
      if (rate == "hour") {
        priceId = process.env.STRIPE_PRICE_ID_ROOM_B_HOUR as string;
      } else {
        priceId = process.env.STRIPE_PRICE_ID_ROOM_B_DAY as string;
      }
    } else {
      if (rate == "hour") {
        priceId = process.env.STRIPE_PRICE_ID_ROOM_C_HOUR as string;
      } else {
        priceId = process.env.STRIPE_PRICE_ID_ROOM_C_DAY as string;
      }
    }

    //HANDLE DB UPDATE
    const bookingId: any = require("crypto").randomBytes(16).toString("hex");
    await prisma.bookings.create({
      data: {
        bookingId: bookingId,
        roomId: roomId,
        date: date,
        type: rate,
        startTime: startTime,
        endTime: endTime,
        userId: user?.id || "",
        status: "pending",
        stripeProductId: priceId,
        totalHours: duration,
        totalPrice: price,
      },
    });

    //SEND TO STRIPE
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Unable to get customer id");
    }
    const subscriptionUrl = await getStripeSession({
      customerId: dbUser.stripeCustomerId,
      domainUrl:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000",
      priceId: priceId,
      quantity: numUnites,
      mode: "payment",
      bookingId: bookingId,
    });

    return redirect(subscriptionUrl);
  }

  return (
    <main className="p-8">
      <div className="mx-auto mb-8 max-w-screen-md">
        <Link href={`/booking/${context.params.room}/${context.params.date}`}>
          <Button>Back</Button>
        </Link>
      </div>
      <form action={onSubmit}>
        <Card className="mx-auto max-w-screen-md">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold dark:text-white">
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-2xl font-bold dark:text-white">
              Studio {prices[context.params.room - 1].room}
            </h3>
            <ul className="mt-4 max-w-md list-inside list-none space-y-1 text-gray-500 dark:text-gray-400">
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Date:
                </span>
                {displaydDate}
              </li>
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Time:
                </span>
                {displayTime}
              </li>
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Total hours:
                </span>
                {duration}
              </li>
              <li>
                <span className="mb-2 mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Total price:
                </span>
                ${price}.00 CAD
              </li>
            </ul>
            <Input
              name="roomVal"
              id="roomVal"
              value={context.params.room}
              type="hidden"
            />
            <Input
              name="dateVal"
              id="dateVal"
              value={context.params.date}
              type="hidden"
            />
            <Input
              name="startTimeVal"
              id="startTimeVal"
              value={startTime}
              type="hidden"
            />
            <Input
              name="endTimeVal"
              id="endTimeVal"
              value={endTime}
              type="hidden"
            />
            <Input
              name="rateVal"
              id="rateVal"
              value={bookingType}
              type="hidden"
            />
          </CardContent>
          <CardFooter>
            <Button>Proceed to Payment</Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
