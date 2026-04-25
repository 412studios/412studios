"use client";
import Link from "next/link";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface NavCollapseProps {
  isAuthenticated: boolean;
  isOpen: boolean;
  navHeight: number;
  isTransitioning: boolean;
  handleMenuClick: () => void;
  links?: Array<{ href: string; label: string }>;
  isAdmin?: boolean;
}

function scrollToHash(href: string, navHeight: number) {
  if (!href.startsWith("#")) return false;
  const target = document.getElementById(href.slice(1));
  if (!target) return false;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: "smooth" });
  if (history.replaceState) history.replaceState(null, "", href);
  return true;
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
  const itemClass =
    "flex items-center w-full p-8 text-base font-bold uppercase border-b hover:bg-[#FFD60A] hover:no-underline transition-colors duration-300";

  return (
    <div
      className={`z-50 absolute right-0 transition-all duration-300 ease-in-out overflow-hidden border-t bg-background ${
        isOpen ? "w-full sm:w-72 sm:border-l border-r" : "w-0"
      }`}
      style={{
        top: `${navHeight}px`,
        height: `calc(100vh - ${navHeight}px)`,
        transitionDelay: isTransitioning ? "0.1s" : "0s",
      }}
    >
      <div className="flex flex-col relative">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => {
              if (scrollToHash(link.href, navHeight)) e.preventDefault();
              handleMenuClick();
            }}
            className={`xl:hidden ${itemClass}`}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <>
            <Link href="/booking" onClick={handleMenuClick} className={itemClass}>
              BOOK NOW
            </Link>
            <Link href="/user/profile" onClick={handleMenuClick} className={itemClass}>
              PROFILE
            </Link>
            {isAdmin && (
              <Link href="/user/admin" onClick={handleMenuClick} className={itemClass}>
                ADMIN
              </Link>
            )}
            <LogoutLink className={itemClass}>LOG OUT</LogoutLink>
          </>
        ) : (
          <>
            <LoginLink className={itemClass}>SIGN IN</LoginLink>
          </>
        )}
      </div>
    </div>
  );
}
