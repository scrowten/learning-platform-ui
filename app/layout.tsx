import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Platform",
  description: "A modular, domain-agnostic learning platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <nav className="nav-bar sticky top-0 z-10 px-6 py-3.5 flex items-center gap-6">
          <Link href="/" className="font-semibold text-white tracking-tight text-sm">
            Learning Platform
          </Link>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <Link href="/search" className="nav-link text-sm">
            Search
          </Link>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
