import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavLinks from "@/components/NavLinks";

import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sacrament Meeting Planner",
  description: "Browse and plan sacrament meeting programs for the ward.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
              <span className="text-lg font-bold">Sacrament Meeting Planner</span>
              <div className="flex items-center gap-5">
                <NavLinks />
                {session?.user ? (
                  <SignOutButton />
                ) : (
                  <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
