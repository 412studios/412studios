import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  return (
    <main className="container">
      <section className="bg-background mt-12 rounded-xl">
        <div className="h-auto">
          <Carousel>
            <CarouselContent>
              <CarouselItem className="border-none">
                <Image
                  src="/images/studio-a.jpg"
                  alt="Studio 1"
                  width={4000}
                  height={9}
                  className="mx-auto rounded-3xl"
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src="/images/studio-b.jpg"
                  alt="Studio 1"
                  width={4000}
                  height={9}
                  className="mx-auto rounded-3xl"
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src="/images/studio-c.jpg"
                  alt="Studio 1"
                  width={4000}
                  height={9}
                  className="mx-auto rounded-3xl"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="" />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="px-4 py-16">
        <p className="mb-5 text-5xl font-bold">412 Studios</p>
        <p className="mb-5 text-2xl italic text-neutral-500 dark:text-neutral-400">
          A professional recording studio and a vibrant incubator for artistic
          expression.
        </p>
        <p>
          <Link href="/pricing">
            <Button>Book Now</Button>
          </Link>
        </p>
      </section>

      <section className="">
        <div className="mx-auto flex max-w-screen-xl flex-col md:flex-row">
          <div className="w-full p-2">
            <Card>
              <CardHeader>
                <CardTitle>Studio A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  <Image
                    src="/images/studio-a.jpg"
                    alt="Studio 1"
                    width={1000}
                    height={9}
                    className="mx-auto rounded-sm"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/pricing" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="w-full p-2">
            <Card>
              <CardHeader>
                <CardTitle>Studio B</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  <Image
                    src="/images/studio-b.jpg"
                    alt="Studio 1"
                    width={1000}
                    height={9}
                    className="mx-auto rounded-sm"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/pricing" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="w-full p-2">
            <Card>
              <CardHeader>
                <CardTitle>Studio C</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  <Image
                    src="/images/studio-c.jpg"
                    alt="Studio 1"
                    width={1000}
                    height={9}
                    className="mx-auto rounded-sm"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/pricing" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <section className="p-4 py-24">
        <p className="p-8 text-center text-2xl italic text-neutral-500 dark:text-neutral-400">
          Follow us on{" "}
          <a
            href="https://www.instagram.com/itsfouronetwo/"
            className="text-primary"
          >
            Instagram
          </a>{" "}
          to keep up with the latest news and behind-the-scenes content.
        </p>
      </section>
    </main>
  );
}
