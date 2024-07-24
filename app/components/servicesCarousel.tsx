import {
  Carousel3,
  Carousel3Content,
  Carousel3Item,
  Carousel3Previous,
  Carousel3Next,
} from "@/components/ui/carousel3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Services() {
  const services = [
    {
      title: "Studio Rental",
      description: "Hourly and monthly rentals are available.",
    },
    {
      title: "Production",
      description: "Professional production services for your projects.",
    },
    {
      title: "Mixing and Mastering",
      description:
        "Expert mixing and mastering services to perfect your sound.",
    },
    {
      title: "Post Production",
      description: "High-quality post-production services.",
    },
    {
      title: "Photography Videography",
      description:
        "Creative photography and videography services for various needs.",
    },
  ];

  return (
    <>
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Services</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div
              className="
            h-full
            bg-background
            bg-[linear-gradient(to_right,#263238_4px,transparent_4px),linear-gradient(to_bottom,#263238_4px,transparent_1px)]
            bg-[position:-4px_0,0_-4px]
            bg-[size:20px_100px]
            rounded-bl-[8px] rounded-br-[8px]
            "
            >
              <div className="h-full">
                <Carousel3 className="h-full mx-8">
                  <Carousel3Content>
                    {services.map((service, index) => (
                      <Carousel3Item key={index}>
                        <div className="p-4 h-full">
                          <Card>
                            <div className="flex items-center justify-left p-6 h-64 bg-primary text-background font-forma md:text-4xl text-xl font-semibold leading-8 font-forma tracking-wide">
                              <h2 className="text-center lg:text-left w-full">
                                {service.title}
                              </h2>
                            </div>
                            <div className="flex items-center justify-left p-6 h-32">
                              {service.description}
                            </div>
                          </Card>
                        </div>
                      </Carousel3Item>
                    ))}
                  </Carousel3Content>
                  <Carousel3Previous />
                  <Carousel3Next />
                </Carousel3>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
