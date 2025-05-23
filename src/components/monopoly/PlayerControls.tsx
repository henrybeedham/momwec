import { JSX } from "react";
import { GameState } from "~/models/GameState";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, HandCoins, Hotel, House, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Card } from "../ui/card";
import { PropertySquare } from "~/models/Square";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import PlayerTab from "./PlayerTab";
import TradeDialog, { Trade } from "./TradeDialog";
import { useUser } from "~/components/UserProvider";

interface PlayerControlsProps {
  game: GameState;
  onRollDice: () => void;
  onEndTurn: () => void;
  onBuyHouse: (propertyId: number) => void;
  onMortgage: (propertyId: number) => void;
  proposeTrade: (trade: Trade) => void;
  keyPassthrough: string;
  tradeKeyPassthrough: string;
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

function PlayerControls({ game, onRollDice, onEndTurn, onBuyHouse, onMortgage, proposeTrade, keyPassthrough, tradeKeyPassthrough }: PlayerControlsProps) {
  const currentPlayer = game.getCurrentPlayer();
  const isGameLocked = game.isGameLocked();
  const selectedProperty = game.getSelectedProperty();
  const dice = game.getDice();
  const params = useParams<{ gameId: string }>();
  const { user, isLoading } = useUser();
  if (!user) throw new Error("No user");
  const me = game.getPlayerById(user.id);
  if (!me) throw new Error("I don't exist :(");
  const properties = me.getOwnedProperties().sort((a, b) => a.id - b.id);
  const myTurn = user.id === currentPlayer.id;

  return (
    <div>
      <div className="mt-4 flex flex-col gap-4 *:relative">
        <div key={keyPassthrough}>
          <h1 className="text-2xl font-bold">MOMWEC Game: {params.gameId}</h1>
          <div className="flex items-center gap-1">
            <PlayerTab className="mr-2" colour={me.getColour()} />
            <p className="text-lg font-bold">
              {me.name} £{me.getMoney()}
            </p>
            {/* Show get out of jail card if you have one */}
            {!!me.getPardons() && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ShieldCheck />
                  </TooltipTrigger>
                  <TooltipContent>Get out of jail free card</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {/* Roll dice button */}
              {myTurn && (
                <Button onClick={onRollDice} disabled={dice[0] === dice[1] ? false : isGameLocked}>
                  Roll Dice
                </Button>
              )}
              <div>{diceIcon[dice[0] as DiceIconType]}</div>
              <div>{diceIcon[dice[1] as DiceIconType]}</div>
              {myTurn && (
                <Button disabled={dice[0] === dice[1] || !isGameLocked || currentPlayer.getMoney() < 0} onClick={onEndTurn}>
                  End Turn
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1">{/* {myTurn && <Button>Give money</Button>} */}</div>
          </div>
          {/* Properties list */}
          {properties.length >= 1 && (
            <Card>
              <Table className="max-h-[80vmin] overflow-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>Properties</TableHead>
                    {myTurn && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => {
                    const p = game.getBoard().getSquareFromIndex(property.id);
                    const isProperty = p instanceof PropertySquare;
                    return (
                      <TableRow key={property.id} className={cn(property.mortgaged && "bg-red-100 hover:bg-red-200")}>
                        <TableCell className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {isProperty && <PlayerTab className="mr-2" colour={p.getPropertyColour()} />}
                            {p?.name}
                            {/* Show houses icons for house and 5 houses  for a hotel */}
                            {isProperty && (
                              <>
                                {(property.houses ?? 0) < 5 &&
                                  Array(property.houses ?? 0)
                                    .fill(null)
                                    .map((_, index) => <House key={index} className="h-5 w-5 text-green-700" />)}
                                {property.houses === 5 && <Hotel className="h-5 w-5 text-red-700" />}
                              </>
                            )}
                          </div>
                        </TableCell>
                        {myTurn && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    onClick={() => {
                                      onMortgage(property.id);
                                    }}
                                  >
                                    <HandCoins />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{property.mortgaged ? "Unmortgage" : "Mortgage"}</p>
                                </TooltipContent>
                              </Tooltip>
                              {isProperty && (property.houses ?? 0) < 5 && currentPlayer.ownsPropertyGroup(p.group) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button disabled={me.getMoney() < p.houseCost} size="icon" onClick={() => onBuyHouse(property.id)}>
                                      <House />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Buy house/hotel</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
          {/* Trade Dialog */}
        </div>
        <TradeDialog game={game} proposeTrade={proposeTrade} key={tradeKeyPassthrough} />
      </div>
    </div>
  );
}

export default PlayerControls;
