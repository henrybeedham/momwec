"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "~/lib/user-context";
import posthog from "posthog-js";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user is found, redirect to home page
    if (!isLoading && !user) {
      router.push("/join");
    }
    if (user) {
      posthog.identify(user?.id, { username: user?.username, createdAt: user?.createdAt });
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-500 to-orange-600">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-white animate-spin mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is found after loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated, render the protected content
  return children;
}
