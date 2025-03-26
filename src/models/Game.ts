import { GameState } from "./GameState";
import { Board } from "./Board";
import { Player } from "./Player";

class MonopolyGame {
  private gameState: GameState;
  private board: Board;

  constructor(boardSize = 11) {
    // Initialize the board first
    this.board = new Board(boardSize);

    // Initialize game state with the board
    this.gameState = new GameState(boardSize);

    // Set up initial players
    this.setupPlayers();
  }

  private setupPlayers(): void {
    // Add initial player
    // You can add more players as needed
    this.gameState.addPlayer();
  }

  startGame(): void {
    // Reset game state
    this.gameState.setCurrentPlayer(0);
    this.gameState.setGameLocked(false);
    this.gameState.setSelectedProperty(null);

    // You can add more initialization here
    console.log("Game started!");
  }

  // Player actions
  playerMove(
    toastCallback: (message: { title: string; description: string }) => void,
  ): void {
    this.gameState.movePlayer(toastCallback);

    // Additional logic for handling special squares using the board
    const currentPlayer = this.gameState.getCurrentPlayer();
    const position = currentPlayer.getPosition();
    const square = this.board.getSquareFromIndex(position);

    // Handle special cases that might not be covered in GameState
    if (square && square.type === "card") {
      // Handle card squares more specifically
      if (square.name === "Chance") {
        const chanceCard = this.board.drawChanceCard();
        // Process the card effect
      } else if (square.name === "Community Chest") {
        const communityCard = this.board.drawCommunityChestCard();
        // Process the card effect
      }
    }
  }

  endTurn(): void {
    this.gameState.endTurn();
  }

  // Game state methods
  getGameState(): GameState {
    return this.gameState;
  }

  getBoard(): Board {
    return this.board;
  }

  exportGameState(): string {
    // Create a unique identifier based on current game state
    return JSON.stringify({
      currentPlayerIndex: this.gameState.getCurrentPlayerId(),
      playerPositions: this.gameState.getPlayers().map((p) => p.getPosition()),
      playerMoney: this.gameState.getPlayers().map((p) => p.getMoney()),
      timestamp: Date.now(), // Ensures a unique key each time
    });
  }
}

export default MonopolyGame;
