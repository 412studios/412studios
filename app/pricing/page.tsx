import { prices } from "../booking/components/variables/prices";
import EquipmentList from "../booking/components/equipmentList";
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
import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let loggedIn = !!user;
  return (
    <div>
      <div className="p-2 pt-0">
        <p className="text-4xl font-bold text-gray-900">Pricing Options</p>
      </div>
      <div className="flex flex-col md:flex-row">
        {prices.map((element: any) => (
          <div className="w-full p-2" key={element.id}>
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
                  className="mx-auto rounded-sm"
                />
                <div className="mt-6">
                  <CardTitle className="mb-4">Hourly Pricing</CardTitle>
                  <CardDescription>
                    Daily Rate: {prices[element.id].dayRate}
                  </CardDescription>
                  <CardDescription>
                    Hourly Rate: {prices[element.id].hourlyRate}
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

                  <CardTitle className="my-4">Subscription Pricing</CardTitle>
                  <CardDescription>
                    Monthly subscription price:{" "}
                    {prices[element.id].subscription}
                  </CardDescription>
                  <CardDescription>
                    Includes four four-hour sessions every month.
                  </CardDescription>

                  <div className="mt-4">
                    {loggedIn ? (
                      <Link href={`/pricing/${element.id}`} className="w-full">
                        <Button className="w-full">
                          Purchase Subscription
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/api/auth/login?" className="w-full">
                        <Button className="w-full">
                          Sign in to Subsscribe
                        </Button>
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
        <div className="p-2">
          <p className="text-4xl font-bold text-gray-900">Equipment List</p>
        </div>
        <EquipmentList />
      </div>
    </div>
  );
}
