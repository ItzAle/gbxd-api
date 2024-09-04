import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Video Game API",
  description: "An extensive API for managing video games",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
