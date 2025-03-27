import { PropertySquare } from "~/models/Square";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import SquareCard from "./SquareCard";
import { propertyColors } from "~/utils/monopoly";
import { GameState } from "~/models/GameState";

type PopupProps = {
  game: GameState;
  buyProperty: () => void;
  passProperty: () => void;
};

function Popups({ game, buyProperty, passProperty }: PopupProps) {
  const property = game
    .getBoard()
    .getSquareFromIndex(game.getSelectedProperty() ?? -1) as PropertySquare;
  return (
    <Dialog open={!!property}>
      {property && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>You landed on {property?.name}</DialogTitle>
          </DialogHeader>

          <SquareCard
            square={property}
            colourClass={propertyColors[property.group] ?? "bg-gray-200"}
          />

          <DialogFooter>
            <div className="flex gap-1">
              <Button variant="ghost" onClick={passProperty}>
                Pass
              </Button>
              <Button onClick={buyProperty}>Buy</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default Popups;
