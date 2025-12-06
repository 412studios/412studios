"use client";
import { Services } from "@/components/custom/servicesCarousel";
import { Contact } from "@/components/custom/contact";
import { OurStudios } from "@/components/custom/ourStudios";
import { Banner } from "@/components/custom/banner";
import { H2, Subtitle, Section, Divider } from "@/components/ui/copy";
export default function Home() {
  return (
    <>
      <Banner />
      <Section id="about">
        <H2>
          ABOUT <span className="desk-only hl">THE STUDIO</span>
        </H2>
        <Divider className="max-w-[1000px] my-2"></Divider>
        <Subtitle className="max-w-[900px]">
          Formerly known as the “House of Balloons”, our studio carries a rich
          legacy of musical innovation. Today, we proudly continue that
          tradition as 412 Studios, providing a dynamic space for artists to
          explore, create and collaborate.
        </Subtitle>
      </Section>
      <Divider />
      <Section id="studios">
        <OurStudios />
      </Section>
      <Divider />
      <Section id="services">
        <Services />
      </Section>
      <Divider />
      <Section id="contact">
        <H2>CONTACT</H2>
        <Contact />
      </Section>
    </>
  );
}
