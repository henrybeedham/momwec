"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameState } from "~/models/GameState";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";
import Popups from "./Popups";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";

const SOCKET_SERVER_URL = "https://socket.ilpa.co.uk";

function GameComponent() {
  const [game, setGame] = useState<GameState | null>(null);
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
    });

    // Listen for 'gameMove' events from the server
    socketRef.current.on("gameMove", (data) => {
      console.log("Received gameMove event:", JSON.parse(data as string));
      const newGame = new GameState();      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      newGame.importFromJSON(data);
      setGame(newGame);
      setUniqueGameKey(newGame?.exportGameState() ?? "");
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [gameId]);

  const sendGameMove = () => {
    const data = game?.toJSON();

    if (socketRef.current) {
      socketRef.current.emit("gameMove", data);
      console.log("Sent gameMove event:", data);
    }
  };

  const initializeGame = useCallback(() => {
    const newGame = new GameState();
    setGame(newGame);
    setUniqueGameKey(newGame.exportGameState());
  }, []);

  const updateGameState = useCallback(
    (action: () => void) => {
      console.log("Updating game state...");
      if (game) {
        action();
        sendGameMove();
        setUniqueGameKey(game.exportGameState());
      }
    },
    [game],
  );

  const playerMove = useCallback(() => {
    updateGameState(() => {
      game?.movePlayer((message) => {
        console.log(message.title, message.description);
        toast(message);
      });
    });
  }, [updateGameState, game]);

  const endTurn = useCallback(() => {
    updateGameState(() => {
      game?.endTurn();
    });
  }, [updateGameState, game]);

  const buyProperty = useCallback(() => {
    updateGameState(() => {
      game?.buyProperty();
    });
  }, [updateGameState, game]);

  const buyHouse = useCallback(
    (propertyId: number) => {
      updateGameState(() => {
        game?.buyHouse(propertyId);
      });
    },
    [updateGameState, game],
  );

  const passProperty = useCallback(() => {
    updateGameState(() => {
      game?.setSelectedProperty(null);
    });
  }, [updateGameState, game]);

  // Initialize game on component mount
  React.useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (!game || !uniqueGameKey) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="monopoly-game flex">
      <Popups
        game={game}
        buyProperty={buyProperty}
        passProperty={passProperty}
        key={`Popups-${uniqueGameKey}`}
      />
      <PlayerControls
        game={game}
        onRollDice={playerMove}
        onEndTurn={endTurn}
        onBuyHouse={buyHouse}
        key={`Controls-${uniqueGameKey}`}
      />
      <BoardComponent game={game} key={`Board-${uniqueGameKey}`} />
    </div>
  );
}

export default GameComponent;
