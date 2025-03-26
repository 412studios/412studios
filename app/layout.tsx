import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/nav/Navbar";
import { UserProvider } from "./components/UserContext";

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
  ],
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

  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className="flex flex-col min-h-screen">
        {/* <body className="flex flex-col min-h-screen max-w-[2000px] mx-auto"> */}
        <Navbar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider isAuthenticated={isUserAuthenticated} user={user}>
            <main>{children}</main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
