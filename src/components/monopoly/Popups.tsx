import { BuyableSquare, PropertySquare } from "~/models/Square";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import SquareCard from "./SquareCard";
import { propertyColors } from "~/utils/monopoly";
import { GameState } from "~/models/GameState";
import { useUser } from "@clerk/nextjs";

type PopupProps = {
  game: GameState;
  buyProperty: () => void;
  passProperty: () => void;
};

function Popups({ game, buyProperty, passProperty }: PopupProps) {
  const property = game
    .getBoard()
    .getSquareFromIndex(game.getSelectedProperty() ?? -1) as BuyableSquare;

  const { user } = useUser();
  if (!user) throw new Error("No user");
  const myTurn = user.id === game.getCurrentPlayer().id;
  const shouldBeOpen = !!property && myTurn;
  return (
    <AlertDialog open={shouldBeOpen}>
      {!!property && (
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>You landed on {property.name}</AlertDialogTitle>
          </AlertDialogHeader>

          <SquareCard
            square={property}
            colourClass={
              property instanceof PropertySquare
                ? (propertyColors[property.group] ?? "bg-gray-200")
                : "bg-gray-200"
            }
          />

          <AlertDialogFooter>
            <AlertDialogCancel onClick={passProperty}>Pass</AlertDialogCancel>
            <AlertDialogAction onClick={buyProperty}>Buy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}

export default Popups;
