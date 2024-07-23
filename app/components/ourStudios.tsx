import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel3,
  Carousel3Content,
  Carousel3Item,
  Carousel3Previous,
  Carousel3Next,
} from "@/components/ui/carousel3";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function OurStudios(auth: any) {
  const studios = [
    {
      name: "A",
      image: "/images/studio-a.jpg",
    },
    {
      name: "B",
      image: "/images/studio-b.jpg",
    },
    {
      name: "C",
      image: "/images/studio-c.jpg",
    },
  ];

  return (
    <>
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Studios</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b-4">
              <p>
                A state-of-the-art recording space equipped with modern
                acoustics.
              </p>
            </div>
            {/* DESKTOP ONLY */}
            <div className="hidden lg:block">
              <div className="flex">
                {studios.map((studio, index) => (
                  <div
                    key={index}
                    className="w-full border-r-4 last:border-r-0"
                  >
                    <h3 className="text-2xl font-bold tracking-tight p-4">
                      Studio {studio.name}
                    </h3>
                    <div className="border-b-4 border-t-4 w-full overflow-hidden aspect-video">
                      <Image
                        src={studio.image}
                        alt={studio.name}
                        height="6186"
                        width="9279"
                      />
                    </div>
                    <div className="p-4">
                      <>
                        {auth ? (
                          <Link href="/booking" className="w-full">
                            <Button className="w-full">Book Now</Button>
                          </Link>
                        ) : (
                          <LoginLink className="w-full">
                            <Button className="w-full">Book Now</Button>
                          </LoginLink>
                        )}
                      </>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MOBILE ONLY */}
            <div className="block lg:hidden">
              <Carousel className="w-full p-2 py-4">
                <CarouselContent className="border-0">
                  {studios.map((studio, index) => (
                    <CarouselItem key={index}>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight p-4 pt-0 text-center">
                          Studio {studio.name}
                        </h3>
                        <Card className="w-full">
                          <CardContent className="p-0 rounded-[8px] flex items-center justify-center w-full overflow-hidden">
                            <Image
                              src={studio.image}
                              alt={studio.name}
                              height="6186"
                              width="9279"
                              className="w-full"
                            />
                          </CardContent>
                        </Card>
                        <Link href="/booking" className="w-full">
                          <Button className="mt-4 w-full">Book Now</Button>
                        </Link>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-3" />
                <CarouselNext className="mr-3" />
              </Carousel>
            </div>
          </CardContent>
          <CardFooter className="p-0">
            <Link href="/pricing" className="w-full rounded-none">
              <Button variant="ghost" className="w-full rounded-none">
                Pricing Options
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
