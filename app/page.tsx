"use client";
import { Contact } from "@/components/custom/contact";
import { OurStudios } from "@/components/custom/ourStudios";
import { Banner } from "@/components/custom/banner/banner";
import { StudiosCarousel } from "@/components/custom/StudiosCarousel";
import { H2, H3, Subtitle, Section, Divider } from "@/components/ui/copy";
export default function Home() {
  return (
    <>
      <Banner />
      <section id="pillars" className="border-t">
        <div className="w-full border-b p-4 md:p-8">
          <H2 className="text-left">CORE PILLARS</H2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div
            className="p-4 md:p-8 border-b md:border-b-0 md:border-r"
            style={{ backgroundColor: "#EF3F00", color: "#92D3FA" }}
          >
            <H3 style={{ color: "inherit" }}>Development</H3>
            <Subtitle className="italic mt-2" style={{ color: "#2C2C2C" }}>
              Structured artist &amp; producer development focused on long-term growth.
            </Subtitle>
          </div>
          <div
            className="p-4 md:p-8 border-b md:border-b-0 md:border-r"
            style={{ backgroundColor: "#8DC009", color: "#F0C600" }}
          >
            <H3 style={{ color: "inherit" }}>Studio</H3>
            <Subtitle className="italic mt-2" style={{ color: "#2C2C2C" }}>
              Professional recording environment built for creation and collaboration.
            </Subtitle>
          </div>
          <div className="p-4 md:p-8" style={{ backgroundColor: "#92D3FA", color: "#2C2C2C" }}>
            <H3 style={{ color: "inherit" }}>Community</H3>
            <Subtitle className="italic mt-2" style={{ color: "inherit" }}>
              A growing ecosystem supporting creative careers and cultural impact.
            </Subtitle>
          </div>
        </div>
      </section>
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
