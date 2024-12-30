"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startNewGame = () => {
    setIsLoading(true);
    // Generate a unique game ID (you might want to use a more robust method in production)
    const gameId = Math.random().toString(36).substring(2, 15);
    router.push(`/${gameId}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="mb-8 text-6xl font-bold text-white">Monopoly</h1>
        <Button
          onClick={startNewGame}
          disabled={isLoading}
          className="px-8 py-6 text-xl"
        >
          {isLoading ? "Creating Game..." : "Start New Game"}
        </Button>
      </div>
    </div>
  );
}
