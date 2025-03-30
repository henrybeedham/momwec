import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";
import {
  PropertySquare,
  Square,
  StationSquare,
  UtilitySquare,
} from "~/models/Square";
import { propertyColors } from "~/utils/monopoly";
import { Player } from "~/models/Player";
import renderSquareContent from "./SquareContent";
import SquareHoverCard from "./SquareCard";
import { GameState } from "~/models/GameState";

interface BoardProps {
  game: GameState;
}

type Edge = "corner" | "top" | "right" | "bottom" | "left" | "";

function BoardComponent({ game }: BoardProps) {
  const board = game.getBoard();
  const players = game.getPlayers();
  const boardSize = board.getSize();
  const totalSquares = board.getTotalSquares();

  // Render the board based on the size
  const renderBoard = () => {
    const squares = board.getSquares();

    return (
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
                        {/* <Button
                              onClick={addPlayer}
                              disabled={players.length >= playerColors.length}
                              className="rounded-full p-2"
                            >
                              <Plus className="h-6 w-6" />
                            </Button> */}
                        {players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-1"
                          >
                            <div
                              className={`mr-2 h-4 w-4 rounded-full ${player.getColour()}`}
                            ></div>
                            <p className="text-lg font-bold">
                              Player {player.id + 1} £{player.getMoney()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else return;
              }
              if (squareIndex === null) return <div key={index}></div>;
              if (squareIndex > squares.length)
                throw new Error("SqIndex > #of squares");
              const square = squares[squareIndex];
              if (!square) throw new Error("No square");
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
              const colourClass =
                square instanceof PropertySquare
                  ? (propertyColors[square.group] ?? "bg-gray-200")
                  : "bg-gray-200";
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
                        {renderSquareContent(square.name)}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="text-lg">{square.name}</h1>
                    <SquareHoverCard
                      square={square}
                      colourClass={colourClass}
                    />
                  </HoverCardContent>
                </HoverCard>
              );
            })}
        </div>
      </div>
    );
  };

  return <div className="monopoly-board">{renderBoard()}</div>;
}

function ColourTab({
  colourClass,
  edge,
  square,
}: {
  colourClass: string;
  edge: Edge;
  square: Square;
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

function PlayerTokens({
  players,
  squareIndex,
}: {
  players: Player[];
  squareIndex: number;
}) {
  const playersOnSquare = players.filter(
    (player) => player.getPosition() === squareIndex,
  );
  return (
    <div className="absolute inset-2 z-50 flex items-center justify-center opacity-85">
      <div className="flex flex-wrap gap-1">
        {playersOnSquare.map((player) => (
          <div
            key={player.id}
            className={`h-4 w-4 rounded-full ${player.getColour()} shadow-md`}
          />
        ))}
      </div>
    </div>
  );
}

export default BoardComponent;
