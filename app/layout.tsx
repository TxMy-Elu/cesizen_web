import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/app/site-footer";
import { SiteHeader } from "@/components/app/site-header";
import { Providers } from "./providers";

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
  title: "CESIZen",
  description: "Plateforme de prevention et d'accompagnement en respiration guidee.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <Providers>
          <a
            href="#contenu-principal"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
          >
            Aller au contenu principal
          </a>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="contenu-principal" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
