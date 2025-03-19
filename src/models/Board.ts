import { Square, PropertySquare, StationSquare, UtilitySquare, CornerSquare, TaxSquare, CardSquare } from './Square';
import { Card, CardDeck } from './Card';

export class Board {
  private squares: Square[];
  private size: number;
  private totalSquares: number;
  private chanceDeck: CardDeck;
  private communityChestDeck: CardDeck;
  
  constructor(size = 11) {
    this.size = size;
    this.totalSquares = (size - 1) * 4;
    this.chanceDeck = CardDeck.createChanceDeck();
    this.communityChestDeck = CardDeck.createCommunityChestDeck();
    this.squares = this.initializeSquares();
  }
  
  private initializeSquares(): Square[] {
    const squares: Square[] = [];
    
    // Create the default Monopoly board
    // Corners
    squares.push(new CornerSquare(0, "GO"));
    squares.push(new CornerSquare(10, "Jail"));
    squares.push(new CornerSquare(20, "Free Parking"));
    squares.push(new CornerSquare(30, "Go To Jail", "jail"));
    
    // Brown properties
    squares.push(new PropertySquare(1, "Old Kent Road", 60, [2, 10, 30, 90, 160, 250], 50, "brown"));
    squares.push(new PropertySquare(3, "Whitechapel Road", 60, [4, 20, 60, 180, 320, 450], 50, "brown"));
    
    // Community Chest
    squares.push(new CardSquare(2, "Community Chest", "community"));
    squares.push(new CardSquare(17, "Community Chest", "community"));
    squares.push(new CardSquare(33, "Community Chest", "community"));
    
    // Light Blue properties
    squares.push(new PropertySquare(6, "The Angel Islington", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue"));
    squares.push(new PropertySquare(8, "Euston Road", 100, [6, 30, 90, 270, 400, 550], 50, "lightblue"));
    squares.push(new PropertySquare(9, "Pentonville Road", 120, [8, 40, 100, 300, 450, 600], 50, "lightblue"));
    
    // Chance
    squares.push(new CardSquare(7, "Chance", "chance"));
    squares.push(new CardSquare(22, "Chance", "chance"));
    squares.push(new CardSquare(36, "Chance", "chance"));
    
    // Pink properties
    squares.push(new PropertySquare(11, "Pall Mall", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
    squares.push(new PropertySquare(13, "Whitehall", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
    squares.push(new PropertySquare(14, "Northumberland Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink"));
    
    // Orange properties
    squares.push(new PropertySquare(16, "Bow Street", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
    squares.push(new PropertySquare(18, "Marlborough Street", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
    squares.push(new PropertySquare(19, "Vine Street", 200, [16, 80, 220, 600, 800, 1000], 100, "orange"));
    
    // Red properties
    squares.push(new PropertySquare(21, "Strand", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
    squares.push(new PropertySquare(23, "Fleet Street", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
    squares.push(new PropertySquare(24, "Trafalgar Square", 240, [20, 100, 300, 750, 925, 1100], 150, "red"));
    
    // Yellow properties
    squares.push(new PropertySquare(26, "Leicester Square", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
    squares.push(new PropertySquare(27, "Coventry Street", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
    squares.push(new PropertySquare(29, "Piccadilly", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow"));
    
    // Green properties
    squares.push(new PropertySquare(31, "Regent Street", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
    squares.push(new PropertySquare(32, "Oxford Street", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
    squares.push(new PropertySquare(34, "Bond Street", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green"));
    
    // Dark Blue properties
    squares.push(new PropertySquare(37, "Park Lane", 350, [35, 175, 500, 1100, 1300, 1500], 200, "darkblue"));
    squares.push(new PropertySquare(39, "Mayfair", 400, [50, 200, 600, 1400, 1700, 2000], 200, "darkblue"));
    
    // Stations
    squares.push(new StationSquare(5, "King's Cross Station", 200, [25, 50, 100, 200]));
    squares.push(new StationSquare(15, "Marylebone Station", 200, [25, 50, 100, 200]));
    squares.push(new StationSquare(25, "Fenchurch St. Station", 200, [25, 50, 100, 200]));
    squares.push(new StationSquare(35, "Liverpool Street Station", 200, [25, 50, 100, 200]));
    
    // Utilities
    squares.push(new UtilitySquare(12, "Electric Company", 150, [4, 10]));
    squares.push(new UtilitySquare(28, "Water Works", 150, [4, 10]));
    
    // Taxes
    squares.push(new TaxSquare(4, "Income Tax", 200));
    squares.push(new TaxSquare(38, "Super Tax", 100));
    
    // Sort squares by ID
    return squares.sort((a, b) => a.id - b.id);
  }
  
  getSquares(): Square[] {
    return this.squares;
  }
  
  getSquareFromIndex(index: number): Square | undefined {
    return this.squares.find(square => square.id === index);
  }
  
  getSize(): number {
    return this.size;
  }
  
  getTotalSquares(): number {
    return this.totalSquares;
  }
  
  drawChanceCard(): Card {
    return this.chanceDeck.drawCard();
  }
  
  drawCommunityChestCard(): Card {
    return this.communityChestDeck.drawCard();
  }
  
  // Get all properties of a specific group
  getPropertiesByGroup(group: string): PropertySquare[] {
    return this.squares.filter(
      square => square instanceof PropertySquare && square.group === group
    ) as PropertySquare[];
  }
  
  // Get all stations
  getStations(): StationSquare[] {
    return this.squares.filter(
      square => square
    ) as StationSquare[];
  }
  
  // Get all utilities
  getUtilities(): UtilitySquare[] {
    return this.squares.filter(
      square => square
    ) as UtilitySquare[];
  }
  
  // Check if a player owns all properties in a group
  hasMonopoly(playerId: number, group: string, playerOwnedProperties: number[]): boolean {
    const groupProperties = this.getPropertiesByGroup(group);
    return groupProperties.every(property => 
      playerOwnedProperties.includes(property.id)
    );
  }
  
  // Get the position after moving a certain number of steps
  getPositionAfterMove(currentPosition: number, steps: number): number {
    return (currentPosition + steps) % this.totalSquares;
  }
  
  // Find the next square of a specific type
  findNextSquareOfType(currentPosition: number, type: string): number {
    let position = (currentPosition + 1) % this.totalSquares;
    
    while (position !== currentPosition) {
      const square = this.getSquareFromIndex(position);
      if (square && square.type === type) {
        return position;
      }
      position = (position + 1) % this.totalSquares;
    }
    
    return currentPosition; // Return original position if no matching square found
  }
  
  // Check if a position is a corner
  isCorner(position: number): boolean {
    const square = this.getSquareFromIndex(position);
    return square instanceof CornerSquare;
  }
  
  // Reset the card decks
  resetCardDecks(): void {
    this.chanceDeck = CardDeck.createChanceDeck();
    this.communityChestDeck = CardDeck.createCommunityChestDeck();
  }
  
  // Get the edge type for a given position
  getEdgeType(position: number): string {
    const totalSquares = this.totalSquares;
    const sideLength = (totalSquares / 4);
    
    if (position % sideLength === 0) {
      return "corner";
    } else if (position < sideLength) {
      return "bottom";
    } else if (position < sideLength * 2) {
      return "left";
    } else if (position < sideLength * 3) {
      return "top";
    } else {
      return "right";
    }
  }
  
  // Get all properties that can have houses built on them
  getBuildableProperties(): PropertySquare[] {
    return this.squares.filter(
      square => square instanceof PropertySquare
    );
  }
  
  // Calculate the mortgage value of a property
  calculateMortgageValue(propertyId: number): number {
    const square = this.getSquareFromIndex(propertyId);
    if (square instanceof PropertySquare) {
      return square.price / 2;
    }
    return 0;
  }
}