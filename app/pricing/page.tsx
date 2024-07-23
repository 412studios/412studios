import EquipmentList from "../booking/components/equipmentList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getPricing } from "@/app/lib/booking";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let loggedIn = !!user;
  const prices = await getPricing();

  return (
    <div className="pt-8">
      <div className="pt-0 pb-4">
        <p className="text-4xl font-semibold leading-none tracking-wide text-primary">
          Pricing Options
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {prices.map((element: any) => (
          <div className="w-full" key={element.id}>
            <Card>
              <CardHeader>
                <CardTitle>Studio {element.room}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={`/images/${element.img}`}
                  alt={`Studio ${element.id}`}
                  width={1000}
                  height={9}
                  className="mx-auto rounded-xl"
                />
                <div className="mt-6">
                  <h3 className="text-2xl font-bold tracking-tight mb-4">
                    Hourly Pricing
                  </h3>
                  <CardDescription>
                    Daily Rate: ${prices[element.id].dayRate}.00
                  </CardDescription>
                  <CardDescription>
                    Hourly Rate: ${prices[element.id].hourlyRate}.00
                  </CardDescription>
                  <div className="mt-4">
                    {loggedIn ? (
                      <Link href="/booking" className="w-full">
                        <Button className="w-full">Book Time</Button>
                      </Link>
                    ) : (
                      <Link href="/api/auth/login?" className="w-full">
                        <Button className="w-full">Sign in to Book</Button>
                      </Link>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight my-4">
                    Membership Pricing
                  </h3>
                  <CardDescription>
                    Monthly membership Price: $
                    {prices[element.id].subscriptionPrice}
                  </CardDescription>
                  <CardDescription>
                    Includes 4 X 4 hour sessions (16 hours total) every month.
                  </CardDescription>

                  <div className="mt-4">
                    {loggedIn ? (
                      <Link href={`/pricing/${element.id}`} className="w-full">
                        <Button className="w-full">Purchase Membership</Button>
                      </Link>
                    ) : (
                      <Link href="/api/auth/login?" className="w-full">
                        <Button className="w-full">Sign in to Purchase</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="">
          <p className="text-4xl font-semibold leading-none tracking-wide text-primary mb-4">
            Equipment Details
          </p>
        </div>
        <EquipmentList />
      </div>
    </div>
  );
}
