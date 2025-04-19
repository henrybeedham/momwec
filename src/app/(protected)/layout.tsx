"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, User } from "~/lib/user";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const localUser = getUser();
    setUser(localUser);
    if (!localUser) router.push("/join");
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return children;
}
