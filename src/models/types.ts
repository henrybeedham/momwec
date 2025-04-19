export type Edge = "top" | "right" | "bottom" | "left" | "corner" | "";

export type ToastCallback = (message: { title: string; description: string; variant?: "destructive" | "default" }) => void;

export type Message = {
  user: string;
  type?: "system" | "player";
  title: string;
  description: string;
};

export type Group = "brown" | "light-blue" | "pink" | "orange" | "red" | "yellow" | "green" | "dark-blue";
