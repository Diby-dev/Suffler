import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suffler",
  description: "Plateforme de chat publique",
  manifest: "/manifest.json", // <--- Ajouté ici
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr" // <--- Vous pouvez aussi mettre "fr" pour le français
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}