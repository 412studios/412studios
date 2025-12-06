"use client";
import NavCollapse from "./NavCollapse";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/public/icons/logo";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

interface NavbarClientProps {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
}

export default function NavbarClient({
  isAuthenticated,
  user,
  isAdmin,
}: NavbarClientProps) {
  const links = [
    { href: "#home", label: "HOME" },
    { href: "#about", label: "ABOUT" },
    { href: "#studios", label: "STUDIOS" },
    { href: "#services", label: "SERVICES" },
    { href: "#contact", label: "CONTACT" },
  ];

  const navRef = useRef<HTMLElement | null>(null);
  const subNavRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathname = usePathname();
  const isHomepage = usePathname() === "/";

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu when URL changes
  useEffect(() => {
    setIsOpen(false);
    // Update nav height when pathname changes
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);

    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    // Initial height measurement
    updateNavHeight();

    // Listen for resize events
    window.addEventListener("resize", updateNavHeight);

    return () => {
      window.removeEventListener("resize", updateNavHeight);
    };
  }, []);

  // Handle the transition of the sub-nav
  useEffect(() => {
    if (!subNavRef.current) return;

    const handleTransitionStart = () => {
      setIsTransitioning(true);
    };

    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      // Update nav height after transition completes
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    const subNavElement = subNavRef.current;
    subNavElement.addEventListener("transitionstart", handleTransitionStart);
    subNavElement.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      subNavElement.removeEventListener(
        "transitionstart",
        handleTransitionStart
      );
      subNavElement.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-x-0 w-[calc(100%+1px)] border-r">
      <nav
        id="main-nav"
        ref={navRef}
        className="bg-background/30 backdrop-blur-md"
      >
        <div className="flex flex-col">
          {/* MAIN NAV */}
          <div
            className={`p-1 border-b-0 flex justify-between items-center ${
              isHomepage ? "md:border-b" : "md:border-b-0"
            }`}
          >
            <Link href="/" aria-label="Header Logo">
              <Logo className="rounded-full bg-stone-50 bg-opacity-5 h-6 text-primary hover:text-secondary hover:fill-secondary transition-all duration-300 ease-in-out" />
            </Link>
            <div>
              {isAuthenticated ? (
                <>
                  <Button
                    id="menu-button"
                    variant="ghost"
                    size="sm"
                    onClick={handleMenuClick}
                  >
                    {isOpen ? "CLOSE" : "MENU"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="hidden sm:flex">
                    {isOpen ? (
                      <>
                        <Button
                          id="menu-button"
                          variant="ghost"
                          size="sm"
                          onClick={handleMenuClick}
                        >
                          {isOpen ? "CLOSE" : "MENU"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <RegisterLink className="mr-2">
                          <Button variant="ghost" size="sm">
                            Sign Up
                          </Button>
                        </RegisterLink>
                        <LoginLink>
                          <Button variant="ghost" size="sm">
                            Log In
                          </Button>
                        </LoginLink>
                      </>
                    )}
                  </div>
                  <div className="flex sm:hidden">
                    <Button
                      id="menu-button"
                      variant="ghost"
                      size="sm"
                      onClick={handleMenuClick}
                    >
                      {isOpen ? "CLOSE" : "MENU"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Membership NAV */}
          {isHomepage ? (
            <>
              <div
                ref={subNavRef}
                className="hidden md:flex items-start gap-2 text-[12px] font-normal overflow-hidden p-1"
              >
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenu}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </nav>
      <NavCollapse
        isAuthenticated={isAuthenticated}
        isOpen={isOpen}
        navHeight={navHeight}
        isTransitioning={isTransitioning}
        handleMenuClick={handleMenuClick}
        links={isHomepage ? links : []}
        isAdmin={isAdmin}
      />
    </header>
  );
}
