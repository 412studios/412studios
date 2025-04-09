import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getPricing } from "@/app/lib/booking";
import Submit from "./submit";
import { H4, Section } from "@/components/ui/copy";

export default async function Page(context: any) {
  let prices;
  try {
    prices = await getPricing();
  } catch (error) {
    console.error("Error fetching prices:", error);
  }

  return (
    <Section>
      <H4>Memberships</H4>
      <div>
        {prices ? (
          <>
            <div className="w-full flex gap-2">
              {prices.map((price) => (
                <div className="w-full" key={price.id}>
                  <Link href={`/user/membership/${price.id}`}>
                    <Button className="w-full">Room {price.room}</Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="relative">
                <Image
                  src={`/images/${prices[context.params.room].img}`}
                  alt="banner"
                  height="6186"
                  width="9279"
                  className="rounded-xl w-full max-w-[600px] mx-auto"
                />
                {prices[context.params.room].blocked ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl w-full max-w-[600px] mx-auto">
                    <div className="text-white text-2xl font-bold">
                      Currently Unavailable
                    </div>
                  </div>
                ) : null}
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-4">
                Room {prices[context.params.room].room} Membership
              </h1>
              <p>
                Membership Price: $
                {prices[context.params.room].subscriptionPrice}.00
              </p>
              <p>Includes 4 X 4 hour sessions</p>
              {prices[context.params.room].blocked ? (
                <Link href="/user/book">
                  <Button className="w-full mt-4">Return to Booking</Button>
                </Link>
              ) : (
                <Submit
                  id={context.params.room}
                  price={prices[context.params.room].subscriptionPrice}
                />
              )}
            </div>
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
    </Section>
  );
}
