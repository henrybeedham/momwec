/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import Link from "next/link";

import { propertyColors, propertyGroups, squares } from "~/utils/monopoly";
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
} from "lucide-react";
import { Slider } from "~/components/ui/slider";
import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";

type Edge = "corner" | "top" | "right" | "bottom" | "left" | "";

type Player = {
  id: number;
  position: number;
  colour: string;
};

const playerColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
];

export default function Home() {
  // const [boardSize, setBoardSize] = useState(11);
  const params = useParams<{ gameId: string }>();
  const boardSize = 11;
  const initialColour = playerColors[0]

  const [players, setPlayers] = useState<Player[]>([
    { id: 0, position: 0, colour: playerColors[0] ?? "" },
  ]);

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
          colour: playerColors[players.length],
        },
      ]);
    }
  }

  function movePlayer(playerId: number) {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              position: (player.position + 1) % totalSquares,
            }
          : player,
      ),
    );
  }

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Game: {params.gameId}
        </h1>

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
                        className="flex items-center justify-center"
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
                            <div key={player.id} className="flex items-center gap-1">
                              <div
                                className={`mr-2 h-4 w-4 rounded-full ${player.colour}`}
                              ></div>
                              <Button onClick={() => movePlayer(player.id)}>
                                Move
                              </Button>
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
                const propertyGroup = square.group ?? "";
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
                  <div
                    key={index}
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
                );
              })}
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
    <div className="absolute inset-2 flex items-center justify-center z-50 opacity-85">
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
          <Pointer className="" />
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
