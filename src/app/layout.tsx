import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Toaster } from "~/components/ui/toaster";

import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "MOMWEC",
  description: "Multiplayer Online Monopoly With Extra Capitalism",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "36x36",
        url: "/favicon/android-icon-36x36.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        url: "/favicon/android-icon-48x48.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "72x72",
        url: "/favicon/android-icon-72x72.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon/android-icon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "144x144",
        url: "/favicon/android-icon-144x144.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/favicon/android-icon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/favicon/android-icon-512x512.png",
      },
      {
        rel: "apple-touch-icon",
        type: "image/ico",
        url: "/favicon/apple-icon.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        url: "/favicon/apple-icon-57x57.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "60x60",
        url: "/favicon/apple-icon-60x60.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "72x72",
        url: "/favicon/apple-icon-72x72.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        url: "/favicon/apple-icon-76x76.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        url: "/favicon/apple-icon-114x114.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        url: "/favicon/apple-icon-120x120.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        url: "/favicon/apple-icon-144x144.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        url: "/favicon/apple-icon-152x152.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/favicon/apple-icon-180x180.png",
      },
      { rel: "icon", type: "image/ico", url: "/favicon/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon/favicon-96x96.png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/favicon/apple-icon-precomposed.png",
      },
    ],
  },
  manifest: "/favicon/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <SignedOut>
            <div className="flex min-h-screen items-center justify-center bg-red-500 p-4">
              <SignIn withSignUp />
            </div>
          </SignedOut>
          <SignedIn>{children}</SignedIn>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
