import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "download Terabox Files",
  description: "Download any downloadable files from terabox.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className + " bg-slate-950 text-white h-full"}>
        {children}
      </body>
    </html>
  );
}
