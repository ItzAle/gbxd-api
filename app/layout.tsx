import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import fetchGames from "./api/games";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Video Game API",
  description: "An extensive API for managing video games",
};

export async function getStaticProps() {
  // Aquí llamas a tu función para obtener los datos de Firestore.
  const games = await fetchGames();

  return {
    props: {
      games,
    },
    revalidate: 60, // ISR: Revalida cada 60 segundos (puedes ajustarlo)
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
