import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Logo } from "@/public/icons/logo";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="bg-none flex max-h-[130px]">
      <div className="max-w-screen-xl w-full border-4 border-t-0 mx-auto rounded-b-xl overflow-hidden">
        <div className="w-full p-1 px-2 border-b-4 bg-secondary">
          <div className="relative flex overflow-x-hidden w-full marquee-container">
            <div className="animate-marquee whitespace-nowrap marquee-item">
              <span className="mx-4">
                <Link
                  href="https://www.instagram.com/itsfouronetwo/"
                  target="_blank"
                  className="hover:underline"
                >
                  Instagram - itsfouronetwo
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://www.facebook.com/fouronetwostudios/"
                  target="_blank"
                  className="hover:underline"
                >
                  Facebook - fouronetwostudios
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
                  target="_blank"
                  className="hover:underline"
                >
                  Youtube - The412Show
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://www.tiktok.com/@412.studios"
                  target="_blank"
                  className="hover:underline"
                >
                  TikTok - 412.studios
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://twitter.com/The412Show"
                  target="_blank"
                  className="hover:underline"
                >
                  Twitter - The412Show
                </Link>
              </span>
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap marquee-item">
              <span className="mx-4">
                <Link
                  href="https://www.instagram.com/itsfouronetwo/"
                  target="_blank"
                  className="hover:underline"
                >
                  Instagram - itsfouronetwo
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://www.facebook.com/fouronetwostudios/"
                  target="_blank"
                  className="hover:underline"
                >
                  Facebook - fouronetwostudios
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
                  target="_blank"
                  className="hover:underline"
                >
                  Youtube - The412Show
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://www.tiktok.com/@412.studios"
                  target="_blank"
                  className="hover:underline"
                >
                  TikTok - 412.studios
                </Link>
              </span>
              <span className="mx-4">
                <Link
                  href="https://twitter.com/The412Show"
                  target="_blank"
                  className="hover:underline"
                >
                  Twitter - The412Show
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="p-2 border-b-4 flex justify-between bg-background">
          <div className="flex items-center">
            <Link href="/" aria-label="Header Logo">
              <Logo className="max-h-[40px] text-primary hover:text-secondary transition duration-300 ease-in-out" />
            </Link>
          </div>
          <div className="flex-1 text-right">
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
        <div className="flex overflow-hidden pt-1 bg-background">
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
