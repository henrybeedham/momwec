// In your PlayerControls.tsx
import React from "react";
import { useToast } from "~/hooks/use-toast";
import MonopolyGame from "~/models/Game";

interface PlayerControlsProps {
  game: MonopolyGame;
  onRollDice: () => void;
  onEndTurn: () => void;
}

function PlayerControls({ game, onRollDice, onEndTurn }: PlayerControlsProps) {
  const gameState = game.getGameState();
  const currentPlayer = gameState.getCurrentPlayer();
  const isGameLocked = gameState.isGameLocked();
  const selectedProperty = gameState.getSelectedProperty();

  return (
    <div className="player-controls">
      <div className="player-info">
        <div className="player-id">Player {currentPlayer.getId() + 1}</div>
        <div className="player-money">£{currentPlayer.getMoney()}</div>
      </div>

      <div className="dice-display">
        {gameState.getDice().map((die, index) => (
          <div key={index} className="die">
            {die}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button onClick={onRollDice} disabled={isGameLocked}>
          Roll Dice
        </button>

        <button
          // onClick={}
          disabled={selectedProperty === null}
        >
          Buy Property
        </button>

        <button onClick={onEndTurn}>End Turn</button>
      </div>

      {/* Properties list */}
      <div className="owned-properties">
        <h3>Your Properties</h3>
        <div className="properties-list">
          {currentPlayer.getOwnedProperties().map((property) => {
            const square = game.getBoard().getSquareFromIndex(property.id);
            return (
              <div key={property.id} className="property-item">
                <span>{square?.name}</span>
                {square?.type === "property" && (
                  <button
                  // onClick={() => handleBuyHouse(property.id)}
                  >
                    Buy House
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlayerControls;
