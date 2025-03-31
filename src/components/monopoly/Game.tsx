"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameState } from "~/models/GameState";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";
import Popups from "./Popups";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { playerColoursLight } from "~/utils/monopoly";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

const SOCKET_SERVER_URL = "https://socket.ilpa.co.uk";

function GameComponent() {
  // Move ALL hooks to the top, before any conditional logic
  const gameRef = useRef<GameState | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [uniqueGameKey, setUniqueGameKey] = useState("");
  const { toast } = useToast();
  const { gameId } = useParams<{ gameId: string }>();
  const { isLoaded, user } = useUser();

  const sendGameMove = () => {
    const data = gameRef.current?.toJSON();

    if (socketRef.current) {
      socketRef.current.emit("gameMove", data);
      console.log("Sent gameMove event:", data);
    } else {
      console.error("Socket connection is not established. (sendGameMove)");
    }
  };

  // Your useEffect hook with proper dependencies
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

      // // check if I am a player
      // const isUserAPlayer = newGame
      //   .getPlayers()
      //   .some((player) => player.id === user.id);

      // const userName = getUserName(user);

      // if (!isUserAPlayer) {
      //   newGame.addPlayer(user.id, userName);
      //   sendGameMove();
      // }

      setUniqueGameKey(newGame?.exportGameState() ?? "");
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [gameId, user, sendGameMove]); // Include user and sendGameMove in dependencies

  const initialiseGame = useCallback(() => {
    const newGame = new GameState();
    if (!user) return;
    const userName =
      user.fullName ??
      user.emailAddresses[0]?.emailAddress ??
      user.username ??
      user.id;
    newGame.addPlayer(user.id, userName);
    gameRef.current = newGame; // Store in ref for immediate access
    setUniqueGameKey(newGame.exportGameState());
  }, [user]);

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

  // Now you can add your conditional return
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-500 p-4">
        <p>You must be signed in to play the game.</p>
      </div>
    );
  }

  if (!gameRef.current || !uniqueGameKey) {
    return <div>Loading game...</div>;
  }

  return (
    <div
      className={`${playerColoursLight[gameRef.current?.getCurrentPlayer().getColour()]} flex min-h-screen items-center justify-center`}
    >
      <div className="flex flex-col p-4 md:flex-row">
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

function getUserName(user: ReturnType<typeof useUser>["user"]): string {
  if (!user) throw new Error("Blud why you giving the getUserName no userrrr");
  return (
    user.fullName ??
    user.emailAddresses[0]?.emailAddress ??
    user.username ??
    user.id
  );
}
