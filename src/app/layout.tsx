import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";

import {
  ClerkProvider,
  SignIn,
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
            <SignedOut>
              <div className="flex min-h-screen items-center justify-center bg-red-500 p-4">
                <SignIn withSignUp />
              </div>
            </SignedOut>
            <SignedIn>{children}</SignedIn>
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
