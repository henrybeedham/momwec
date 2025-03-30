"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameState } from "~/models/GameState";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";
import Popups from "./Popups";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { playerColoursLight } from "~/utils/monopoly";

const SOCKET_SERVER_URL = "https://socket.ilpa.co.uk";

function GameComponent() {
  const gameRef = useRef<GameState | null>(null);
  const [uniqueGameKey, setUniqueGameKey] = useState("");
  const { toast } = useToast();
  const { gameId } = useParams<{ gameId: string }>();

  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
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
      console.log("Asking for game data...");
      socketRef.current?.emit("getGameData", gameId);
    });

    socketRef.current.on("getGameData", () => {
      // Send the new player the game data
      console.log("Received request for game data. Sending data...");
      if (gameRef.current) {
        sendGameMove();
      } else {
        console.error("Game state is null. Cannot send game data.");
      }
    });

    // Listen for 'gameMove' events from the server
    socketRef.current.on("gameMove", (data) => {
      console.log("Received gameMove event:", JSON.parse(data as string));
      const newGame = new GameState();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newGame.importFromJSON(data);
      gameRef.current = newGame;
      setUniqueGameKey(newGame?.exportGameState() ?? "");
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [gameId]);

  const sendGameMove = () => {
    const data = gameRef.current?.toJSON();

    if (socketRef.current) {
      socketRef.current.emit("gameMove", data);
      console.log("Sent gameMove event:", data);
    } else {
      console.error("Socket connection is not established. (sendGameMove)");
    }
  };

  const initialiseGame = useCallback(() => {
    const newGame = new GameState();
    gameRef.current = newGame; // Store in ref for immediate access
    setUniqueGameKey(newGame.exportGameState());
  }, []);

  const updateGameState = useCallback(
    (action: () => void) => {
      console.log("Updating game state...");
      if (gameRef.current) {
        action();
        sendGameMove();
        setUniqueGameKey(gameRef.current.exportGameState());
      }
    },
    [gameRef.current],
  );

  const playerMove = useCallback(() => {
    updateGameState(() => {
      gameRef.current?.movePlayer((message) => {
        console.log(message.title, message.description);
        toast(message);
      });
    });
  }, [updateGameState, gameRef.current]);

  const endTurn = useCallback(() => {
    updateGameState(() => {
      gameRef.current?.endTurn();
    });
  }, [updateGameState, gameRef.current]);

  const buyProperty = useCallback(() => {
    updateGameState(() => {
      gameRef.current?.buyProperty();
    });
  }, [updateGameState, gameRef.current]);

  const buyHouse = useCallback(
    (propertyId: number) => {
      updateGameState(() => {
        gameRef.current?.buyHouse(propertyId);
      });
    },
    [updateGameState, gameRef.current],
  );

  const passProperty = useCallback(() => {
    updateGameState(() => {
      gameRef.current?.setSelectedProperty(null);
    });
  }, [updateGameState, gameRef.current]);

  // Initialize game on component mount
  React.useEffect(() => {
    initialiseGame();
  }, [initialiseGame]);

  if (!gameRef.current || !uniqueGameKey) {
    return <div>Loading game...</div>;
  }

  return (
    <div
      className={`${playerColoursLight[gameRef.current?.getCurrentPlayer().getColour()]} flex min-h-screen items-center justify-center `}
    >
      <div className={cn(`flex`)}>
        <Popups
          game={gameRef.current}
          buyProperty={buyProperty}
          passProperty={passProperty}
          key={`Popups-${uniqueGameKey}`}
        />
        <PlayerControls
          game={gameRef.current}
          onRollDice={playerMove}
          onEndTurn={endTurn}
          onBuyHouse={buyHouse}
          key={`Controls-${uniqueGameKey}`}
        />
        <BoardComponent game={gameRef.current} key={`Board-${uniqueGameKey}`} />
      </div>
    </div>
  );
}

export default GameComponent;
