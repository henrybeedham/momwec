
import { Player } from './Player';
import { Board } from './Board';
import { PropertySquare } from './Square';

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

export class GameState {
  private players: Player[];
  private currentPlayerIndex: number;
  private dice: [number, number];
  private gameLocked: boolean;
  private selectedProperty: number | null;
  private board: Board;

  constructor(boardSize = 11) {
    this.board = new Board(boardSize);
    this.players = [new Player(0, playerColors[0] ?? "bg-black", this.board, 1500)];
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
        1500
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
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.gameLocked = false;
  }

  buyHouse(propertyId: number): boolean {
    const currentPlayer = this.getCurrentPlayer();
    const propertySquare = this.board.getSquareFromIndex(propertyId) as PropertySquare;
    
    if (!propertySquare || !(propertySquare instanceof PropertySquare)) {
      throw new Error("Invalid property square");
    }
  
    return currentPlayer.buyHouse(propertySquare);
  }
  

  movePlayer(toastCallback: (message: { title: string; description: string }) => void): void {
    this.setGameLocked(true);
    const [dice1, dice2] = this.rollDice();
    const total = dice1 + dice2; 

    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.moveForward(total);

    const newSquare = this.board.getSquareFromIndex(currentPlayer.getPosition());
    if (!newSquare) return;

    newSquare.handleLanding(currentPlayer, this, total, toastCallback)
  }


}