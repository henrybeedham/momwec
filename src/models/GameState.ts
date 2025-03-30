import { Player } from "./Player";
import { Board } from "./Board";
import { PropertySquare, StationSquare, UtilitySquare, Square } from "./Square";
import { playerColors } from "~/utils/monopoly";

type GameStateJSON = {
  players: ReturnType<Player["toJSON"]>[];
  currentPlayerIndex: number;
  dice: [number, number];
  gameLocked: boolean;
  selectedProperty: number | null;
  board: ReturnType<Board["toJSON"]>;
};

export class GameState {
  private players: Player[];
  private currentPlayerIndex: number;
  private dice: [number, number];
  private gameLocked: boolean;
  private selectedProperty: number | null;
  private board: Board;

  constructor(boardSize = 11) {
    this.board = new Board(boardSize);
    this.players = [
      new Player(0, playerColors[0] ?? "bg-black", this.board, 1500),
      new Player(1, playerColors[1] ?? "bg-black", this.board, 1500),
    ];
    this.players[0]?.buyProperty(
      this.board.getSquareFromIndex(1) as PropertySquare,
    );
    this.players[0]?.buyProperty(
      this.board.getSquareFromIndex(3) as PropertySquare,
    );
    this.players[0]?.buyProperty(
      this.board.getSquareFromIndex(6) as PropertySquare,
    );
    this.players[0]?.buyProperty(
      this.board.getSquareFromIndex(8) as PropertySquare,
    );
    this.players[0]?.buyProperty(
      this.board.getSquareFromIndex(9) as PropertySquare,
    );
    this.players[0]?.addPardon();

    this.currentPlayerIndex = 0;
    this.dice = [1, 1];
    this.gameLocked = false;
    this.selectedProperty = null;
  }

  // Getters
  getPlayers(): Player[] {
    return this.players;
  }

  getCurrentPlayer(): Player {
    const player = this.players[this.currentPlayerIndex];
    if (!player) {
      throw new Error("Current player is undefined");
    }
    return player;
  }

  // getPropertyOwner(propertyId: number): Player | null {
  //   const owner =
  //     this.getPlayers()[
  //       this.getPlayers().findIndex((p) => p.ownsProperty(propertyId))
  //     ];
  //   if (!owner) {
  //     return null;
  //   } else {
  //     return owner;
  //   }
  // }

  getCurrentPlayerId(): number {
    return this.currentPlayerIndex;
  }

  getDice(): [number, number] {
    return this.dice;
  }

  getBoard(): Board {
    return this.board;
  }

  isGameLocked(): boolean {
    return this.gameLocked;
  }

  getSelectedProperty(): number | null {
    return this.selectedProperty;
  }

  // Setters
  setPlayers(players: Player[]): void {
    this.players = players;
  }

  setCurrentPlayer(index: number): void {
    this.currentPlayerIndex = index;
  }

  setDice(dice: [number, number]): void {
    this.dice = dice;
  }

  setGameLocked(locked: boolean): void {
    this.gameLocked = locked;
  }

  setSelectedProperty(property: number | null): void {
    this.selectedProperty = property;
  }

  // Game logic methods
  addPlayer(): void {
    if (this.players.length < playerColors.length) {
      const newPlayerId = this.players.length;
      const newPlayer = new Player(
        newPlayerId,
        playerColors[newPlayerId] ?? "bg-black-500",
        this.board,
        1500,
      );
      this.players.push(newPlayer);
    }
  }

  rollDice(): [number, number] {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    this.dice = [dice1, dice2];
    return [dice1, dice2];
  }

  endTurn(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    this.gameLocked = false;
  }

  buyHouse(propertyId: number): boolean {
    const currentPlayer = this.getCurrentPlayer();
    const propertySquare = this.board.getSquareFromIndex(
      propertyId,
    ) as PropertySquare;

    if (!propertySquare || !(propertySquare instanceof PropertySquare)) {
      throw new Error("Invalid property square");
    }

    return currentPlayer.buyHouse(propertySquare);
  }

  buyProperty(): boolean {
    const currentPlayer = this.getCurrentPlayer();
    const square = this.board.getSquareFromIndex(this.selectedProperty ?? -1);
    if (
      !(
        square instanceof PropertySquare ||
        square instanceof StationSquare ||
        square instanceof UtilitySquare
      )
    ) {
      throw new Error("Invalid square");
    }

    const buyingSuccess = currentPlayer.buyProperty(square);

    if (buyingSuccess) {
      this.setSelectedProperty(null);
      return true;
    }
    // else
    return false;
  }

  movePlayer(
    toastCallback: (message: { title: string; description: string }) => void,
  ): void {
    this.setGameLocked(true);
    const [dice1, dice2] = this.rollDice();
    const total = dice1 + dice2;

    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.moveForward(total);

    if (currentPlayer.passedGo()) {
      currentPlayer.addMoney(200);
      toastCallback({
        title: "Passing GO",
        description: "You collected £200 for passing GO!",
      });
    }

    const newSquare = this.board.getSquareFromIndex(
      currentPlayer.getPosition(),
    );
    if (!newSquare) return;

    newSquare.handleLanding(currentPlayer, this, total, toastCallback);
  }

  exportGameState(): string {
    return JSON.stringify({
      currentPlayerIndex: this.getCurrentPlayerId(),
      playerPositions: this.getPlayers().map((p) => p.getPosition()),
      playerMoney: this.getPlayers().map((p) => p.getMoney()),
      timestamp: Date.now(), // Ensures a unique key each time
    });
  }

  toJSON(): string {
    const gameState: GameStateJSON = {
      players: this.players.map((player) => player.toJSON()),
      currentPlayerIndex: this.currentPlayerIndex,
      dice: this.dice,
      gameLocked: this.gameLocked,
      selectedProperty: this.selectedProperty,
      board: this.board.toJSON(),
    };

    return JSON.stringify(gameState);
  }

  importFromJSON(jsonString: string): void {
    try {
      console.log("Importing game state from JSON");
      const gameState = JSON.parse(jsonString) as GameStateJSON;
      this.currentPlayerIndex = gameState.currentPlayerIndex;
      this.dice = gameState.dice;
      this.gameLocked = gameState.gameLocked;
      this.selectedProperty = gameState.selectedProperty;

      this.board.importFromJSON(gameState.board);
      // Import players
      this.players = gameState.players.map(
        (playerData: ReturnType<Player["toJSON"]>) => {
          const player = new Player(
            playerData.id,
            playerData.colour,
            this.board,
            playerData.money,
          );
          player.setPosition(playerData.position);
          player.setOwnedProperties(playerData.ownedProperties);
          player.setPardons(playerData.pardons);
          player.setPreviousPosition(playerData.previousPosition);
          return player;
        },
      );
    } catch (error) {
      console.error("Error importing game state:", error);
      throw new Error("Invalid game state JSON");
    }
  }
}
