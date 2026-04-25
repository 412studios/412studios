"use client";
import NavCollapse from "./NavCollapse";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/public/icons/logo";
import { usePathname } from "next/navigation";

import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface NavbarClientProps {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
}

export default function NavbarClient({ isAuthenticated, user, isAdmin }: NavbarClientProps) {
  const links = [
    { href: "#home", label: "HOME" },
    { href: "#about", label: "ABOUT" },
    { href: "#studios", label: "STUDIOS" },
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
      subNavElement.removeEventListener("transitionstart", handleTransitionStart);
      subNavElement.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-x-0 w-[calc(100%+1px)] box-border [&_*]:box-border">
      <nav id="main-nav" ref={navRef} className="bg-background">
        <div className="flex flex-col">
          {/* MAIN NAV */}
          <div className="border-b-0 flex justify-between items-stretch">
            <Link
              href="/"
              aria-label="Header Logo"
              className="p-4 md:p-8 flex items-center border-r hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300"
            >
              <Logo className="rounded-full bg-opacity-5 h-8 md:h-12 text-primary transition-all duration-300 ease-in-out" />
            </Link>
            <div
              ref={subNavRef}
              className="flex items-stretch ml-auto text-sm md:text-base font-bold uppercase [&>*]:border-l border-r"
            >
              {isHomepage &&
                links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="hidden xl:inline-flex items-center p-4 md:p-8 hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              {isAuthenticated ? (
                <button
                  id="menu-button"
                  onClick={handleMenuClick}
                  className="uppercase p-4 md:p-8 cursor-pointer hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300"
                >
                  {isOpen ? "CLOSE" : "MENU"}
                </button>
              ) : isOpen ? (
                <button
                  id="menu-button"
                  onClick={handleMenuClick}
                  className="uppercase p-4 md:p-8 cursor-pointer hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300"
                >
                  {isOpen ? "CLOSE" : "MENU"}
                </button>
              ) : (
                <>
                  <RegisterLink className="uppercase hidden xl:inline-flex items-center p-4 md:p-8 hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300">
                    Sign Up
                  </RegisterLink>
                  <LoginLink className="uppercase hidden xl:inline-flex items-center p-4 md:p-8 hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300">
                    Log In
                  </LoginLink>
                  <button
                    id="menu-button"
                    onClick={handleMenuClick}
                    className="uppercase xl:hidden p-4 md:p-8 cursor-pointer hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300"
                  >
                    {isOpen ? "CLOSE" : "MENU"}
                  </button>
                </>
              )}
            </div>
          </div>
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
