"use client";
import { Contact } from "@/components/custom/contact";
import { Banner } from "@/components/custom/banner/banner";
import { StudiosCarousel } from "@/components/custom/StudiosCarousel";
import { ArtistRoster } from "@/components/custom/ArtistRoster";
import { OurOrigin } from "@/components/custom/OurOrigin";
import { H2, Subtitle } from "@/components/ui/copy";
export default function Home() {
  return (
    <>
      <Banner />
      <section id="studios" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <div className="py-24">
            <H2 className="text-left">OUR STUDIOS</H2>
            <Subtitle className="italic mt-2 max-w-[900px]">
              Our fully equipped studios are designed for recording, production, and creative
              collaboration.
            </Subtitle>
          </div>
        </div>
        <StudiosCarousel />
      </section>
      <section id="artists" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left py-24">ARTISTS</H2>
        </div>
        <ArtistRoster />
      </section>
      <section id="origin" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left py-24">OUR ORIGIN</H2>
        </div>
        <OurOrigin />
      </section>
      <section id="contact" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left py-24">CONTACT</H2>
        </div>
        <Contact />
      </section>
    </>
  );
}
