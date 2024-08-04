import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export function Banner() {
  return (
    <section className="w-full overflow-hidden rounded-xl">
      <div className="w-full relative overflow-hidden aspect-video">
        <Image
          src="/images/studio-a.jpg"
          alt="banner"
          height="6186"
          width="9279"
        />
      </div>
    </section>
    // <section className="w-full border-4"></section>
  );
}
