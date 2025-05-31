import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/nav/Navbar";
import { Footer } from "./components/Footer";
import { UserProvider } from "./components/UserContext";
import { LoadingProvider } from "./components/LoadingProvider";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FacebookPixel from "./components/FacebookPixel";
import { useState } from "react"; // Added if needed for local fade-in (optional)

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
  const excludedPaths = ["/api", "/admin/settings"];

  const excludedPatterns = ["^/api/", "^/admin/quick-", "\\.(json|xml|txt)$"];

  return (
    <html lang="en">
      <body
        className="flex flex-col min-h-screen max-w-[2000px] mx-auto border-x overflow-x-hidden"
        suppressHydrationWarning
      >
        <LoadingProvider
          defaultExcludedPaths={excludedPaths}
          defaultExcludedPatterns={excludedPatterns}
        >
          <div className="relative">
            {/* Fade-in/out wrapper */}
            <div className="relative z-10 transition-opacity duration-500 ease-out">
              <Navbar />
              <UserProvider isAuthenticated={isUserAuthenticated} user={user}>
                <main>{children}</main>
              </UserProvider>
              <Footer />
            </div>
          </div>
        </LoadingProvider>
        <FacebookPixel pixelId={FACEBOOK_PIXEL_ID} />
      </body>
    </html>
  );
}
