"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/public/icons/logo";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

import NavCollapse from "@/app/components/NavCollapse";

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

interface NavbarClientProps {
  isAuthenticated: boolean;
  user: any;
}

export default function NavbarClient({
  isAuthenticated,
  user,
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
    <header className="fixed top-0 z-50 w-full">
      <nav
        id="main-nav"
        ref={navRef}
        className="bg-background/30 backdrop-blur-md relative"
      >
        <div className="flex flex-col">
          {/* MAIN NAV */}
          <div className="p-1 border-b flex justify-between items-center">
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
          {/* SUB NAV */}
          {isHomepage ? (
            <>
              <div
                id="sub-nav"
                ref={subNavRef}
                className="flex items-start gap-2 text-[12px] font-normal overflow-hidden p-1 border-b"
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

          {/* COLLAPSIBLE MENU */}
          {/* <div
            className={`fixed right-0 bg-background/30 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${
              isOpen ? "w-full sm:w-72 border-l" : "w-0"
            }`}
            style={{
              top: `${navHeight}px`,
              height: `calc(100vh - ${navHeight}px)`,
              transitionDelay: isTransitioning ? "0.1s" : "0s",
            }}
          >
            <div className="flex flex-col p-2 gap-1 relative">
              {isAuthenticated ? (
                <>
                  <Link href="/user/book">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start px-2 border-[1px]"
                    >
                      BOOK NOW
                    </Button>
                  </Link>
                  <Link href="/user/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start px-2 border-[1px]"
                    >
                      PROFILE
                    </Button>
                  </Link>
                  <LogoutLink>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start px-2 border-[1px]"
                    >
                      LOG OUT
                    </Button>
                  </LogoutLink>
                </>
              ) : (
                <>
                  <RegisterLink>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start px-2 border-[1px]"
                    >
                      SIGN UP
                    </Button>
                  </RegisterLink>
                  <LoginLink>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start px-2 border-[1px]"
                    >
                      LOG IN
                    </Button>
                  </LoginLink>
                </>
              )}
              <div className="flex sm:hidden flex-col">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start px-2"
                      onClick={handleMenuClick}
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </nav>
      <NavCollapse
        isAuthenticated={isAuthenticated}
        isOpen={isOpen}
        navHeight={navHeight}
        isTransitioning={isTransitioning}
        handleMenuClick={handleMenuClick}
        links={links}
      />
    </header>
  );
}
