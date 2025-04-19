"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "~/lib/user-context";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, logout, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not logged in and not loading
    if (!isLoading && !user) {
      router.push("/join");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking for user
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-500 to-orange-600">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">Loading...</div>
      </div>
    );
  }

  // If no user is found after loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/join");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-500 to-orange-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Your Profile</CardTitle>
          <CardDescription className="text-center">Welcome back, {user.username}!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-medium text-sm truncate max-w-[200px]">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined:</span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
