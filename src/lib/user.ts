// Define the User type for better type safety
export interface User {
  id: string;
  username: string;
  createdAt: string;
}

/**
 * Retrieves the user data from localStorage
 * @returns The user object or null if no user is found
 */
export function getUser(): User | null {
  // IMPORTANT: Only access localStorage on the client side
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Get the user data from localStorage
    const userData = localStorage.getItem("user");

    // Return null if no user data exists
    if (!userData) {
      return null;
    }

    // Parse and return the user data
    const user = JSON.parse(userData) as User;
    return user;
  } catch (error) {
    // Handle any errors (like invalid JSON)
    console.error("Error retrieving user data:", error);
    return null;
  }
}

/**
 * Checks if a user is currently logged in
 * @returns True if a user is logged in, false otherwise
 */
export function isLoggedIn(): boolean {
  return getUser() !== null;
}

/**
 * Clears the user data from localStorage (logs out the user)
 */
export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

/**
 * Safe way to get username that works during SSR
 * Returns a default value during server rendering
 */
export function getUserName(user: User | null): string {
  return user?.username || "Guest";
}
