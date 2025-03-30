"use client";
import React, { useCallback, useEffect, useState } from "react";
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

  let socket: ReturnType<typeof io>;

  useEffect(() => {
    // Establish a Socket.IO connection
    socket = io(SOCKET_SERVER_URL, {
      query: { gameId },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server with id:", socket.id);
    });

    // Listen for 'gameMove' events from the server
    socket.on("gameMove", (data) => {
      console.log("Received gameMove event:", data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      game?.importFromJSON(data);
    });

    // Cleanup on component unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, [gameId]);

  const sendGameMove = () => {
    if (socket) {
      // Emit a the current time event to the server
      socket.emit("gameMove", game?.toJSON());
    }
  };

  const initializeGame = useCallback(() => {
    const newGame = new GameState();
    setGame(newGame);
    setUniqueGameKey(newGame.exportGameState());
  }, []);

  const updateGameState = useCallback(
    (action: () => void) => {
      if (game) {
        action();
        setUniqueGameKey(game.exportGameState());
        sendGameMove();
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
