"use client";
import { Contact } from "@/components/custom/contact";
import { OurStudios } from "@/components/custom/ourStudios";
import { Banner } from "@/components/custom/banner/banner";
import { StudiosCarousel } from "@/components/custom/StudiosCarousel";
import { H2, Subtitle, Section, Divider } from "@/components/ui/copy";
export default function Home() {
  return (
    <>
      <Banner />
      <section id="studios" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left">STUDIOS</H2>
          <Subtitle className="italic mt-2 max-w-[900px]">
            Our fully equipped studios are designed for recording, production, and creative
            collaboration.
          </Subtitle>
        </div>
        <StudiosCarousel />
      </section>
      <Divider />
      <Section>
        <OurStudios />
      </Section>
      <Divider />
      <Section id="contact">
        <H2>CONTACT</H2>
        <Contact />
      </Section>
    </>
  );
}
