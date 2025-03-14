import Link from "next/link";
import { Map, Mail, Phone } from "lucide-react";
import { Divider } from "@/components/ui/copy";
import { H4 } from "@/components/ui/copy";
import { FaTiktok, FaInstagram, FaYoutube, FaSoundcloud } from "react-icons/fa";

export function Contact() {
  return (
    <>
      {/* Responsive layout - stacked on small screens, side-by-side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,2fr] rounded-xl overflow-hidden mt-8 bg-background/30 backdrop-blur-sm">
        {/* Top (or Left on large screens) - Map */}
        <div className="h-64 lg:h-auto overflow-hidden duration-700 ease-in-out hover:bg-primary/10 cursor-pointer">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.714871065601!2d-79.36956282382845!3d43.65410025237262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cba62e560a91%3A0xced444965ac2e5b7!2s412%20Studios!5e0!3m2!1sen!2sca!4v1719351835573!5m2!1sen!2sca"
            width="100%"
            height="100%"
            className="border-0"
            loading="lazy"
          ></iframe>
        </div>
        {/* Bottom (or Right on large screens) - Contact Information */}
        <div className="p-8 flex flex-col justify-center duration-700 ease-in-out hover:bg-primary/10 cursor-pointer">
          <H4 className="mb-2">412 Richmond St E, Toronto, ON M5A 1P8</H4>
          <Link
            href="mailto:Info@412studios.ca"
            className="text-primary hover:underline flex items-center font-normal"
          >
            <Mail className="h-4 mr-[5px]" />
            Info@412studios.ca
          </Link>
          <Link
            href="tel:647-540-2321"
            className="text-primary hover:underline flex items-center font-normal"
          >
            <Phone className="h-4 mr-[5px]" />
            647-540-2321
          </Link>

          <Divider className="my-2" />

          <div>
            <Link
              href="https://www.instagram.com/itsfouronetwo/"
              className="text-primary hover:underline flex items-center gap-2 font-normal"
            >
              <FaInstagram /> itsfouronetwo
            </Link>
            <Link
              href="https://www.tiktok.com/@412.studios"
              className="text-primary hover:underline flex items-center gap-2 font-normal"
            >
              <FaTiktok /> 412.studios
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCiIHqiNLRHtjsaKBVRh0ipQ"
              className="text-primary hover:underline flex items-center gap-2 font-normal"
            >
              <FaYoutube /> The412Show
            </Link>
            <Link
              href="https://soundcloud.com/412studios"
              className="text-primary hover:underline flex items-center gap-2 font-normal"
            >
              <FaSoundcloud /> 412studios
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
