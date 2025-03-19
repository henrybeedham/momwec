/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import Link from "next/link";

import { chanceCards, propertyColors, squares } from "~/utils/monopoly";
import type { Chance, PropertySquare } from "~/utils/monopoly";
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
  House,
  Hotel,
} from "lucide-react";
import { Slider } from "~/components/ui/slider";
import React, { useEffect, useState } from "react";
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
import { toast, useToast } from "~/hooks/use-toast";
import { io } from 'socket.io-client';
import { useUser } from "@clerk/nextjs";


type Edge = "corner" | "top" | "right" | "bottom" | "left" | "";

type Player = {
  id: number;
  position: number;
  previousPosition?: number;
  colour: string;
  money: number;
  ownedProperties?: {
    id: number;
    houses?: number;
  }[];
  pardons?: number;
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

const SOCKET_SERVER_URL = 'http://130.162.184.249:3000';

export default function Home() {
  const { gameId } = useParams();
  const { toast } = useToast();

  const { isSignedIn, user, isLoaded } = useUser();

  let socket: ReturnType<typeof io>;

  useEffect(() => {
    // Establish a Socket.IO connection
    socket = io(SOCKET_SERVER_URL, {
      query: { gameId },
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server with id:', socket.id);
    });

    // Listen for 'gameMove' events from the server
    socket.on('gameMove', (data) => {
      console.log('Received gameMove event:', data);
      
    });

    // Cleanup on component unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const sendGameMove = () => {
    if (socket) {
      // Emit a the current time event to the server
      socket.emit('gameMove', user?.fullName)
    }
  };

  // const [boardSize, setBoardSize] = useState(11);
  const params = useParams<{ gameId: string }>();
  const [boardSize, setBoardSize] = useState(11);
  const initialColour = playerColors[0];

  const [players, setPlayers] = useState<Player[]>([
    { id: 0, position: 0, colour: playerColors[0] ?? "", money: 1500 },
  ]);

  const [chance, setChance] = useState<Chance | null>(null);

  const [gameLocked, setGameLocked] = useState(false);

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

  function movePlayer() {
    setGameLocked(true);
    const playerId = currentPlayer;
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

    // if player lands on community chest
    if (newSquare.name === "Community Chest") {
      // TODO: implement community chest
    }

    // if player lands on chance
    if (newSquare.name === "Chance" || newSquare.name === "Community Chest") {
      const chanceCard =
        chanceCards[Math.floor(Math.random() * chanceCards.length)];
      if (!chanceCard) return;

      setChance(chanceCard);

      switch (chanceCard.type) {
        case "move":
          newPlayer.position = chanceCard.value;
          break;
        case "pay":
          newPlayer.money -= chanceCard.value;
          break;
        case "collect":
          newPlayer.money += chanceCard.value;
          break;
        case "back":
          newPlayer.position =
            (newPlayer.position - chanceCard.value + totalSquares) %
            totalSquares;
          break;
        case "pardon":
          newPlayer.pardons = (newPlayer.pardons ?? 0) + 1;
          break;
        case "go":
          newPlayer.position = 0;
          break;
        case "jail":
          newPlayer.position = 10;
          break;
        case "birthday":
          players.forEach((player) => {
            if (player.id !== playerId) {
              player.money -= 10;
              newPlayer.money += 10;
            }
          });
          break;
        // TODO: implement repairs and houses
      }
    }

    // if player passes go
    if (newPlayer.position < player.position) {
      newPlayer.money += 200;
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
            player.id !== playerId && // Exclude the specified player
            player.ownedProperties?.some(
              (property) => property.id === newPlayer.position,
            ),
        )
      ) {
        let rentPrice = 0;

        const owner = players.find((player) =>
          player.ownedProperties?.some(
            (property) => property.id === newPlayer.position,
          ),
        );

        if (newSquare.type === "property") {
          // check if property has houses
          const property = owner?.ownedProperties?.find(
            (property) => property.id === newPlayer.position,
          );
          rentPrice = newSquare.rent[property?.houses ?? 0] ?? 0;
        } else if (newSquare.type === "station") {
          // TODO: check how many stations are owned by the player
          rentPrice = newSquare.rent[0] ?? 0;
        } else if (newSquare.type === "utility") {
          // TODO: implement dice
          rentPrice = 10;
        }
        newPlayer.money -= rentPrice;
        // pay rent to owner
        // TODO: implement paying owner

        toast({
          title: "Rent Paid",
          description: `Player ${playerId + 1} paid £${rentPrice} to Player ${(owner?.id ?? 0) + 1} for staying at ${newSquare.name}`,
        });
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
  }

  function buyProperty(playerId: number, propertyId: number) {
    const player = players.find((player) => player.id === playerId);
    if (!player) return;
    const property = getSquare(propertyId) as PropertySquare;
    if (player.money < property.price) return;
    const newPlayer = {
      ...player,
      money: player.money - property.price,
      ownedProperties: [...(player.ownedProperties ?? []), { id: propertyId }],
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100">
        <h1 className="mb-4 text-2xl font-bold">
          MOMWEC Game: {params.gameId}
        </h1>
        <Button onClick={sendGameMove}>Send Game Move</Button>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Backup</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download or upload saved game state</DialogTitle>
                {/* Download game data (downloads the state of all of the players to a json file) */}
                <Button
                  onClick={() => {
                    const data = JSON.stringify(players, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "game-data.json";
                    a.click();
                  }}
                >
                  Export
                </Button>
                {/* Upload game data (allows you to upload a json file to set the state of all of the players) */}
                <DialogDescription>
                  Upload a JSON file to restore the game state
                </DialogDescription>
                <input
                  type="file"
                  accept=".json"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const data = reader.result as string;
                      const players = JSON.parse(data) as Player[];
                      setPlayers(players);
                    };
                    reader.readAsText(file);
                  }}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* Player x's turn */}
          <h1 className="text-lg">Player {currentPlayer + 1}&apos;s Turn</h1>
          {/* Dice using lucide icons */}
          <div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                {/* Roll dice button */}
                <Button
                  onClick={movePlayer}
                  disabled={dice[0] === dice[1] ? false : gameLocked}
                >
                  Roll Dice
                </Button>
                <div>{diceIcon[dice[0] as DiceIconType]}</div>
                <div>{diceIcon[dice[1] as DiceIconType]}</div>
              </div>
            </div>
          </div>
          {/* End turn button */}
          <Button
            disabled={dice[0] === dice[1] || !gameLocked}
            onClick={() => {
              setCurrentPlayer((currentPlayer + 1) % players.length);
              setGameLocked(false);
            }}
          >
            End Turn
          </Button>
        </div>
        {/* Buy properties dialog box */}
        <Dialog open={!!selectedProperty}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buy Properties</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <h1 className="text-lg">
                Do you want to buy {getSquare(selectedProperty ?? 0)?.name}?
              </h1>
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
        {/* Chance or community chest dialog box */}
        <Dialog open={!!chance}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chance</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <h1 className="text-lg">{chance?.description}</h1>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setChance(null);
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="mb-4">
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
        </div>
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
                                <p className="text-lg font-bold">
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
                            `relative flex items-center overflow-hidden bg-white text-xs ${
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
                            height: `${80 / boardSize}vmin`,
                          }}
                        >
                          <ColourTab
                            colourClass={colourClass}
                            edge={edge}
                            square={square}
                          />
                          <PlayerTokens
                            players={players}
                            squareIndex={squareIndex}
                          />
                          <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden p-1 text-xs">
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
                          <TableCell className="flex flex-col gap-2">
                            {player.ownedProperties?.map((property) => (
                              <div
                                key={property.id}
                                className="flex items-center gap-2"
                              >
                                {getSquare(property.id)?.name}
                                {/* Show houses icons for house and 5 houses  for a hotel */}
                                {getSquare(property.id)?.type ===
                                  "property" && (
                                  <>
                                    {(property.houses ?? 0) < 5 &&
                                      Array(property.houses ?? 0)
                                        .fill(null)
                                        .map((_, index) => (
                                          <House
                                            key={index}
                                            className="h-5 w-5 text-green-700"
                                          />
                                        ))}
                                    {property.houses === 5 && (
                                      <Hotel className="h-5 w-5 text-red-700" />
                                    )}
                                  </>
                                )}
                                {/* Buy house button */}
                                {currentPlayer === player.id &&
                                  getSquare(property.id)?.type === "property" &&
                                  (property.houses ?? 0) < 5 && (
                                    <Button
                                      className="text-xs"
                                      onClick={() => {
                                        const propertyLocal = getSquare(
                                          property.id,
                                        ) as PropertySquare;
                                        if (
                                          propertyLocal.houseCost > player.money
                                        )
                                          return;
                                        const newPlayer = {
                                          ...player,
                                          money:
                                            player.money -
                                            propertyLocal.houseCost,
                                          ownedProperties:
                                            player.ownedProperties?.map(
                                              (prop) => {
                                                if (prop.id === property.id) {
                                                  return {
                                                    ...prop,
                                                    houses:
                                                      (prop.houses ?? 0) + 1,
                                                  };
                                                }
                                                return prop;
                                              },
                                            ),
                                        };
                                        setPlayers((prevPlayers) =>
                                          prevPlayers.map((mapPlayer) =>
                                            mapPlayer.id === player.id
                                              ? newPlayer
                                              : mapPlayer,
                                          ),
                                        );
                                      }}
                                    >
                                      Buy house
                                    </Button>
                                  )}
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
          `absolute flex items-center justify-center`,
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
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-center">{squareName}</p>
          </div>
        </>
      );
  }
}
