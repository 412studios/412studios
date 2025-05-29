import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/nav/Navbar";
import { UserProvider } from "./components/UserContext";
import { LoadingProvider } from "./components/LoadingProvider";

import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Link from "next/link";
import { Logo } from "@/public/icons/logo";
import { FaTiktok, FaInstagram, FaYoutube, FaSoundcloud } from "react-icons/fa";

import FacebookPixel from "./components/FacebookPixel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "412 Studios",
  description: "412 Studios Toronto",
  metadataBase: new URL("https://www.412studios.ca/"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  const FACEBOOK_PIXEL_ID = "1699908830923677";

  // Configure which pages should NOT show loading screen
  const excludedPaths = [
    "/api", // Exclude all API routes
    "/admin/settings", // Exclude specific admin page
  ];

  // Pass regex patterns as strings (they'll be converted to RegExp in the client component)
  const excludedPatterns = [
    "^/api/", // Exclude all API routes (regex pattern as string)
    "^/admin/quick-", // Exclude admin pages starting with 'quick-'
    "\\.(json|xml|txt)$", // Exclude file endpoints (note the escaped backslashes)
  ];

  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className="flex flex-col min-h-screen max-w-[2000px] mx-auto border-x overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider
            defaultExcludedPaths={excludedPaths}
            defaultExcludedPatterns={excludedPatterns}
          >
            <Navbar />
            <UserProvider isAuthenticated={isUserAuthenticated} user={user}>
              <main>{children}</main>
            </UserProvider>
            {/* FOOTER START */}
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
            {/* FOOTER END */}
          </LoadingProvider>
        </ThemeProvider>

        <FacebookPixel pixelId={FACEBOOK_PIXEL_ID} />
      </body>
    </html>
  );
}
