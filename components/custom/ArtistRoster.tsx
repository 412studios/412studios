"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaApple } from "react-icons/fa";

const STUDIO_YELLOW = "#FFD60A";

type ArtistLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type Artist = {
  name: string;
  image: string;
  bio: string[];
  links: ArtistLink[];
};

const artists: Artist[] = [
  {
    name: "Rans Gundo",
    image: "/images/artists/Rans Gundo.jpeg",
    bio: [
      "Rans Gundo is an alternative rock artist from Mississauga, Ontario, making jangly, guitar-driven music with emotional depth and strong melodic instincts. Inspired by indie pioneers and raw storytellers, his sound balances introspection with energy.",
      "His percussive guitar style and dynamic instrumentation create tracks that feel immediate and powerful. Rans brings authenticity and live-ready intensity to everything he releases.",
    ],
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/ransgundo/",
        icon: <FaInstagram className="w-5 h-5" />,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@ransgundo1064",
        icon: <FaYoutube className="w-5 h-5" />,
      },
      {
        label: "Spotify",
        href: "https://open.spotify.com/artist/3cUNSMHILGtCTtonHb5znl?si=5iXP4kCVTvyPODjg5vaSPw",
        icon: <FaSpotify className="w-5 h-5" />,
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/artist/rans-gundo/1857141015",
        icon: <FaApple className="w-5 h-5" />,
      },
    ],
  },
  {
    name: "Sainty",
    image: "/images/artists/Sainty.JPG",
    bio: [
      "Sainty is a Canadian alternative pop artist from Mississauga, Ontario, creating cinematic, emotionally honest music rooted in personal experience. Her songs live in intimate spaces — turning toxic love, messy freedom, and vulnerability into haunting yet hopeful anthems.",
      "With confessional lyrics and self-aware storytelling, she captures life as it happens. Sainty transforms broken moments into soundtracks that feel personal, raw, and deeply connected.",
    ],
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/saintydaisy/",
        icon: <FaInstagram className="w-5 h-5" />,
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@saintydaisy",
        icon: <FaTiktok className="w-5 h-5" />,
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@saintydaisy",
        icon: <FaYoutube className="w-5 h-5" />,
      },
      {
        label: "Spotify",
        href: "https://open.spotify.com/artist/0N8qkwDJQxxGi4Dj1cTZ4Z?si=0B77J-XAQOGE3wmWbc_jZA",
        icon: <FaSpotify className="w-5 h-5" />,
      },
      {
        label: "Apple Music",
        href: "https://music.apple.com/us/artist/sainty/1578969222",
        icon: <FaApple className="w-5 h-5" />,
      },
    ],
  },
];

const REPEAT = 8;
const loopArtists = Array.from({ length: REPEAT }, () => artists).flat();

export function ArtistRoster() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const handleLoop = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !ready) return;
    const cycleWidth = el.scrollWidth / REPEAT;
    if (cycleWidth <= 0) return;
    // Safe zone is between cycle 2 and cycle REPEAT-2; jump distance keeps
    // the post-wrap position back in the middle so we never bounce.
    const jump = cycleWidth * (REPEAT - 4);
    if (el.scrollLeft >= cycleWidth * (REPEAT - 2)) {
      el.scrollLeft -= jump;
    } else if (el.scrollLeft <= cycleWidth * 2) {
      el.scrollLeft += jump;
    }
  }, [ready]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Wait for layout/images so scrollWidth is correct, then jump to middle.
    const init = () => {
      const cycleWidth = el.scrollWidth / REPEAT;
      if (cycleWidth <= 0) return;
      el.scrollLeft = cycleWidth * Math.floor(REPEAT / 2);
      setReady(true);
    };

    const raf = requestAnimationFrame(init);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !ready) return;
    el.addEventListener("scroll", handleLoop, { passive: true });
    return () => el.removeEventListener("scroll", handleLoop);
  }, [ready, handleLoop]);

  const scrollByAmount = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative isolate">
    <div
      ref={scrollRef}
      className="flex overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {loopArtists.map((artist, i) => (
        <div
          key={`${artist.name}-${i}`}
          className="shrink-0 w-[90vw] md:w-[640px] flex flex-col border-r last:border-r-0"
        >
          <div className="relative w-full aspect-[4/3] bg-muted">
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              sizes="(max-width: 768px) 90vw, 640px"
              className="object-cover"
            />
          </div>
          <div className="p-4 md:p-6 flex flex-col gap-3">
            <h3 className="font-bold uppercase text-2xl md:text-4xl tracking-wider">
              {artist.name}
            </h3>
            {artist.bio.map((paragraph, idx) => (
              <p key={idx} className="italic text-sm md:text-base leading-snug">
                {paragraph}
              </p>
            ))}
            <ul className="flex flex-wrap gap-2 mt-2">
              {artist.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${artist.name} on ${link.label}`}
                    className="flex items-center gap-2 px-3 py-2 border border-foreground/20 hover:bg-[#FFD60A] hover:text-black transition-colors text-xs md:text-sm font-bold uppercase tracking-wider"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Previous"
        className="z-10 absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:top-0 md:bottom-0 md:translate-y-0 md:flex md:items-center p-2 md:p-0 md:px-2 bg-black/25 backdrop-blur-sm border md:border-0 md:border-r border-white/15 hover:bg-[#FFD60A] hover:text-black transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 mix-blend-difference" style={{ color: STUDIO_YELLOW }} />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Next"
        className="z-10 absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:top-0 md:bottom-0 md:translate-y-0 md:flex md:items-center p-2 md:p-0 md:px-2 bg-black/25 backdrop-blur-sm border md:border-0 md:border-l border-white/15 hover:bg-[#FFD60A] hover:text-black transition-colors cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 mix-blend-difference" style={{ color: STUDIO_YELLOW }} />
      </button>
    </div>
  );
}
