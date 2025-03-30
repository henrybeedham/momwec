import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "MOMWEC",
  description: "Multiplayer Online Monopoly With Extra Capitalism",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>
            {/* <SignedOut>
              <SignInButton/>
              <SignUpButton/>
            </SignedOut>
            <SignedIn>{children}</SignedIn> */}
            {children}
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
