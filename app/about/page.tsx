import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
export default async function Main() {
  return (
    <main className="container">
      <section className="pt-16">
        <div className="px-4">
          <Image
            src="/images/studio-a.jpg"
            alt="Studio 1"
            width={4000}
            height={9}
            className="mx-auto rounded-sm"
          />
        </div>
      </section>
      <section className="px-4 py-16">
        <p className="mb-5 text-5xl font-bold">412 Studios</p>
        <p className="mb-5 text-2xl italic text-neutral-500 dark:text-neutral-400">
          A professional recording studio and a vibrant incubator for artistic
          expression.
        </p>
        <p>
          <LoginLink>
            <Button>Book Now</Button>
          </LoginLink>
        </p>
      </section>
    </main>
  );
}
