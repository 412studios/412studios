"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Services } from "@/app/components/servicesCarousel";

import { useUser } from "./components/UserContext";

export default function Home() {
  const { isAuthenticated, user } = useUser();

  return (
    <main className="max-w-screen-xl mx-auto" id="home">
      <section
        className="h-[100vh] w-full mt-[15px] relative pb-[15px] overflow-hidden"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="bg-[url('/images/studio-a.jpg')] bg-cover bg-center h-full w-fill rounded-xl relative">
          <div className="absolute bottom-0 left-0 w-1/2 bg-white bg-opacity-50 rounded-tr-[100px]">
            <div className="p-4 py-8">
              <h1 className="banner-title text-6xl text-primary mb-4">
                412 Studios
              </h1>

              <div>
                {isAuthenticated ? (
                  <Link href="/booking">
                    <Button>Book Now</Button>
                  </Link>
                ) : (
                  <LoginLink>
                    <Button>Book Now</Button>
                  </LoginLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4" id="about">
        <Card>
          <CardHeader>
            <CardTitle>About 412 Studios</CardTitle>
          </CardHeader>
          <CardContent className="max-w-[900px]">
            Formerly known as “House of Balloons”, our studio carries a rich
            legacy of musical innovation. Today, we proudly continue that
            tradition as 412 Studios, providing a dynamic space for artists to
            explore, create and collaborate.
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Studios</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div>
                <h3 className="font-forma text-primary text-2xl leading-normal tracking-wide font-semibold p-4 pb-3">
                  Studio A
                </h3>
                <div className="border-b-4 border-t-4 w-full h-64 bg-[url('/images/studio-a.jpg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <p className="mb-4">
                    A state-of-the-art recording space equipped with modern
                    acoustics.
                  </p>
                  <>
                    {isAuthenticated ? (
                      <Link href="/booking">
                        <Button>Book Now</Button>
                      </Link>
                    ) : (
                      <LoginLink>
                        <Button>Book Now</Button>
                      </LoginLink>
                    )}
                  </>
                </div>
              </div>
              <div className="border-l-0 border-r-0 border-t-4 border-b-4 lg:border-l-4 lg:border-r-4 lg:border-t-0 lg:border-b-0">
                <h3 className="font-forma text-primary text-2xl leading-normal tracking-wide font-semibold p-4 pb-3">
                  Studio A
                </h3>
                <div className="border-b-4 border-t-4 w-full h-64 bg-[url('/images/studio-a.jpg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <p className="mb-4">
                    A state-of-the-art recording space equipped with modern
                    acoustics.
                  </p>
                  <>
                    {isAuthenticated ? (
                      <Link href="/booking">
                        <Button>Book Now</Button>
                      </Link>
                    ) : (
                      <LoginLink>
                        <Button>Book Now</Button>
                      </LoginLink>
                    )}
                  </>
                </div>
              </div>
              <div>
                <h3 className="font-forma text-primary text-2xl leading-normal tracking-wide font-semibold p-4 pb-3">
                  Studio A
                </h3>
                <div className="border-b-4 border-t-4 w-full h-64 bg-[url('/images/studio-a.jpg')] bg-cover bg-center"></div>
                <div className="p-4">
                  <p className="mb-4">
                    A state-of-the-art recording space equipped with modern
                    acoustics.
                  </p>
                  <>
                    {isAuthenticated ? (
                      <Link href="/booking">
                        <Button>Book Now</Button>
                      </Link>
                    ) : (
                      <LoginLink>
                        <Button>Book Now</Button>
                      </LoginLink>
                    )}
                  </>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-0">
            <Link href="/pricing" className="w-full rounded-none">
              <Button variant="ghost" className="w-full rounded-none">
                View Memberships
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

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
                <div className="w-full bg-primary text-background p-4 md:pt-8 pt-6 text-2xl">
                  412 Richmond St E,
                  <br />
                  Toronto, ON M5A 1P8
                </div>
              </div>
              <div className="border p-4 bg-background">
                <CardTitle className="text-primary">Contact</CardTitle>
                <div className="flex-col mt-4">
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

                <CardTitle className="text-primary mt-6 mb-2">
                  Social Links
                </CardTitle>

                <div className="w-full mt-4">
                  <div className="flex">
                    <div className="flex flex-col pr-4">
                      <span>Instagram</span>
                      <span>Facebook</span>
                      <span>YouTube</span>
                      <span>TikTok</span>
                      <span>Twitter</span>
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
                          href="https://www.facebook.com/fouronetwostudios/"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          fouronetwostudios
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
                          href="https://www.tiktok.com/@412.studios"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @412.studios
                        </a>
                      </span>
                      <span>
                        <a
                          href="https://twitter.com/The412Show"
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
