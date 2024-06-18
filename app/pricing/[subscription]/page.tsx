"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { PostSubscription, CheckAvailability } from "@/app/lib/booking";

export default function Page(context: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [userHasSub, setUserHasSub] = useState(false);
  const [options, setOptions] = useState({
    room: parseInt(context.params.subscription),
    date: new Date(),
  });

  const prices = context.prices;

  const submit = async () => {
    setIsLoading(true);
    try {
      await PostSubscription(
        options,
        parseInt(
          prices[context.params.subscription].subscriptionPrice.toString() +
            "00",
        ),
      );
    } catch (error) {
      console.error("Failed to post booking:", error);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      const data = await CheckAvailability(context.params.subscription);
      setUserHasSub(data[1] >= 1);
      setIsAvailable(data[0] <= 25);
      setIsLoading(false);
    };
    fetchAvailability();
  }, [context.params.subscription]);

  return (
    <main className="container">
      <div className="mx-auto flex max-w-screen-lg">
        <div className="m-2 w-full">
          <Link href="/pricing/0" className="w-full">
            <Button className="w-full">Room A</Button>
          </Link>
        </div>
        <div className="m-2 w-full">
          <Link href="/pricing/1" className="w-full">
            <Button className="w-full">Room B</Button>
          </Link>
        </div>
        <div className="m-2 w-full">
          <Link href="/pricing/2" className="w-full">
            <Button className="w-full">Room C</Button>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-screen-lg p-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Room {prices[context.params.subscription].room} Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={`/images/${prices[context.params.subscription].img}`}
              alt={`Studio ${prices[context.params.subscription].id}`}
              width={1000}
              height={9}
              className="mx-auto mb-8 w-full max-w-screen-md rounded-lg"
            />
            <CardDescription>
              Monthly Membership price:{" "}
              {prices[context.params.subscription].subscriptionPrice}.00
            </CardDescription>
            <CardDescription>
              Includes four X four sessions every month.
            </CardDescription>
          </CardContent>
          <CardFooter>
            {userHasSub == false ? (
              <div className="w-full">
                {isAvailable ? (
                  <Button
                    onClick={submit}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Redirecting..." : "Proceed to Payment"}
                  </Button>
                ) : (
                  <div
                    className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 w-full text-center"
                    role="alert"
                  >
                    <span className="block sm:inline">
                      Due to high demand subscriptions to this room are
                      unavailable.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/dashboard" className="w-full">
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Review / Cancel Subscription"}
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
