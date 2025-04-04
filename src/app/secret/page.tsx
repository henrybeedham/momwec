"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/hooks/use-toast";
import { io } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { GameState } from "~/models/GameState";

const SOCKET_SERVER_URL = "https://socket.ilpa.co.uk";

export default function AdminPage() {
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState<GameState | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  useEffect(() => {
    if (!user) return; // Early return if no user

    // Establish a Socket.IO connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { gameId },
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log(
        "Connected to Socket.IO server with id:",
        socketRef.current?.id,
      );
      console.log("Asking for game data/Checking if game exists...");
      socketRef.current?.emit("getGameData", gameId);
    });

    // Listen for 'gameMove' events from the server
    socketRef.current.on("gameMove", (data) => {
      console.log("Received gameMove event:", JSON.parse(data as string));
      const newGame = new GameState();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newGame.importFromJSON(data);

      toast({
        title: `Found game/got update: Game ${gameId}`,
      });
      setGameData(newGame);
      setLoading(false);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [gameId, user]);

  const handleAddMoney = () => {
    if (!gameData || !selectedPlayer || !amount) return;

    gameData.getPlayerById(selectedPlayer)?.addMoney(Number(amount));
    const data = gameData.toJSON();
    if (!data)
      throw new Error("Game data is null. Cannot send gameMove event.");
    if (!socketRef.current) {
      console.error("Socket connection is not established. (sendGameMove)");
      return;
    }
    socketRef.current.emit("gameMove", data);
    console.log("Sent gameMove event:", JSON.parse(data));
    toast({
      title: `Added £${amount} to ${selectedPlayer}`,
      description: `You have added £${amount} to ${selectedPlayer}.`,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Monopoly Admin</CardTitle>
          <CardDescription>
            Add money to players in your Monopoly game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameId">Game ID</Label>
            <div className="flex space-x-2">
              <Input
                id="gameId"
                placeholder="Enter game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
              />
            </div>
          </div>

          {gameData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="player">Select Player</Label>
                <Select
                  value={selectedPlayer}
                  onValueChange={setSelectedPlayer}
                  disabled={loading}
                >
                  <SelectTrigger id="player">
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameData.getPlayers().map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} (£{player.getMoney()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Add (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading || !selectedPlayer}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleAddMoney}
            disabled={loading || !gameData || !selectedPlayer || !amount}
          >
            <Banknote className="mr-2 h-4 w-4" />
            Add Money
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
