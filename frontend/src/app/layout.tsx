import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhaka City Corporation (DCC) Interactive GIS & Election Atlas",
  description:
    "Interactive GIS atlas for Dhaka City Corporation — explore ward boundaries, parliamentary constituencies, thana maps, and election data for DNCC and DSCC.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased dark:bg-slate-950 dark:text-gray-100`}
      >
        <Navbar />
        <main className="pt-14 min-h-screen w-full flex flex-col">{children}</main>
      </body>
    </html>
  );
}
