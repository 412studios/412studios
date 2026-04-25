import Link from "next/link";
import { Mail, Phone } from "lucide-react";
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

export function Contact() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="aspect-[4/3] md:aspect-auto md:h-full border-b md:border-b-0 md:border-r overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.714871065601!2d-79.36956282382845!3d43.65410025237262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cba62e560a91%3A0xced444965ac2e5b7!2s412%20Studios!5e0!3m2!1sen!2sca!4v1719351835573!5m2!1sen!2sca"
          width="100%"
          height="100%"
          className="border-0 block"
          loading="lazy"
        ></iframe>
      </div>
      <div className="p-4 md:p-8 flex flex-col gap-4">
        <h3 className="font-bold uppercase text-xl md:text-2xl tracking-wider">
          412 Richmond St E, Toronto, ON M5A 1P8
        </h3>
        <div className="flex flex-col gap-2">
          <Link
            href="mailto:Info@412studios.ca"
            className="inline-flex items-center gap-2 hover:text-[#A8C8E8] transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>Info@412studios.ca</span>
          </Link>
          <Link
            href="tel:647-540-2321"
            className="inline-flex items-center gap-2 hover:text-[#A8C8E8] transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>647-540-2321</span>
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2 mt-2">
          {socials.map((social) => (
            <li key={social.label}>
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex items-center gap-2 px-3 py-2 border border-foreground/20 hover:bg-[#A8C8E8] hover:text-black transition-colors text-xs md:text-sm font-bold uppercase tracking-wider"
              >
                {social.icon}
                <span>{social.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
