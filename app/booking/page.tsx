import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Page() {
  return (
    <main className="p-8">
      <div className="mx-auto max-w-3xl pb-12 text-center">
        <h1 className="tracking-light mt-8 text-3xl font-extrabold lg:text-6xl">
          Available Studios
        </h1>
      </div>
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
              <Link href="/booking/1" passHref className="w-full">
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
              <Link href="/booking/2" passHref className="w-full">
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
              <Link href="/booking/3" passHref className="w-full">
                <Button className="w-full">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl p-2">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <div className="m-2 w-full">
                <div className="mb-4 rounded-lg border p-2">
                  <h2 className="mb-2 text-xl font-bold">PREAMPS</h2>
                  <ul className="list-disc pl-5">
                    <li>AMS Neve 1073DPA</li>
                    <li>API 512</li>
                    <li>Great River ME-INV</li>
                  </ul>
                </div>
                <div className="mb-4 rounded-lg border p-2">
                  <h2 className="mb-2 text-xl font-bold">COMPRESSOR</h2>
                  <ul className="list-disc pl-5">
                    <li>Tube Tech - CL1B</li>
                    <li>UA 1176LN</li>
                  </ul>
                </div>
                <div className="mb-4 rounded-lg border p-2">
                  <h2 className="mb-2 text-xl font-bold">EQ</h2>
                  <ul className="list-disc pl-5">
                    <li>Pultec EQP-1A</li>
                  </ul>
                </div>
                <div className="mb-4 rounded-lg border p-2">
                  <h2 className="mb-2 text-xl font-bold">
                    SYNTHS AND KEYBOARDS
                  </h2>
                  <ul className="list-disc pl-5">
                    <li>Prophet 05</li>
                    <li>Prophet 06</li>
                    <li>Prophet OB6</li>
                    <li>Prophet 08</li>
                    <li>Prophet 12</li>
                    <li>Prophet Rev 2</li>
                    <li>Prophet X</li>
                    <li>Juno 106</li>
                    <li>Fender Rhodes</li>
                    <li>Moog Minitaur</li>
                  </ul>
                </div>
              </div>
              <div className="m-2 w-full">
                <div className="mb-4 rounded-lg border p-2">
                  <h2 className="mb-2 text-xl font-bold">GUITARS</h2>
                  <ul className="list-disc pl-5">
                    <li>Fender Vintage Stratocaster</li>
                    <li>Fender P Bass</li>
                    <li>Acoustic guitar</li>
                    <li>Nylon strings</li>
                  </ul>
                </div>
                <div className="mb-4 rounded-lg border p-2">
                  <h2 className="mb-2 text-xl font-bold">MICS</h2>
                  <ul className="list-disc pl-5">
                    <li>2 * AKG 414</li>
                    <li>1 * Telefunken TF51</li>
                    <li>1 * SM7B</li>
                    <li>1 * Neumann U87</li>
                    <li>1 * Neumann TLM103</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
