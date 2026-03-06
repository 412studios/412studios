"use client";
import { Contact } from "@/components/custom/contact";
import { OurStudios } from "@/components/custom/ourStudios";
import { Banner } from "@/components/custom/banner/banner";
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
          412 is an independent record label and studio based in Toronto, Canada.
        </Subtitle>
      </Section>
      <Divider />
      <Section id="studios">
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
