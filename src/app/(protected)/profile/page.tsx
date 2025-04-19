"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUser, logoutUser, type User as UserType } from "~/lib/user";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user data when component mounts
    const userData = getUser();

    if (userData) {
      setUser(userData);
    } else {
      // Redirect to join page if no user is found
      router.push("/join");
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/join");
  };

  // Show loading state while checking for user
  if (!user) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-500 to-orange-600">Loading...</div>;
  }

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
