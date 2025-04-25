/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Square, PropertySquare, StationSquare, UtilitySquare, CornerSquare, TaxSquare, CardSquare } from "./Square";
import { Card, CardDeck } from "./Card";

export type BoardName = "uk" | "us" | "world" | "bry";

export class Board {
  private squares: Square[];
  private size: number;
  private totalSquares: number;
  private chanceDeck: CardDeck;
  private communityChestDeck: CardDeck;

  constructor(boardName: BoardName, size = 11) {
    this.size = size;
    this.totalSquares = (size - 1) * 4;
    this.chanceDeck = CardDeck.createChanceDeck();
    this.communityChestDeck = CardDeck.createCommunityChestDeck();
    this.squares = this.initializeSquares(boardName);
  }

  private initializeSquares(boardName: BoardName): Square[] {
    const squares: Square[] = [];

    switch (boardName) {
      case "uk":
        // Corners
        squares.push(new CornerSquare(0, "Go"));
        squares.push(new CornerSquare(10, "Jail"));
        squares.push(new CornerSquare(20, "Free Parking"));
        squares.push(new CornerSquare(30, "Go To Jail", "jail"));
        squares.push(new PropertySquare(1, "Old Kent Road", 60, [2, 10, 30, 90, 160, 250], 50, "brown"));
        squares.push(new PropertySquare(3, "Whitechapel Road", 60, [4, 20, 60, 180, 320, 450], 50, "brown"));
        squares.push(new CardSquare(2, "Community Chest", "community"));
        squares.push(new CardSquare(17, "Community Chest", "community"));
        squares.push(new CardSquare(33, "Community Chest", "community"));
        squares.push(new PropertySquare(6, "The Angel Islington", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(8, "Euston Road", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(9, "Pentonville Road", 120, [8, 40, 100, 300, 450, 600], 50, "light-blue"));
        squares.push(new CardSquare(7, "Chance", "chance"));
        squares.push(new CardSquare(22, "Chance", "chance"));
        squares.push(new CardSquare(36, "Chance", "chance"));
        squares.push(new PropertySquare(11, "Pall Mall", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(13, "Whitehall", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(14, "Northumberland Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink"));
        squares.push(new PropertySquare(16, "Bow Street", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(18, "Marlborough Street", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(19, "Vine Street", 200, [16, 80, 220, 600, 800, 1000], 100, "orange"));
        squares.push(new PropertySquare(21, "Strand", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(23, "Fleet Street", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(24, "Trafalgar Square", 240, [20, 100, 300, 750, 925, 1100], 150, "red"));
        squares.push(new PropertySquare(26, "Leicester Square", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(27, "Coventry Street", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(29, "Piccadilly", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow"));
        squares.push(new PropertySquare(31, "Regent Street", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(32, "Oxford Street", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(34, "Bond Street", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green"));
        squares.push(new PropertySquare(37, "Park Lane", 350, [35, 175, 500, 1100, 1300, 1500], 200, "dark-blue"));
        squares.push(new PropertySquare(39, "Mayfair", 400, [50, 200, 600, 1400, 1700, 2000], 200, "dark-blue"));
        squares.push(new StationSquare(5, "King's Cross Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(15, "Marylebone Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(25, "Fenchurch St. Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(35, "Liverpool St. Station", 200, [25, 50, 100, 200]));
        squares.push(new UtilitySquare(12, "Electric Company", 150, [4, 10]));
        squares.push(new UtilitySquare(28, "Water Works", 150, [4, 10]));
        squares.push(new TaxSquare(4, "Income Tax", 200));
        squares.push(new TaxSquare(38, "Super Tax", 100));
        break;
      case "us":
        // US board setup
        squares.push(new CornerSquare(0, "Go"));
        squares.push(new CornerSquare(10, "Jail"));
        squares.push(new CornerSquare(20, "Free Parking"));
        squares.push(new CornerSquare(30, "Go To Jail", "jail"));
        squares.push(new PropertySquare(1, "Mediterranean Avenue", 60, [2, 10, 30, 90, 160, 250], 50, "brown"));
        squares.push(new PropertySquare(3, "Baltic Avenue", 60, [4, 20, 60, 180, 320, 450], 50, "brown"));
        squares.push(new CardSquare(2, "Community Chest", "community"));
        squares.push(new CardSquare(17, "Community Chest", "community"));
        squares.push(new CardSquare(33, "Community Chest", "community"));
        squares.push(new PropertySquare(6, "Oriental Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(8, "Vermont Avenue", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(9, "Connecticut Avenue", 120, [8, 40, 100, 300, 450, 600], 50, "light-blue"));
        squares.push(new CardSquare(7, "Chance", "chance"));
        squares.push(new CardSquare(22, "Chance", "chance"));
        squares.push(new CardSquare(36, "Chance", "chance"));
        squares.push(new PropertySquare(11, "St. Charles Place", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(13, "States Avenue", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(14, "Virginia Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink"));
        squares.push(new PropertySquare(16, "St. James Place", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(18, "Tennessee Avenue", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(19, "New York Avenue", 200, [16, 80, 220, 600, 800, 1000], 100, "orange"));
        squares.push(new PropertySquare(21, "Kentucky Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(23, "Indiana Avenue", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(24, "Illinois Avenue", 240, [20, 100, 300, 750, 925, 1100], 150, "red"));
        squares.push(new PropertySquare(26, "Atlantic Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(27, "Ventnor Avenue", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(29, "Marvin Gardens", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow"));
        squares.push(new PropertySquare(31, "Pacific Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(32, "North Carolina Avenue", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(34, "Pennsylvania Avenue", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green"));
        squares.push(new PropertySquare(37, "Park Place", 350, [35, 175, 500, 1100, 1300, 1500], 200, "dark-blue"));
        squares.push(new PropertySquare(39, "Boardwalk", 400, [50, 200, 600, 1400, 1700, 2000], 200, "dark-blue"));
        squares.push(new StationSquare(5, "Reading Railroad", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(15, "Pennsylvania Railroad", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(25, "B&O Railroad", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(35, "Short Line", 200, [25, 50, 100, 200]));
        squares.push(new UtilitySquare(12, "Electric Company", 150, [4, 10]));
        squares.push(new UtilitySquare(28, "Water Works", 150, [4, 10]));
        squares.push(new TaxSquare(4, "Income Tax", 200));
        squares.push(new TaxSquare(38, "Luxury Tax", 100));
        break;
      case "world":
        // World board setup
        squares.push(new CornerSquare(0, "Go"));
        squares.push(new CornerSquare(10, "Jail"));
        squares.push(new CornerSquare(20, "Free Parking"));
        squares.push(new CornerSquare(30, "Go To Jail", "jail"));
        squares.push(new PropertySquare(1, "Tokyo", 60, [2, 10, 30, 90, 160, 250], 50, "brown"));
        squares.push(new PropertySquare(3, "New York", 60, [4, 20, 60, 180, 320, 450], 50, "brown"));
        squares.push(new CardSquare(2, "Community Chest", "community"));
        squares.push(new CardSquare(17, "Community Chest", "community"));
        squares.push(new CardSquare(33, "Community Chest", "community"));
        squares.push(new PropertySquare(6, "London", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(8, "Paris", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(9, "Berlin", 120, [8, 40, 100, 300, 450, 600], 50, "light-blue"));
        squares.push(new CardSquare(7, "Chance", "chance"));
        squares.push(new CardSquare(22, "Chance", "chance"));
        squares.push(new CardSquare(36, "Chance", "chance"));
        squares.push(new PropertySquare(11, "Sydney", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(13, "Rio de Janeiro", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(14, "Cape Town", 160, [12, 60, 180, 500, 700, 900], 100, "pink"));
        squares.push(new PropertySquare(16, "Moscow", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(18, "Beijing", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(19, "Dubai", 200, [16, 80, 220, 600, 800, 1000], 100, "orange"));
        squares.push(new PropertySquare(21, "Los Angeles", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(23, "Toronto", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(24, "Mexico City", 240, [20, 100, 300, 750, 925, 1100], 150, "red"));
        squares.push(new PropertySquare(26, "Bangkok", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(27, "Singapore", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(29, "Hong Kong", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow"));
        squares.push(new PropertySquare(31, "Berlin", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(32, "Madrid", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(34, "Rome", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green"));
        squares.push(new PropertySquare(37, "Istanbul", 350, [35, 175, 500, 1100, 1300, 1500], 200, "dark-blue"));
        squares.push(new PropertySquare(39, "Cairo", 400, [50, 200, 600, 1400, 1700, 2000], 200, "dark-blue"));
        squares.push(new StationSquare(5, "Tokyo Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(15, "London Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(25, "New York Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(35, "Paris Station", 200, [25, 50, 100, 200]));
        squares.push(new UtilitySquare(12, "Electric Company", 150, [4, 10]));
        squares.push(new UtilitySquare(28, "Water Works", 150, [4, 10]));
        squares.push(new TaxSquare(4, "Income Tax", 200));
        squares.push(new TaxSquare(38, "Luxury Tax", 100));
        break;
      case "bry":
        squares.push(new CornerSquare(0, "Go"));
        squares.push(new CornerSquare(10, "Detention"));
        squares.push(new CornerSquare(20, "Free Cafe"));
        squares.push(new CornerSquare(30, "Go To Detention", "jail"));
        squares.push(new PropertySquare(1, "Room 6", 60, [2, 10, 30, 90, 160, 250], 50, "brown"));
        squares.push(new PropertySquare(3, "Room 8", 60, [4, 20, 60, 180, 320, 450], 50, "brown"));
        squares.push(new CardSquare(2, "Community Chest", "community"));
        squares.push(new CardSquare(17, "Community Chest", "community"));
        squares.push(new CardSquare(33, "Community Chest", "community"));
        squares.push(new PropertySquare(6, "The Angel Islington", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(8, "Euston Road", 100, [6, 30, 90, 270, 400, 550], 50, "light-blue"));
        squares.push(new PropertySquare(9, "Pentonville Road", 120, [8, 40, 100, 300, 450, 600], 50, "light-blue"));
        squares.push(new CardSquare(7, "Chance", "chance"));
        squares.push(new CardSquare(22, "Chance", "chance"));
        squares.push(new CardSquare(36, "Chance", "chance"));
        squares.push(new PropertySquare(11, "Pall Mall", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(13, "Whitehall", 140, [10, 50, 150, 450, 625, 750], 100, "pink"));
        squares.push(new PropertySquare(14, "Northumberland Avenue", 160, [12, 60, 180, 500, 700, 900], 100, "pink"));
        squares.push(new PropertySquare(16, "Bow Street", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(18, "Marlborough Street", 180, [14, 70, 200, 550, 750, 950], 100, "orange"));
        squares.push(new PropertySquare(19, "Vine Street", 200, [16, 80, 220, 600, 800, 1000], 100, "orange"));
        squares.push(new PropertySquare(21, "Strand", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(23, "Fleet Street", 220, [18, 90, 250, 700, 875, 1050], 150, "red"));
        squares.push(new PropertySquare(24, "Trafalgar Square", 240, [20, 100, 300, 750, 925, 1100], 150, "red"));
        squares.push(new PropertySquare(26, "Leicester Square", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(27, "Coventry Street", 260, [22, 110, 330, 800, 975, 1150], 150, "yellow"));
        squares.push(new PropertySquare(29, "Piccadilly", 280, [24, 120, 360, 850, 1025, 1200], 150, "yellow"));
        squares.push(new PropertySquare(31, "Regent Street", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(32, "Oxford Street", 300, [26, 130, 390, 900, 1100, 1275], 200, "green"));
        squares.push(new PropertySquare(34, "Bond Street", 320, [28, 150, 450, 1000, 1200, 1400], 200, "green"));
        squares.push(new PropertySquare(37, "Cowley", 350, [35, 175, 500, 1100, 1300, 1500], 200, "dark-blue"));
        squares.push(new PropertySquare(39, "Grosvenor", 400, [50, 200, 600, 1400, 1700, 2000], 200, "dark-blue"));
        squares.push(new StationSquare(5, "King's Cross Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(15, "Marylebone Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(25, "Fenchurch St. Station", 200, [25, 50, 100, 200]));
        squares.push(new StationSquare(35, "Liverpool St. Station", 200, [25, 50, 100, 200]));
        squares.push(new UtilitySquare(12, "Electric Company", 150, [4, 10]));
        squares.push(new UtilitySquare(28, "Water Works", 150, [4, 10]));
        squares.push(new TaxSquare(4, "Income Tax", 200));
        squares.push(new TaxSquare(38, "Super Tax", 100));
        break;
      default:
        throw new Error("Board name not recognized");
    }
    // Sort squares by ID
    return squares.sort((a, b) => a.id - b.id);
  }

  getSquares(): Square[] {
    return this.squares;
  }

  getSquareFromIndex(index: number): Square | undefined {
    return this.squares.find((square) => square.id === index);
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
    return this.squares.filter((square) => square instanceof PropertySquare && square.group === group) as PropertySquare[];
  }

  // Get all stations
  getStations(): StationSquare[] {
    return this.squares.filter((square) => square) as StationSquare[];
  }

  // Get all utilities
  getUtilities(): UtilitySquare[] {
    return this.squares.filter((square) => square) as UtilitySquare[];
  }

  // Check if a player owns all properties in a group
  hasMonopoly(playerId: number, group: string, playerOwnedProperties: number[]): boolean {
    const groupProperties = this.getPropertiesByGroup(group);
    return groupProperties.every((property) => playerOwnedProperties.includes(property.id));
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
    const sideLength = totalSquares / 4;

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
    return this.squares.filter((square) => square instanceof PropertySquare);
  }

  // Calculate the mortgage value of a property
  calculateMortgageValue(propertyId: number): number {
    const square = this.getSquareFromIndex(propertyId);
    if (square instanceof PropertySquare) {
      return square.price / 2;
    }
    return 0;
  }

  toJSON() {
    return {
      size: this.size,
      totalSquares: this.totalSquares,
      squares: this.squares.map((square) => square.toJSON()),
    };
  }

  importFromJSON(json: ReturnType<Board["toJSON"]>): void {
    try {
      this.size = json.size;
      this.totalSquares = json.totalSquares || 0;
      this.squares = json.squares.map((square) => {
        switch (square.type) {
          case "property":
            return new PropertySquare(
              (square as PropertySquare).id,
              (square as PropertySquare).name,
              (square as PropertySquare).price,
              (square as PropertySquare).rent,
              (square as PropertySquare).houseCost,
              (square as PropertySquare).group,
            );
          case "station":
            return new StationSquare((square as StationSquare).id, (square as StationSquare).name, (square as StationSquare).price, (square as StationSquare).rent);
          case "utility":
            return new UtilitySquare((square as UtilitySquare).id, (square as UtilitySquare).name, (square as UtilitySquare).price, (square as UtilitySquare).multipliers);
          case "corner":
            return new CornerSquare(square.id, square.name);
          case "tax":
            return new TaxSquare(square.id, square.name, (square as TaxSquare).amount);
          case "card":
            return new CardSquare(square.id, square.name, (square as CardSquare).cardType);
          default:
            throw new Error("Unknown square type");
        }
      });
    } catch (error) {
      console.error("Error importing board from JSON:", error);
      throw new Error("Failed to import board from JSON");
    }
  }
}
