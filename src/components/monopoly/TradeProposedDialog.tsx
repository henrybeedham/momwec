import { Home } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Trade } from "./TradeDialog";
import { GameState } from "~/models/GameState";
import { BuyableSquare, PropertySquare } from "~/models/Square";
import { useUser } from "@clerk/nextjs";

type TradeProposalDialogProps = {
  game: GameState;
  onAccept: () => void;
  onDeny: () => void;
};

export default function TradeProposalDialog({ game, onAccept, onDeny }: TradeProposalDialogProps) {
  const trade = game.getProposedTrade();
  if (!trade) return null;
  // Find player names
  const proposer = game.getPlayerById(trade.proposer);
  const recipient = game.getPlayerById(trade.selectedPlayer);
  if (!proposer || !recipient) return null;
  const { user } = useUser();
  if (!user) {
    return null;
  }

  // Get properties involved in the trade
  const proposerGivesProperties = trade.giveProperties.map((id) => game.getBoard().getSquareFromIndex(id)).filter((p): p is BuyableSquare => !!p);
  const proposerGetsProperties = trade.getProperties.map((id) => game.getBoard().getSquareFromIndex(id)).filter((p): p is BuyableSquare => !!p);

  // Calculate total values. if the property is a PropertySquare, add the value of the houses using p.calculateValue(houses: number)
  const proposerGivesValue =
    proposerGivesProperties.reduce((acc, property) => {
      if (property instanceof PropertySquare) {
        return acc + property.calculateValue(proposer.getOwnedPropertyById(property.id)?.houses ?? 0);
      }
      return acc + property.price;
    }, 0) + (trade.giveMoney ?? 0);

  const proposerGetsValue =
    proposerGetsProperties.reduce((acc, property) => {
      if (property instanceof PropertySquare) {
        return acc + property.calculateValue(recipient.getOwnedPropertyById(property.id)?.houses ?? 0);
      }
      return acc + property.price;
    }, 0) + (trade.getMoney ?? 0);

  // Determine if the current player is the recipient
  console.log(`user id: ${user.id} selected player: ${trade.selectedPlayer}`);

  const isRecipient = user.id === trade.selectedPlayer;
  const open = isRecipient;

  console.log("Trade proposal dialog", { open, trade, proposer, recipient, isRecipient });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Trade Proposal</AlertDialogTitle>
          <AlertDialogDescription>
            {proposer?.name} has proposed a trade with {recipient?.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 my-4">
          {/* What recipient gets */}
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-green-600">You Receive</h3>
              <Separator className="mb-4" />

              {/* Properties */}
              {proposerGivesProperties.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-medium">Properties:</h4>
                  <div className="space-y-2">
                    {proposerGivesProperties.map((property) => {
                      const isProperty = property instanceof PropertySquare;
                      const propertyHouses = proposer.getOwnedPropertyById(property.id)?.houses ?? 0;
                      return (
                        <div key={property.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            {isProperty && <div className={`w-3 h-3 rounded-full ${property.getPropertyColour()}`} />}
                            <span className="text-sm">{property.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {propertyHouses > 0 && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {propertyHouses}
                              </Badge>
                            )}
                            <Badge variant="secondary">£{isProperty ? property.calculateValue(propertyHouses) : property.price}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Money */}
              {!!trade.giveMoney && trade.giveMoney > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Money:</h4>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <Badge variant="outline" className="bg-green-50">
                      £{trade.giveMoney}
                    </Badge>
                  </div>
                </div>
              )}

              {proposerGivesProperties.length === 0 && (!trade.giveMoney || trade.giveMoney === 0) && <p className="text-sm text-muted-foreground">Nothing to receive.</p>}

              <div className="mt-4 text-right">
                <p className="text-sm font-medium">Total value: £{proposerGivesValue}</p>
              </div>
            </CardContent>
          </Card>

          {/* What recipient gives */}
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-red-600">You Give</h3>
              <Separator className="mb-4" />

              {/* Properties */}
              {proposerGetsProperties.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-medium">Properties:</h4>
                  <div className="space-y-2">
                    {proposerGetsProperties.map((property) => {
                      const isProperty = property instanceof PropertySquare;
                      const propertyHouses = recipient.getOwnedPropertyById(property.id)?.houses ?? 0;
                      return (
                        <div key={property.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            {isProperty && <div className={`w-3 h-3 rounded-full ${property.getPropertyColour()}`} />}
                            <span className="text-sm">{property.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {propertyHouses > 0 && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {propertyHouses}
                              </Badge>
                            )}
                            <Badge variant="secondary">£{isProperty ? property.calculateValue(propertyHouses) : property.price}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Money */}
              {!!trade.getMoney && trade.getMoney > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Money:</h4>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <Badge variant="outline" className="bg-red-50">
                      £{trade.getMoney}
                    </Badge>
                  </div>
                </div>
              )}

              {proposerGetsProperties.length === 0 && (!trade.getMoney || trade.getMoney === 0) && <p className="text-sm text-muted-foreground">Nothing to give.</p>}

              <div className="mt-4 text-right">
                <p className="text-sm font-medium">Total value: £{proposerGetsValue}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {isRecipient && (
          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={onDeny}>
              Deny Trade
            </AlertDialogCancel>
            <AlertDialogAction type="submit" onClick={onAccept}>
              Accept Trade
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
