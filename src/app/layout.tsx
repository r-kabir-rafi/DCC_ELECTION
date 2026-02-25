import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Dhaka Atlas",
  description: "Interactive Dhaka election constituency explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Navbar />
        <main className="pt-16 min-h-screen bg-slate-50">{children}</main>
      </body>
    </html>
  );
}
