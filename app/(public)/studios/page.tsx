import EquipmentList from "@/app/components/equipmentList";
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
import { H2, H4, Subtitle, Section, Divider } from "@/components/ui/copy";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  let loggedIn = !!user;
  const prices = await getPricing();

  return (
    <>
      <Section>
        <H4 className="pb-4">Pricing Options</H4>
        <div className="flex flex-col md:flex-row gap-4">
          {prices.map((element: any) => (
            <div className="w-full" key={element.id}>
              <Card>
                <H4 className="p-4 pb-0">Studio {element.room}</H4>
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
                        <Link href="/user/book" className="w-full">
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
                      {prices[element.id].membershipPrice}
                    </CardDescription>
                    <CardDescription>
                      Includes 4 X 4 hour sessions (16 hours total) every month.
                    </CardDescription>

                    <div className="mt-4">
                      {loggedIn ? (
                        <Link
                          href={`/user/membership/${element.id}`}
                          className="w-full"
                        >
                          <Button className="w-full">
                            Purchase Membership
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/api/auth/login?" className="w-full">
                          <Button className="w-full">
                            Sign in to Purchase
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
          <H4>Equipment Details</H4>
          <EquipmentList />
        </div>
      </Section>
    </>
  );
}
