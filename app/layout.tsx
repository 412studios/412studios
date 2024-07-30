import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/Navbar";
import { UserProvider } from "./components/UserContext";
import { Footer } from "./components/Footer";

import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "412 Studios",
  description: "412 Studios Toronto",
  metadataBase: new URL("https://www.412studios.ca/"),
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/icon.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/icon.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();

  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated(); // Await the promise
  const user = await getUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen p-4 py-0">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider isAuthenticated={isUserAuthenticated} user={user}>
              <header className="sticky top-0 z-50 bg-none">
                <Navbar />
              </header>
              <main className="flex-grow max-w-screen-xl mx-auto w-full py-8">
                {children}
              </main>
            </UserProvider>
          </ThemeProvider>
          <footer className="w-full flex justify-center items-center mt-auto">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
