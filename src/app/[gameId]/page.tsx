/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import Link from "next/link";

import { propertyColors, squares } from "~/utils/monopoly";
import type { PropertySquare } from "~/utils/monopoly";
import {
  CreditCard,
  Zap,
  Train,
  Droplet,
  ArrowLeft,
  Columns4,
  Car,
  Pointer,
  Coins,
  Clover,
  Plus,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react";
import { Slider } from "~/components/ui/slider";
import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Badge } from "~/components/ui/badge";
import { set } from "zod";

type Edge = "corner" | "top" | "right" | "bottom" | "left" | "";

type Player = {
  id: number;
  position: number;
  previousPosition?: number;
  colour: string;
  money: number;
  ownedProperties?: number[];
};

const playerColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-gray-500",
  "bg-black",
];

export default function Home() {
  // const [boardSize, setBoardSize] = useState(11);
  const params = useParams<{ gameId: string }>();
  const boardSize = 11;
  const initialColour = playerColors[0];

  const [players, setPlayers] = useState<Player[]>([
    { id: 0, position: 0, colour: playerColors[0] ?? "", money: 1500 },
  ]);

  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  // dice
  const [dice, setDice] = useState([1, 1]);
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

  const totalSquares = (boardSize - 1) * 4;

  function getSquare(index: number): (typeof squares)[number] {
    if (index < squares.length) {
      return squares[index] ?? { name: "notFound", type: "other" };
    }
    return { name: "Empty", type: "other" };
  }

  function addPlayer() {
    if (players.length < playerColors.length) {
      setPlayers([
        ...players,
        {
          id: players.length,
          position: 0,
          colour: playerColors[players.length] ?? "",
          money: 1500,
        },
      ]);
    }
  }

  function movePlayer(playerId: number) {
    setCurrentPlayer(playerId);
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    setDice([dice1, dice2]);
    const total = dice1 + dice2;

    const player = players.find((player) => player.id === playerId);
    if (!player) return;
    const newPlayer = {
      ...player,
      position: (player.position + total) % totalSquares,
      previousPosition: player.position,
    };

    const newSquare = getSquare(newPlayer.position);
    if (!newSquare) return;

    // if player passes go
    if (newPlayer.position < player.position) {
      newPlayer.money += 200;
    }

    // if player lands on community chest
    if (newSquare.name === "Community Chest") {
      // TODO: implement community chest
    }

    // if player lands on chance
    if (newSquare.name === "Chance") {
      // TODO: implement chance
    }

    // if player lands on tax
    if (newSquare.name === "Income Tax") {
      newPlayer.money -= 200;
    }
    if (newSquare.name === "Super Tax") {
      newPlayer.money -= 100;
    }

    // if player lands on go to jail
    if (newSquare.name === "Go To Jail") {
      newPlayer.position = 10;
    }

    // if buyable square
    if ("price" in newSquare) {
      // if owned by any player, pay rent
      if (
        players.some(
          (player) =>
            player.ownedProperties?.includes(newPlayer.position) ?? false,
        )
      ) {
        let rentPrice = 0;

        if (newSquare.type === "property") {
          // check if property has houses
          // TODO: check if property has hotel
          rentPrice = newSquare.rent[0] ?? 0;
        } else if (newSquare.type === "station") {
          // TODO: check how many stations are owned by the player
          rentPrice = newSquare.rent[0] ?? 0;
        } else if (newSquare.type === "utility") {
          // TODO: implement dice
          rentPrice = 10;
        }
        newPlayer.money -= rentPrice;
        // pay rent to owner
        const owner = players.find((player) =>
          player.ownedProperties?.includes(newPlayer.position),
        );
      } else {
        // if not owned, sell
        setSelectedProperty(newPlayer.position);
      }
    }
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? newPlayer : player,
      ),
    );
    if (dice1 !== dice2) setCurrentPlayer((currentPlayer + 1) % players.length);
  }

  function buyProperty(playerId: number, propertyId: number) {
    const player = players.find((player) => player.id === playerId);
    if (!player) return;
    const property = getSquare(propertyId) as PropertySquare;
    if (player.money < property.price) return;
    const newPlayer = {
      ...player,
      money: player.money - property.price,
      ownedProperties: [...(player.ownedProperties ?? []), propertyId],
    };
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? newPlayer : player,
      ),
    );
    setSelectedProperty(null);
  }

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-zinc-950 to-zinc-900">
        <h1 className="mb-4 text-2xl font-bold text-white">
          MOMWEC Game: {params.gameId}
        </h1>
        {/* Player x's turn */}
        <h1 className="text-lg text-white">
          Player {currentPlayer + 1}&apos;s Turn
        </h1>
        {/* Dice using lucide icons */}
        <div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-white">
              {/* Roll dice button */}
              <Button onClick={() => movePlayer(currentPlayer)}>
                Roll Dice
              </Button>
              <div>{diceIcon[dice[0] as DiceIconType]}</div>
              <div>{diceIcon[dice[1] as DiceIconType]}</div>
            </div>
          </div>
        </div>
        {/* Buy properties dialog box */}
        <Dialog open={!!selectedProperty}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buy Properties</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <h1 className="text-lg">Do you want to buy this property?</h1>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    buyProperty(currentPlayer, selectedProperty ?? 0);
                  }}
                >
                  Buy
                </Button>
                <Button
                  onClick={() => {
                    setSelectedProperty(null);
                  }}
                >
                  Pass
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* <div className="mb-4">
          <label
            htmlFor="board-size"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Board Size: {boardSize}x{boardSize}
          </label>
          <Slider
            id="board-size"
            min={3}
            max={21}
            step={1}
            value={[boardSize]}
            onValueChange={(value: number[]) => setBoardSize(value[0] ?? 11)}
          />
        </div> */}
        <div className="flex">
          <div className="aspect-square w-full max-w-4xl">
            <div
              className={`m-4 grid gap-1`}
              style={{
                gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                gridTemplateRows: `repeat(${boardSize}, 1fr)`,
              }}
            >
              {Array(boardSize * boardSize)
                .fill(null)
                .map((_, index) => {
                  const row = Math.floor(index / boardSize);
                  const col = index % boardSize;
                  const isEdge =
                    row === 0 ||
                    row === boardSize - 1 ||
                    col === 0 ||
                    col === boardSize - 1;
                  // Calculate the square index based on the position on the board edge
                  const squareIndex = isEdge
                    ? row === boardSize - 1 // If Bottom Row
                      ? boardSize - col - 1 // Then this
                      : col === 0 // If Left column
                        ? 2 * boardSize - 2 - row // Then this
                        : row === 0 // If Top row
                          ? 2 * boardSize - 2 + col // Then this
                          : totalSquares - (boardSize - 1 - row) // Otherwise (Right column) this
                    : null;
                  if (!isEdge) {
                    if (row === 1 && col === 1) {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-center gap-2"
                          style={{
                            gridColumn: `span ${boardSize - 2}`,
                            gridRow: `span ${boardSize - 2}`,
                          }}
                        >
                          <div className="mt-4 flex flex-col justify-center gap-2">
                            <Button
                              onClick={addPlayer}
                              disabled={players.length >= playerColors.length}
                              className="rounded-full p-2"
                            >
                              <Plus className="h-6 w-6" />
                            </Button>
                            {players.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className={`mr-2 h-4 w-4 rounded-full ${player.colour}`}
                                ></div>
                                <p className="text-lg font-bold text-white">
                                  Player {player.id + 1} £{player.money}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else return;
                  }
                  if (squareIndex === null) return <div key={index}></div>;
                  const square = getSquare(squareIndex) ?? "";
                  const squareName = square.name;
                  const propertyGroup =
                    square.type === "property" ? square.group : "";
                  const colourClass =
                    propertyColors[propertyGroup] ?? "bg-gray-200";
                  const isCorner =
                    (row === 0 && col === 0) ||
                    (row === 0 && col === boardSize - 1) ||
                    (row === boardSize - 1 && col === 0) ||
                    (row === boardSize - 1 && col === boardSize - 1);
                  const edge: Edge = isCorner
                    ? "corner"
                    : isEdge
                      ? row === boardSize - 1
                        ? "bottom"
                        : col === 0
                          ? "left"
                          : row === 0
                            ? "top"
                            : "right"
                      : "";
                  return (
                    <HoverCard key={index}>
                      <HoverCardTrigger>
                        <div
                          className={cn(
                            `relative flex items-center justify-between overflow-hidden bg-white text-xs ${
                              edge === "bottom"
                                ? "flex-col rounded-t-lg"
                                : edge === "top"
                                  ? "flex-col-reverse rounded-b-lg"
                                  : edge === "right"
                                    ? "flex-row rounded-l-lg"
                                    : edge === "left"
                                      ? "flex-row-reverse rounded-r-lg"
                                      : "rounded-lg"
                            }`,
                          )}
                          style={{
                            height: `${80 / boardSize}vh`,
                          }}
                        >
                          <ColourTab
                            colourClass={colourClass}
                            edge={edge}
                            square={square}
                          />
                          <div className="flex flex-col items-center justify-between overflow-hidden p-1 text-xs">
                            <PlayerTokens
                              players={players}
                              squareIndex={squareIndex}
                            />
                            {renderSquareContent(squareName)}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <h1 className="text-lg">{square.name}</h1>
                        {square.type !== "other" && (
                          <Badge className={cn(colourClass)}>
                            {square.type === "property"
                              ? square.group
                              : square.type}
                          </Badge>
                        )}
                        {square.type !== "other" && (
                          <>
                            <div className="font-semibold">
                              Price: £{square.price}
                            </div>
                            <Separator className="my-2" />
                          </>
                        )}
                        {square.type === "property" && (
                          <>
                            <div className="mb-1 font-semibold">Rent:</div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Houses</TableHead>
                                  <TableHead>Rent</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {square.rent.map((rent, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {index === 5 ? "Hotel" : index}
                                    </TableCell>
                                    <TableCell>£{rent}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <div className="mt-2">
                              House Cost: £{square.houseCost}
                            </div>
                          </>
                        )}
                        {square.type === "station" && (
                          <>
                            <div className="mb-1 font-semibold">Rent:</div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Stations Owned</TableHead>
                                  <TableHead>Rent</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {square.rent.map((rent, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>£{rent}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </>
                        )}
                        {square.type === "utility" && (
                          <div>
                            Rent: 4x dice roll if one utility is owned, 10x dice
                            roll if both utilities are owned.
                          </div>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
            </div>
          </div>
          <div>
            {/* Property ownership table */}
            <Card>
              <CardHeader>
                <CardTitle>Property Ownership</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Properties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players
                      .filter((player) => player.ownedProperties?.length)
                      .map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>
                        <div
                          className={`h-4 w-4 rounded-full ${player.colour}`}
                        ></div>
                        </TableCell>
                        <TableCell>
                        {player.ownedProperties?.map((property) => (
                          <div key={property}>
                          {getSquare(property)?.name}
                          </div>
                        ))}
                        </TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function PlayerTokens({
  players,
  squareIndex,
}: {
  players: Player[];
  squareIndex: number;
}) {
  const playersOnSquare = players.filter(
    (player) => player.position === squareIndex,
  );
  return (
    <div className="absolute inset-2 z-50 flex items-center justify-center opacity-85">
      <div className="flex flex-wrap gap-1">
        {playersOnSquare.map((player) => (
          <div
            key={player.id}
            className={`h-4 w-4 rounded-full ${player.colour} shadow-md`}
          />
        ))}
      </div>
    </div>
  );
}

function ColourTab({
  colourClass,
  edge,
  square,
}: {
  colourClass: string;
  edge: Edge;
  square: (typeof squares)[number];
}) {
  if (square.type === "property") {
    return (
      <div
        className={cn(
          `flex items-center justify-center`,
          edge === "top" || edge === "bottom" ? "h-2 w-full" : "h-full w-2",
          colourClass,
        )}
      ></div>
    );
  }
  return null;
}

function renderSquareContent(squareName: string) {
  switch (squareName) {
    case "Go":
      return (
        <>
          <p className="rotate-[135deg] text-lg font-bold">GO</p>
          <ArrowLeft className="text-green-600" />
        </>
      );
    case "Jail":
      return (
        <>
          <p className="font-bold">JAIL</p>
          <Columns4 />
        </>
      );
    case "Free Parking":
      return (
        <>
          <p className="font-bold text-red-600">FREE</p>
          <Car />
          <p className="font-bold text-red-600">PARKING</p>
        </>
      );
    case "Go To Jail":
      return (
        <>
          <p className="font-bold">GO TO</p>
          <Pointer className="rotate-[-135deg]" />
          <p className="font-bold">JAIL</p>
        </>
      );
    case "Electric Company":
      return (
        <>
          <Zap className="h-8 w-8" />
          <p className="text-center">{squareName}</p>
        </>
      );
    case "Water Works":
      return (
        <>
          <Droplet className="h-8 w-8" />
          <p className="text-center">{squareName}</p>
        </>
      );
    case "Income Tax":
    case "Super Tax":
      return (
        <>
          <Coins className="h-8 w-8" />
          <p className="text-center">{squareName}</p>
        </>
      );
    case "Kings Cross Station":
    case "Marylebone Station":
    case "Fenchurch Street Station":
    case "Liverpool Street Station":
      return (
        <>
          <Train className="h-8 w-8" />
          <p className="text-center">{squareName}</p>
        </>
      );
    case "Community Chest":
      return (
        <>
          <p className="font-bold text-blue-600">COMMUNITY</p>
          <p className="font-bold text-blue-600">CHEST</p>
        </>
      );
    case "Chance":
      return (
        <>
          <Clover />
          <p className="font-bold text-orange-600">CHANCE</p>
        </>
      );
    case "Empty":
      return <p className="font-bold text-gray-400">EMPTY</p>;
    default:
      return (
        <>
          <p className="text-center">{squareName}</p>
        </>
      );
  }
}
