"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Services } from "@/app/components/servicesCarousel";
import { OurStudios } from "@/app/components/ourStudios";
import { useUser } from "./components/UserContext";
import { ChevronLast } from "lucide-react";
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

export default function Home() {
  const { isAuthenticated, user } = useUser();

  return (
    <main className="max-w-screen-xl mx-auto" id="home">
      {/* BANNER */}
      <section className="w-full mt-[15px] relative pb-[15px] overflow-hidden">
        <div className="w-full rounded-xl relative overflow-hidden aspect-video">
          <Image
            src="/images/studio-a.jpg"
            alt="banner"
            height="6186"
            width="9279"
          />
        </div>
      </section>

      <section className="mt-4" id="about">
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

      <section className="mt-8" id="contact">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-primary">
              <div className="border border-r-0 md:border-r-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.714871065601!2d-79.36956282382845!3d43.65410025237262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cba62e560a91%3A0xced444965ac2e5b7!2s412%20Studios!5e0!3m2!1sen!2sca!4v1719351835573!5m2!1sen!2sca"
                  width="100%"
                  height="300"
                  className="border-0"
                  loading="lazy"
                ></iframe>
                <div className="w-full bg-primary text-background p-4 text-2xl">
                  412 Richmond St E,
                  <br />
                  Toronto, ON M5A 1P8
                </div>
              </div>
              <div className="border p-4 bg-background">
                <h3 className="text-2xl font-bold tracking-tight">Contact</h3>
                <div className="flex-col">
                  <div>
                    <p className="text-xl text-primary">Email</p>
                    <p>
                      <a
                        href="mailto:Info@412studios.ca"
                        className="text-primary hover:underline"
                      >
                        Info@412studios.ca
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-xl text-primary mt-2">Phone</p>
                    <p>
                      <a
                        href="tel:647-540-2321"
                        className="text-primary hover:underline"
                      >
                        647-540-2321
                      </a>
                    </p>
                  </div>
                </div>

                <div className="w-full border-b-4 border-dashed pt-4"></div>

                <h3 className="text-2xl font-bold tracking-tight pt-4">
                  Social Links
                </h3>

                <div className="w-full">
                  <div className="flex">
                    <div className="flex flex-col pr-4">
                      <span>Instagram</span>
                      <span>YouTube</span>
                      <span>TikTok</span>
                      <span>Soundcloud</span>
                    </div>
                    <div className="w-1/2 flex flex-col">
                      <span>
                        <a
                          href="https://www.instagram.com/itsfouronetwo/"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          itsfouronetwo
                        </a>
                      </span>
                      <span>
                        <a
                          href="https://www.tiktok.com/@412.studios"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          412.studios
                        </a>
                      </span>
                      <span>
                        <a
                          href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          The412Show
                        </a>
                      </span>
                      <span>
                        <a
                          href="https://soundcloud.com/412studios"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          412studios
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
