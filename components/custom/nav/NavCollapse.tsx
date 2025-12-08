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
  isAdmin?: boolean;
}

export default function NavCollapse({
  isAuthenticated,
  isOpen,
  navHeight,
  isTransitioning,
  handleMenuClick,
  links = [],
  isAdmin = false,
}: NavCollapseProps) {
  return (
    <div
      className={`z-50 absolute right-0 transition-all duration-300 ease-in-out overflow-hidden border-t bg-background/30 backdrop-blur-md ${
        isOpen ? "w-full sm:w-72 sm:border-l" : "w-0"
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
            <Link href="/booking">
              <Button variant="nav" size="sm">
                BOOK NOW
              </Button>
            </Link>
            <Link href="/user/profile">
              <Button variant="nav" size="sm">
                PROFILE
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/user/admin">
                <Button variant="nav" size="sm">
                  ADMIN
                </Button>
              </Link>
            )}
            <LogoutLink>
              <Button variant="nav" size="sm">
                LOG OUT
              </Button>
            </LogoutLink>
          </>
        ) : (
          <>
            <RegisterLink>
              <Button variant="nav" size="sm">
                SIGN UP
              </Button>
            </RegisterLink>
            <LoginLink>
              <Button variant="nav" size="sm">
                LOG IN
              </Button>
            </LoginLink>
          </>
        )}
        <div className="flex sm:hidden flex-col gap-2 mt-2">
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
