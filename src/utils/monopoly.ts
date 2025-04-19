import { User } from "~/lib/user-context";

export const propertyColors: Record<string, string> = {
  brown: "bg-amber-900",
  "light-blue": "bg-sky-400",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  "dark-blue": "bg-blue-800",
  station: "bg-gray-400",
  utility: "bg-gray-400",
};

export const playerColours = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-gray-500"];

export const playerColoursLight: Record<string, string> = {
  "bg-red-500": "bg-red-200",
  "bg-orange-500": "bg-orange-200",
  "bg-yellow-500": "bg-yellow-200",
  "bg-green-500": "bg-green-200",
  "bg-blue-500": "bg-blue-200",
  "bg-purple-500": "bg-purple-200",
  "bg-pink-500": "bg-pink-200",
  "bg-gray-500": "bg-gray-200",
};

export function getUserName(user: User | null): string {
  if (!user) return "Unknown User";
  return user.username ?? user.id;
}
