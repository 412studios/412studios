import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/Navbar";
import { SubNav } from "./components/SubNav";
import { unstable_noStore as noStore } from "next/cache";
import { Footer } from "./components/Footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "412 Studios",
  description: "412 Studios Toronto",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <SubNav />
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
