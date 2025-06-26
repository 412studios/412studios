import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/nav/Navbar";
import { Footer } from "./components/Footer";
import { UserProvider } from "./components/UserContext";
import { LoadingProvider } from "./components/LoadingProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FacebookPixel from "./components/FacebookPixel";
import { headers } from "next/headers";

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

  // Get the current pathname to conditionally check auth
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Only check authentication for protected routes
  let isUserAuthenticated = false;
  let user = null;

  if (pathname.startsWith("/user")) {
    const { isAuthenticated, getUser } = getKindeServerSession();
    isUserAuthenticated = await isAuthenticated();
    user = await getUser();
  }

  const FACEBOOK_PIXEL_ID = "1699908830923677";
  const excludedPaths = ["/api", "/user/admin"];
  const excludedPatterns = ["^/api/", "^/user/admin", "\\.(json|xml|txt)$"];

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
            <div className="relative z-10 transition-opacity duration-500 ease-out">
              <Navbar />
              <UserProvider isAuthenticated={isUserAuthenticated} user={user}>
                <main>{children}</main>
              </UserProvider>
              <Footer />
            </div>
          </div>
        </LoadingProvider>
        <ScrollToTop />
        <FacebookPixel pixelId={FACEBOOK_PIXEL_ID} />
      </body>
    </html>
  );
}
