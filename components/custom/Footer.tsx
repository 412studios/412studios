import Link from "next/link";
import { Logo } from "@/public/icons/logo";
import { FaTiktok, FaInstagram, FaYoutube, FaSoundcloud } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="flex flex-col min-h-[50vh]">
        {/* Logo Section */}
        <div className="p-2">
          <Link href="#home" aria-label="Header Logo">
            <Logo className="rounded-full bg-white bg-opacity-5 h-6 text-background hover:text-secondary hover:fill-secondary transition-all duration-700 ease-in-out" />
          </Link>
        </div>

        <div className="h-[1px] w-full bg-white"></div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[12px] p-6 flex-1">
          {/* Column 1: Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="space-y-4">
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
          {/* Column 2: Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-4">
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

          {/* Column 3: Address */}
          <div>
            <h3 className="font-semibold mb-4">Location</h3>
            <p className="mb-4">412 Richmond St E, Toronto, ON M5A 1P8</p>
            <div className="hidden md:block w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.7634567891234!2d-79.36548248450276!3d43.65107797912345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb2b7b7b7b7b%3A0x7b7b7b7b7b7b7b7b!2s412%20Richmond%20St%20E%2C%20Toronto%2C%20ON%20M5A%201P8%2C%20Canada!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "invert(90%) hue-rotate(180deg)",
                  borderRadius: "0.5rem",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="412 Studios Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] border-t p-2 mt-auto bg-black">
          © {new Date().getFullYear()} 412 Studios. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
