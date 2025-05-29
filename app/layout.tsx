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
    <html lang="en">
      <body
        className="flex flex-col min-h-screen max-w-[2000px] mx-auto border-x overflow-x-hidden"
        suppressHydrationWarning
      >
        <LoadingProvider
          defaultExcludedPaths={excludedPaths}
          defaultExcludedPatterns={excludedPatterns}
        >
          <Navbar />
          <UserProvider isAuthenticated={isUserAuthenticated} user={user}>
            <main>{children}</main>
          </UserProvider>
          <Footer />
        </LoadingProvider>
        <FacebookPixel pixelId={FACEBOOK_PIXEL_ID} />
      </body>
    </html>
  );
}
