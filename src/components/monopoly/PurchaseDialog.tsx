import { BuyableSquare, PropertySquare } from "~/models/Square";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import SquareCard from "./SquareCard";
import { propertyColors } from "~/utils/monopoly";
import { GameState } from "~/models/GameState";
import { useUser } from "~/components/UserProvider";
import { Card, CardContent } from "../ui/card";

type PopupProps = {
  game: GameState;
  buyProperty: () => void;
  passProperty: () => void;
};

function PurchaseDialog({ game, buyProperty, passProperty }: PopupProps) {
  const property = game.getBoard().getSquareFromIndex(game.getSelectedProperty() ?? -1) as BuyableSquare;
  if (!property) return null;
  const { user, isLoading } = useUser();
  if (!user) throw new Error("No user");
  const me = game.getCurrentPlayer();
  const myTurn = user.id === me.id;
  const shouldBeOpen = !!property && myTurn;
  const buyDisabled = me.getMoney() < property.price;
  return (
    <AlertDialog open={shouldBeOpen}>
      {!!property && (
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>You landed on {property.name}</AlertDialogTitle>
          </AlertDialogHeader>

          <Card className="bg-gray-100">
            <CardContent className="pt-4">
              <SquareCard square={property} colourClass={property instanceof PropertySquare ? (propertyColors[property.group] ?? "bg-gray-200") : "bg-gray-200"} />
            </CardContent>
          </Card>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={passProperty}>Pass</AlertDialogCancel>
            <AlertDialogAction onClick={buyProperty} disabled={buyDisabled}>
              Buy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}

export default PurchaseDialog;
