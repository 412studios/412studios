"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

interface NavCollapseProps {
  isAuthenticated: boolean;
  isOpen: boolean;
  navHeight: number;
  isTransitioning: boolean;
  handleMenuClick: () => void;
  links?: Array<{ href: string; label: string }>;
}

export default function NavCollapse({
  isAuthenticated,
  isOpen,
  navHeight,
  isTransitioning,
  handleMenuClick,
  links = [],
}: NavCollapseProps) {
  return (
    <div
      className={`z-50 fixed right-0 transition-all duration-300 ease-in-out bg-background/30 backdrop-blur-md ${
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
    </div>
  );
}
