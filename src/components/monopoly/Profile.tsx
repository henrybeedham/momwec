"use client";
import { Button } from "~/components/ui/button";
import { User, LogOut, Users, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "~/lib/user-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

export default function Profile() {
  const { user, logout, isLoading } = useUser();
  const router = useRouter();

  // Show loading state while checking for user
  if (isLoading) {
    return <Loader2 className="animate-spin" />;
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users size={18} />
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Your Profile</DialogTitle>
          <DialogDescription className="text-center">Welcome back, {user.username}!</DialogDescription>
        </DialogHeader>
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

        <DialogFooter>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
