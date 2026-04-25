"use client";
import { Contact } from "@/components/custom/contact";
import { Banner } from "@/components/custom/banner/banner";
import { StudiosCarousel } from "@/components/custom/StudiosCarousel";
import { ArtistRoster } from "@/components/custom/ArtistRoster";
import { H2, Subtitle } from "@/components/ui/copy";
export default function Home() {
  return (
    <>
      <Banner />
      <section id="studios" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left">OUR STUDIOS</H2>
          <Subtitle className="italic mt-2 max-w-[900px]">
            Our fully equipped studios are designed for recording, production, and creative
            collaboration.
          </Subtitle>
        </div>
        <StudiosCarousel />
      </section>
      <section id="artists" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left">ARTISTS</H2>
        </div>
        <ArtistRoster />
      </section>
      <section id="contact" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left">CONTACT</H2>
        </div>
        <Contact />
      </section>
    </>
  );
}
