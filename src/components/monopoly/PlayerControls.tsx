// In your PlayerControls.tsx
import React from "react";
import { useToast } from "~/hooks/use-toast";
import { GameState } from "~/models/GameState";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";

interface PlayerControlsProps {
  game: GameState;
  onRollDice: () => void;
  onEndTurn: () => void;
}

const diceClasses = "h-8 w-8";
type DiceIconType = 1 | 2 | 3 | 4 | 5 | 6;
const diceIcon: Record<DiceIconType, JSX.Element> = {
  1: <Dice1 className={diceClasses} />,
  2: <Dice2 className={diceClasses} />,
  3: <Dice3 className={diceClasses} />,
  4: <Dice4 className={diceClasses} />,
  5: <Dice5 className={diceClasses} />,
  6: <Dice6 className={diceClasses} />,
};

function PlayerControls({ game, onRollDice, onEndTurn }: PlayerControlsProps) {
  const currentPlayer = game.getCurrentPlayer();
  const isGameLocked = game.isGameLocked();
  const selectedProperty = game.getSelectedProperty();
  const dice = game.getDice();
  const params = useParams<{ gameId: string }>();

  return (
    <div className="player-controls">
      <h1 className="mb-4 text-2xl font-bold">MOMWEC Game: {params.gameId}</h1>
      <div className="player-info">
        <div className="player-id">Player {currentPlayer.getId() + 1}</div>
        <div className="player-money">£{currentPlayer.getMoney()}</div>
      </div>

      <div className="flex items-center gap-1">
        {/* Roll dice button */}
        <Button
          onClick={onRollDice}
          disabled={dice[0] === dice[1] ? false : isGameLocked}
        >
          Roll Dice
        </Button>
        <div>{diceIcon[dice[0] as DiceIconType]}</div>
        <div>{diceIcon[dice[1] as DiceIconType]}</div>
      <Button
        disabled={dice[0] === dice[1] || !isGameLocked}
        onClick={onEndTurn}
      >
        End Turn
      </Button>
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
