"use client";
import React, { useCallback, useEffect, useState } from "react";
import MonopolyGame from "~/models/Game";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";

const GameComponent: React.FC = () => {
  const [game, setGame] = useState<MonopolyGame | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-unsafe-assignment
  const [gameState, setGameState] = useState<any | null>(null);
  const { toast } = useToast();

  const initializeGame = useCallback(() => {
    const newGame = new MonopolyGame();
    newGame.startGame();
    setGame(newGame);
    setGameState(newGame.exportGameState());
  }, []);

  const updateGameState = useCallback(
    (action: () => void) => {
      if (game) {
        action();
        setGameState(game.exportGameState());
      }
    },
    [game],
  );

  const playerMove = useCallback(() => {
    updateGameState(() => {
      game?.playerMove((message) => {
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

  if (!game || !gameState) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="monopoly-game">
      <BoardComponent
        game={game}
        key={JSON.stringify(gameState)}
      />
      <PlayerControls
        game={game}
        onRollDice={playerMove}
        onEndTurn={endTurn}
        key={JSON.stringify(gameState)}
      />
    </div>
  );
};

export default GameComponent;
