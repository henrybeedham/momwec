import { Player } from "./Player";
import { GameState } from "./GameState";
import { ToastCallback } from "./types";

// Base Card class
export abstract class Card {
  readonly title: string;
  readonly description: string;
  readonly type: string;

  constructor(title: string, description: string, type: string) {
    this.title = title;
    this.description = description;
    this.type = type;
  }

  abstract applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void;

  toJSON(): object {
    return {
      title: this.title,
      description: this.description,
      type: this.type,
    };
  }
}

// MoveCard - Move to a specific location
export class MoveCard extends Card {
  readonly destinationPosition: number;
  readonly collectPassGo: boolean;

  constructor(
    title: string,
    description: string,
    destinationPosition: number,
    collectPassGo = true,
  ) {
    super(title, description, "move");
    this.destinationPosition = destinationPosition;
    this.collectPassGo = collectPassGo;
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    const currentPosition = player.getPosition();

    // Check if we're passing GO
    if (this.collectPassGo && this.destinationPosition < currentPosition) {
      player.addMoney(200);
      toastCallback({
        title: "Passing GO",
        description: "You collected £200 for passing GO!",
      });
    }

    player.setPosition(this.destinationPosition);

    toastCallback({
      title: this.title,
      description: this.description,
    });

    // Handle the square the player lands on
    const square = gameState
      .getBoard()
      .getSquareFromIndex(this.destinationPosition);

    if (square) {
      const diceRoll = gameState.getDice()[0] + gameState.getDice()[1];
      square.handleLanding(player, gameState, diceRoll, toastCallback);
    }
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      destinationPosition: this.destinationPosition,
      collectPassGo: this.collectPassGo,
    };
  }
}

// MoveRelativeCard - Move forward or backward a number of spaces
export class MoveRelativeCard extends Card {
  readonly spaces: number;

  constructor(title: string, description: string, spaces: number) {
    super(title, description, "moveRelative");
    this.spaces = spaces;
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    const currentPosition = player.getPosition();
    const board = gameState.getBoard();
    const totalSquares = board.getTotalSquares();

    let newPosition = (currentPosition + this.spaces) % totalSquares;

    // Handle negative movement (wrapping around)
    if (newPosition < 0) {
      newPosition += totalSquares;
    }

    player.setPosition(newPosition);

    toastCallback({
      title: this.title,
      description: this.description,
    });

    // Get the new square from the board
    const square = board.getSquareFromIndex(newPosition);
    if (square) {
      const diceRoll = gameState.getDice()[0] + gameState.getDice()[1];
      square.handleLanding(player, gameState, diceRoll, toastCallback);
    }
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      spaces: this.spaces,
    };
  }
}

// CollectCard - Collect money
export class CollectCard extends Card {
  readonly amount: number;

  constructor(title: string, description: string, amount: number) {
    super(title, description, "collect");
    this.amount = amount;
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    player.addMoney(this.amount);

    toastCallback({
      title: this.title,
      description: this.description,
    });
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      amount: this.amount,
    };
  }
}

// PayCard - Pay money
export class PayCard extends Card {
  readonly amount: number;

  constructor(title: string, description: string, amount: number) {
    super(title, description, "pay");
    this.amount = amount;
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    player.removeMoney(this.amount);

    toastCallback({
      title: this.title,
      description: this.description,
    });
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      amount: this.amount,
    };
  }
}

// JailCard - Go to jail
export class JailCard extends Card {
  constructor(title: string, description: string) {
    super(title, description, "jail");
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    player.setPosition(10); // Jail position

    toastCallback({
      title: this.title,
      description: this.description,
    });
  }
}

// GetOutOfJailCard - Get out of jail free card
export class GetOutOfJailCard extends Card {
  constructor(title: string, description: string) {
    super(title, description, "pardon");
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    player.addPardon();

    toastCallback({
      title: this.title,
      description: this.description,
    });
  }
}

// PayPerBuildingCard - Pay per house/hotel
export class PayPerBuildingCard extends Card {
  readonly perHouse: number;
  readonly perHotel: number;

  constructor(
    title: string,
    description: string,
    perHouse: number,
    perHotel: number,
  ) {
    super(title, description, "payPerBuilding");
    this.perHouse = perHouse;
    this.perHotel = perHotel;
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    let totalCost = 0;
    let houses = 0;
    let hotels = 0;

    player.getOwnedProperties().forEach((property) => {
      if (property.houses && property.houses < 5) {
        houses += property.houses;
        totalCost += property.houses * this.perHouse;
      } else if (property.houses === 5) {
        hotels += 1;
        totalCost += this.perHotel;
      }
    });

    player.removeMoney(totalCost);

    toastCallback({
      title: this.title,
      description: `${this.description} - Paid £${totalCost} for ${houses} houses and ${hotels} hotels.`,
    });
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      perHouse: this.perHouse,
      perHotel: this.perHotel,
    };
  }
}

// CollectFromPlayersCard - Collect money from all players
export class CollectFromPlayersCard extends Card {
  readonly amount: number;

  constructor(title: string, description: string, amount: number) {
    super(title, description, "birthday");
    this.amount = amount;
  }

  applyEffect(
    player: Player,
    gameState: GameState,
    toastCallback: ToastCallback,
  ): void {
    const players = gameState.getPlayers();
    let totalCollected = 0;

    players.forEach((otherPlayer) => {
      if (otherPlayer.getId() !== player.getId()) {
        otherPlayer.removeMoney(this.amount);
        totalCollected += this.amount;
      }
    });

    player.addMoney(totalCollected);

    toastCallback({
      title: this.title,
      description: `${this.description} - Collected £${totalCollected} from other players.`,
    });
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      amount: this.amount,
    };
  }
}

// CardDeck - Manages a deck of cards
export class CardDeck {
  private cards: Card[];
  private currentIndex: number;

  constructor(cards: Card[]) {
    this.cards = cards;
    this.shuffle();
    this.currentIndex = 0;
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j]!, this.cards[i]!]; // Non-null assertion
    }
  }

  drawCard(): Card {
    const card = this.cards[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    if (!card) {
      throw new Error("No card available to draw");
    }
    return card;
  }

  getCards(): Card[] {
    return this.cards;
  }

  toJSON(): object[] {
    return this.cards.map((card) => card.toJSON());
  }

  static createChanceDeck(): CardDeck {
    return new CardDeck([
      new MoveCard("Advance to GO", "Advance to GO. Collect £200.", 0),
      new MoveCard(
        "Advance to Trafalgar Square",
        "Advance to Trafalgar Square. If you pass GO, collect £200.",
        24,
      ),
      new MoveCard("Advance to Mayfair", "Advance to Mayfair.", 39),
      new MoveCard(
        "Advance to Pall Mall",
        "Advance to Pall Mall. If you pass GO, collect £200.",
        11,
      ),
      new MoveRelativeCard("Go Back 3 Spaces", "Go back 3 spaces.", -3),
      new JailCard(
        "Go to Jail",
        "Go directly to Jail. Do not pass GO. Do not collect £200.",
      ),
      new PayPerBuildingCard(
        "Make general repairs",
        "Make general repairs on all your property. For each house pay £25. For each hotel pay £100.",
        25,
        100,
      ),
      new PayCard("Pay speeding fine", "Pay speeding fine of £15.", 15),
      new CollectCard(
        "Bank pays you dividend",
        "Bank pays you dividend of £50.",
        50,
      ),
      new GetOutOfJailCard(
        "Get Out of Jail Free",
        "This card may be kept until needed or traded.",
      ),
      new CollectFromPlayersCard(
        "It's your birthday",
        "It's your birthday. Collect £10 from each player.",
        10,
      ),
    ]);
  }

  static createCommunityChestDeck(): CardDeck {
    return new CardDeck([
      new MoveCard("Advance to GO", "Advance to GO. Collect £200.", 0),
      new CollectCard(
        "Bank error in your favor",
        "Bank error in your favor. Collect £200.",
        200,
      ),
      new PayCard("Doctor's fee", "Doctor's fee. Pay £50.", 50),
      new CollectCard(
        "From sale of stock you get",
        "From sale of stock you get £50.",
        50,
      ),
      new GetOutOfJailCard(
        "Get Out of Jail Free",
        "This card may be kept until needed or traded.",
      ),
      new JailCard(
        "Go to Jail",
        "Go directly to Jail. Do not pass GO. Do not collect £200.",
      ),
      new CollectFromPlayersCard(
        "Grand Opera Night",
        "Grand Opera Night. Collect £50 from every player for opening night seats.",
        50,
      ),
      new CollectCard(
        "Holiday fund matures",
        "Holiday fund matures. Receive £100.",
        100,
      ),
      new CollectCard(
        "Income tax refund",
        "Income tax refund. Collect £20.",
        20,
      ),
      new CollectCard(
        "Life insurance matures",
        "Life insurance matures. Collect £100.",
        100,
      ),
      new PayCard("Pay hospital fees", "Pay hospital fees of £100.", 100),
      new PayCard("Pay school fees", "Pay school fees of £50.", 50),
      new CollectCard(
        "Receive consultancy fee",
        "Receive consultancy fee of £25.",
        25,
      ),
      new PayPerBuildingCard(
        "You are assessed for street repairs",
        "You are assessed for street repairs. £40 per house. £115 per hotel.",
        40,
        115,
      ),
      new CollectCard(
        "You have won second prize in a beauty contest",
        "You have won second prize in a beauty contest. Collect £10.",
        10,
      ),
      new CollectCard("You inherit", "You inherit £100.", 100),
    ]);
  }
}
