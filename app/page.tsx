"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Services } from "@/app/components/servicesCarousel";
import { Contact } from "@/app/components/contact";
import { OurStudios } from "@/app/components/ourStudios";
import { Banner } from "@/app/components/banner";
import { useUser } from "./components/UserContext";
import { ChevronLast } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Gradient } from "@/components/ui/gradient";

export default function Home() {
  const { isAuthenticated, user } = useUser();

  return (
    <main id="home">
      {/* <Gradient /> */}
      <Banner />

      <section className="mt-8" id="about">
        <Card>
          <CardHeader>
            <CardTitle>About 412 Studios</CardTitle>
          </CardHeader>
          <CardContent className="max-w-[900px]">
            Formerly known as the “House of Balloons”, our studio carries a rich
            legacy of musical innovation. Today, we proudly continue that
            tradition as 412 Studios, providing a dynamic space for artists to
            explore, create and collaborate.
          </CardContent>
        </Card>
      </section>
      <OurStudios auth={isAuthenticated} />
      <Services />
      <Contact />
    </main>
  );
}
