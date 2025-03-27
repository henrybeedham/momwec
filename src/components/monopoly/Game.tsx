"use client";
import React, { useCallback, useEffect, useState } from "react";
import { GameState } from "~/models/GameState";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";
import Popups from "./Popups";

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

  const buyProperty = useCallback(() => {
    updateGameState(() => {
      game?.buyProperty();
    });
  }, [updateGameState, game]);

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
    <div className="monopoly-game">
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
        key={`Controls-${uniqueGameKey}`}
      />
      <BoardComponent game={game} key={`Board-${uniqueGameKey}`} />
    </div>
  );
}

export default GameComponent;
