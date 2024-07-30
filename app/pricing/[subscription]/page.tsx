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
import { getPricing } from "@/app/lib/booking";
import Submit from "./submit";

export default async function Page(context: any) {
  let prices;
  try {
    prices = await getPricing();
  } catch (error) {
    console.error("Error fetching prices:", error);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex w-full justify-between">
          <CardTitle>Memberships</CardTitle>
          <span className="flex-end">
            <Link href="/pricing/" className="mr-2">
              <Button>Back</Button>
            </Link>
          </span>
        </CardHeader>
        <CardContent>
          {prices ? (
            <>
              <div className="w-full flex gap-2">
                {prices.map((price) => (
                  <div className="w-full" key={price.id}>
                    <Link href={`/pricing/${price.id}`}>
                      <Button className="w-full">Room {price.room}</Button>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Image
                  src={`/images/${prices[context.params.subscription].img}`}
                  alt="banner"
                  height="6186"
                  width="9279"
                  className="rounded-xl w-full max-w-[600px] mx-auto"
                />
                <h1 className="text-2xl font-bold tracking-tight mt-4">
                  Room {prices[context.params.subscription].room} Membership
                </h1>
                <p>
                  Membership Price: $
                  {prices[context.params.subscription].subscriptionPrice}.00
                </p>
                <p>Includes 4 X 4 hour sessions</p>
                <Submit
                  id={context.params.subscription}
                  price={prices[context.params.subscription].subscriptionPrice}
                />
              </div>
            </>
          ) : (
            <>Loading...</>
          )}
        </CardContent>
      </Card>
    </>
  );
}
