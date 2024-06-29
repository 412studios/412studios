import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Logo } from "@/public/icons/logo";

import { CircleUser } from "lucide-react";

import { Marquee } from "./marquee";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="bg-none flex max-h-[130px]">
      <div className="max-w-screen-xl w-full border-4 border-t-0 mx-auto rounded-b-xl overflow-hidden">
        <Marquee />

        <div className="p-2 border-b-4 flex justify-between bg-background">
          <div className="flex items-center">
            <Link href="/" aria-label="Header Logo">
              <Logo className="h-[40px] text-primary fill-primary hover:text-secondary hover:fill-secondary transition duration-300 ease-in-out" />
            </Link>
          </div>
          <div className="flex-1 text-right">
            <div className="block lg:hidden">
              {(await isAuthenticated()) ? (
                // <UserNav name={user?.given_name as string} />
                <>
                  <Link href="/dashboard" aria-label="View Profile Button">
                    <Button variant="ghost">
                      <CircleUser />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <LoginLink className="">
                    <Button className="" variant="secondary">
                      Sign In
                    </Button>
                  </LoginLink>
                </>
              )}
            </div>

            <div className="hidden lg:block">
              {(await isAuthenticated()) ? (
                // <UserNav name={user?.given_name as string} />
                <>
                  <Link href="/booking" className="mr-2">
                    <Button variant="secondary">Book Now</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button>View Profile</Button>
                  </Link>
                </>
              ) : (
                <>
                  <LoginLink className="mr-2">
                    <Button className="mr-1" variant="secondary">
                      Sign Up
                    </Button>
                  </LoginLink>
                  <RegisterLink>
                    <Button>Log In</Button>
                  </RegisterLink>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden bg-background">
          <Link
            href="/"
            className="hover:text-primary-foreground transition duration-300 px-2"
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="hover:text-primary-foreground transition duration-300 px-2"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="hover:text-primary-foreground transition duration-300 px-2"
          >
            Contact
          </Link>
        </div>
      </div>
      {/* <div className="container flex items-center justify-between">
        <Link href="/" className="" aria-label="Home">
          <Logo className="text-foreground max-h-[60px]" />
        </Link>
        <div className="flex items-center gap-x-5">
          {(await isAuthenticated()) ? (
            <UserNav name={user?.given_name as string} />
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Book Now</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant="secondary">Sign In</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div> */}
    </nav>
  );
}
