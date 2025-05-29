import Link from "next/link";
import { Logo } from "@/public/icons/logo";
import { FaTiktok, FaInstagram, FaYoutube, FaSoundcloud } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div>
        {/* Logo Section */}
        <div className="p-2">
          <Link href="#home" aria-label="Header Logo">
            <Logo className="rounded-full bg-white bg-opacity-5 h-6 text-background hover:text-secondary hover:fill-secondary transition-all duration-700 ease-in-out" />
          </Link>
        </div>

        <div className="h-[1px] w-full bg-white"></div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[12px] p-2">
          {/* Column 2: Contact Info */}
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <div className="space-y-2">
              <Link
                href="mailto:Info@412studios.ca"
                className="hover:underline flex items-center cursor-pointer"
              >
                Info@412studios.ca
              </Link>
              <Link
                href="tel:647-540-2321"
                className="hover:underline flex items-center cursor-pointer"
              >
                647-540-2321
              </Link>
            </div>
          </div>
          {/* Column 3: Social Media */}
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="space-y-2">
              <Link
                href="https://www.instagram.com/itsfouronetwo/"
                className="text-background hover:underline flex items-center gap-2"
              >
                <FaInstagram className="text-background" /> itsfouronetwo
              </Link>
              <Link
                href="https://www.tiktok.com/@412.studios"
                className="text-background hover:underline flex items-center gap-2"
              >
                <FaTiktok className="text-background" /> 412.studios
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
                className="text-background hover:underline flex items-center gap-2"
              >
                <FaYoutube className="text-background" /> The412Show
              </Link>
              <Link
                href="https://soundcloud.com/412studios"
                className="text-background hover:underline flex items-center gap-2"
              >
                <FaSoundcloud className="text-background" /> 412studios
              </Link>
            </div>
          </div>

          {/* Column 1: Address */}
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p>412 Richmond St E, Toronto, ON M5A 1P8</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] border-t p-1">
          © {new Date().getFullYear()} 412 Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
