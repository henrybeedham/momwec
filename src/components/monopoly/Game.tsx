"use client";
import React, { useCallback, useEffect, useState } from "react";
import { GameState } from "~/models/GameState";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";

function GameComponent() {
  const [game, setGame] = useState<GameState | null>(null);
  const [uniqueGameKey, setUniqueGameKey] = useState("");

  const { toast } = useToast();

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

  // Initialize game on component mount
  React.useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (!game || !uniqueGameKey) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="monopoly-game">
      <PlayerControls
        game={game}
        onRollDice={playerMove}
        onEndTurn={endTurn}
        key={`Controls-${uniqueGameKey}`}
      />
      <BoardComponent game={game} key={`Board-${uniqueGameKey}`} />
    </div>
  );
}

export default GameComponent;
