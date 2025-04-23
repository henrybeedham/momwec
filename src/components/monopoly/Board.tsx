import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";
import { PropertySquare, Square, StationSquare, UtilitySquare } from "~/models/Square";
import { playerColoursLight, propertyColors } from "~/utils/monopoly";
import { Player } from "~/models/Player";
import renderSquareContent from "./SquareContent";
import SquareHoverCard from "./SquareCard";
import { GameState } from "~/models/GameState";
import { Card, CardContent } from "../ui/card";
import PlayerTab from "./PlayerTab";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useUser } from "~/components/UserProvider";
import { Badge } from "../ui/badge";
import { Home } from "lucide-react";

interface BoardProps {
  game: GameState;
}

type Edge = "corner" | "top" | "right" | "bottom" | "left" | "";

function BoardComponent({ game }: BoardProps) {
  const board = game.getBoard();
  const players = game.getPlayers().sort((a, b) => b.getNetWorth() - a.getNetWorth());
  const boardSize = board.getSize();
  const totalSquares = board.getTotalSquares();
  const squares = board.getSquares();
  const currentPlayer = game.getCurrentPlayer();
  const { user, isLoading } = useUser();
  if (!user) {
    return <div>Please log in to view the game.</div>;
  }
  const myPlayer = game.getPlayerById(user.id);
  const myPosition = myPlayer?.getPosition();
  const myColour = myPlayer?.getColour();

  return (
    <div
      className={`m-4 grid gap-1`}
      style={{
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        height: "85vmin",
        width: "85vmin",
      }}
    >
      {Array(boardSize * boardSize)
        .fill(null)
        .map((_, index) => {
          const row = Math.floor(index / boardSize);
          const col = index % boardSize;
          const isEdge = row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1;
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
              return <CenterOfBoard boardSize={boardSize} players={players} currentPlayerId={currentPlayer.id} key={index} />;
            } else return;
          }
          if (squareIndex === null) return <div key={index}></div>;
          if (squareIndex > squares.length) throw new Error("SqIndex > #of squares");
          const square = squares[squareIndex];
          if (!square) throw new Error("No square");
          const isCorner = (row === 0 && col === 0) || (row === 0 && col === boardSize - 1) || (row === boardSize - 1 && col === 0) || (row === boardSize - 1 && col === boardSize - 1);
          const edge: Edge = isCorner ? "corner" : isEdge ? (row === boardSize - 1 ? "bottom" : col === 0 ? "left" : row === 0 ? "top" : "right") : "";
          const colourClass = square instanceof PropertySquare ? (propertyColors[square.group] ?? "bg-gray-200") : "bg-gray-200";

          const isBuyable = square instanceof (PropertySquare || UtilitySquare || StationSquare);
          const owner = game.getOwner(square.id);
          const ownerColour = owner?.getColour();
          const house = owner?.getOwnedPropertyById(square.id);
          const sqColour = ownerColour ? playerColoursLight[ownerColour] : "bg-white";
          return (
            <HoverCard key={index} openDelay={100} closeDelay={50}>
              <HoverCardTrigger
                className={cn(
                  `relative flex items-center overflow-hidden hover:underline  ${sqColour} text-xs ${
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
                  width: `${80 / boardSize}vmin`,
                  border: `${squareIndex === myPosition ? `5px solid black` : "2px solid black"}`,
                }}
              >
                <ColourTab colourClass={colourClass} edge={edge} square={square} />
                <PlayerTokens players={players} squareIndex={squareIndex} />
                <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden p-1 text-2xs">{renderSquareContent(square)}</div>
              </HoverCardTrigger>
              <HoverCardContent>
                <h1 className="text-lg">{square.name}</h1>
                <SquareHoverCard square={square} colourClass={colourClass} />
                {!!ownerColour && !!owner && (
                  <div className="flex justify-center items-center gap-2 pt-4">
                    <h1>Owner:</h1>
                    <PlayerTab colour={ownerColour} />
                    <h1>{owner.name}</h1>
                    {(house?.houses ?? 0) > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {house?.houses}
                      </Badge>
                    )}
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          );
        })}
    </div>
  );
}

function ColourTab({ colourClass, edge, square }: { colourClass: string; edge: Edge; square: Square }) {
  if (square.type === "property") {
    return <div className={cn(`absolute flex items-center justify-center`, edge === "top" || edge === "bottom" ? "h-2 w-full" : "h-full w-2", colourClass)}></div>;
  }
  return null;
}

function PlayerTokens({ players, squareIndex }: { players: Player[]; squareIndex: number }) {
  const playersOnSquare = players.filter((player) => player.getPosition() === squareIndex);
  return (
    <div className="absolute inset-2 z-49 flex items-center justify-center opacity-85">
      <div className="flex flex-wrap gap-1">
        {playersOnSquare.map((player) => (
          <div key={player.id} className={`h-4 w-4 rounded-full ${player.getColour()} shadow-md`} />
        ))}
      </div>
    </div>
  );
}

function CenterOfBoard({ boardSize, players, currentPlayerId }: { boardSize: number; players: Player[]; currentPlayerId: string }) {
  const sortedPlayers = players.sort((a, b) => b.getNetWorth() - a.getNetWorth());
  return (
    <div
      className="flex items-center justify-center gap-2"
      style={{
        gridColumn: `span ${boardSize - 2}`,
        gridRow: `span ${boardSize - 2}`,
      }}
    >
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
          <div>
            <Table>
              <TableCaption>Player Leaderboard</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Colour</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Cash</TableHead>
                  <TableHead>Net Worth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player, i) => {
                  return (
                    <TableRow key={player.id} className={currentPlayerId === player.id ? "bg-red-100 hover:bg-red-200" : ""}>
                      <TableCell>#{i + 1}</TableCell>
                      <TableCell>
                        <PlayerTab className="mr-2" colour={player.getColour()} />
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>£{player.getMoney()}</TableCell>
                      <TableCell>£{player.getNetWorth()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BoardComponent;
