import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getPricing } from "@/app/lib/booking";
import Submit from "./submit";
import { H4, Section } from "@/components/ui/copy";

// Define a type for the price item
interface PriceItem {
  id: string;
  room: string;
  membershipPrice: number;
  img: string;
  blocked: boolean;
}

export default async function Page({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  // Await the params promise explicitly
  const resolvedParams = await params;
  const roomId = resolvedParams.room;

  let prices: PriceItem[] = [];
  try {
    prices = await getPricing();
  } catch (error) {
    console.error("Error fetching prices:", error);
  }

  // Find the selected room by matching the ID
  const selectedRoom = prices.find((price) => price.id === roomId);

  return (
    <Section>
      <H4>Memberships</H4>
      <div>
        {prices.length > 0 ? (
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
            {selectedRoom && (
              <div className="mt-4">
                <div className="relative">
                  <Image
                    src={`/images/${selectedRoom.img}`}
                    alt="banner"
                    height="6186"
                    width="9279"
                    className="rounded-xl w-full max-w-[600px] mx-auto"
                  />
                  {selectedRoom.blocked ? (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl w-full max-w-[600px] mx-auto">
                      <div className="text-white text-2xl font-bold">
                        Currently Unavailable
                      </div>
                    </div>
                  ) : null}
                </div>
                <h1 className="text-2xl font-bold tracking-tight mt-4">
                  Room {selectedRoom.room} Membership
                </h1>
                <p>Membership Price: ${selectedRoom.membershipPrice}.00</p>
                <p>Includes 4 X 4 hour sessions</p>
                {selectedRoom.blocked ? (
                  <Link href="/user/book">
                    <Button className="w-full mt-4">Return to Booking</Button>
                  </Link>
                ) : (
                  <Submit id={roomId} price={selectedRoom.membershipPrice} />
                )}
              </div>
            )}
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
    </Section>
  );
}
