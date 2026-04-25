"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/public/icons/logo";
import { FaTiktok, FaInstagram, FaYoutube, FaSoundcloud } from "react-icons/fa";

const socials = [
  {
    label: "itsfouronetwo",
    href: "https://www.instagram.com/itsfouronetwo/",
    icon: <FaInstagram className="w-5 h-5" />,
  },
  {
    label: "412.studios",
    href: "https://www.tiktok.com/@412.studios",
    icon: <FaTiktok className="w-5 h-5" />,
  },
  {
    label: "The412Show",
    href: "https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  {
    label: "412studios",
    href: "https://soundcloud.com/412studios",
    icon: <FaSoundcloud className="w-5 h-5" />,
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="w-full border-b border-background/20 p-4 md:p-8 flex items-center justify-between">
        <Link href="#home" aria-label="412 Studios">
          <Logo className="h-8 md:h-12 text-background hover:text-[#A8C8E8] transition-colors duration-300" />
        </Link>
        <p className="font-bold uppercase text-xs md:text-sm tracking-wider">
          412 Studios &middot; Toronto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-4 md:p-8 border-b md:border-b-0 md:border-r border-background/20 flex flex-col gap-3">
          <h3 className="font-bold uppercase text-base md:text-lg tracking-wider">Follow</h3>
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center gap-2 px-3 py-2 border border-background/20 hover:bg-[#A8C8E8] hover:text-black transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  {s.icon}
                  <span>{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 md:p-8 border-b md:border-b-0 md:border-r border-background/20 flex flex-col gap-3">
          <h3 className="font-bold uppercase text-base md:text-lg tracking-wider">Contact</h3>
          <Link
            href="mailto:Info@412studios.ca"
            className="hover:text-[#A8C8E8] transition-colors"
          >
            Info@412studios.ca
          </Link>
          <Link href="tel:647-540-2321" className="hover:text-[#A8C8E8] transition-colors">
            647-540-2321
          </Link>
        </div>

        <div className="p-4 md:p-8 flex flex-col gap-3">
          <h3 className="font-bold uppercase text-base md:text-lg tracking-wider">Location</h3>
          <p className="italic">412 Richmond St E, Toronto, ON M5A 1P8</p>
        </div>
      </div>

      <div className="border-t border-background/20 px-4 py-3 flex items-center justify-between gap-4 text-xs uppercase tracking-wider">
        <span>&copy; {new Date().getFullYear()} 412 Studios &middot; All rights reserved</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="flex items-center gap-2 px-3 py-2 border border-background/20 hover:bg-[#A8C8E8] hover:text-black transition-colors font-bold cursor-pointer"
        >
          <span className="hidden sm:inline">Top</span>
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
