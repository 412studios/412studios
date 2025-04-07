"use client";
import { Services } from "@/app/components/servicesCarousel";
import { Contact } from "@/app/components/contact";
import { OurStudios } from "@/app/components/ourStudios";
import { Banner } from "@/app/components/banner";
import { useUser } from "./components/UserContext";
import { H2, Subtitle, Section, Divider } from "@/components/ui/copy";

export default function Home() {
  const { isAuthenticated, user } = useUser();
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
