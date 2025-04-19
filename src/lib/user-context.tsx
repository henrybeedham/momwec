"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Define the User type
export interface User {
  id: string;
  username: string;
  createdAt: string;
}

// Define the context shape
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Provide the context value to children
  return <UserContext.Provider value={{ user, isLoading, login, logout }}>{children}</UserContext.Provider>;
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
