import { propertyColors } from "~/utils/monopoly";
import { GameState } from "./GameState";
import { Player } from "./Player";

import type { Group, ToastCallback } from "~/models/types";

type SquareType =
  | "property"
  | "station"
  | "utility"
  | "tax"
  | "corner"
  | "card";

// Base Square class
export abstract class Square {
  readonly id: number;
  readonly name: string;
  readonly type: SquareType;

  constructor(id: number, name: string, type: SquareType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  abstract handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void;

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
    };
  }
}

// CornerSquare class (Go, Jail, Free Parking, Go to Jail)
export class CornerSquare extends Square {
  readonly action?: string;

  constructor(id: number, name: string, action?: string) {
    super(id, name, "corner");
    this.action = action;
  }

  handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void {
    switch (this.name) {
      case "Go To Jail":
        player.setPosition(10); // Move to jail
        toastCallback({
          title: "Go to Jail",
          description: `Player ${player.id + 1} has been sent to jail!`,
        });
        break;
      case "Free Parking":
        // Free parking action if any
        break;
      case "Go":
        // Additional Go action if needed
        break;
      case "Jail":
        // Just visiting jail
        break;
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      action: this.action,
    };
  }
}

// PropertySquare class
export class PropertySquare extends Square {
  readonly price: number;
  readonly rent: number[];
  readonly houseCost: number;
  readonly group: Group;

  constructor(
    id: number,
    name: string,
    price: number,
    rent: number[],
    houseCost: number,
    group: Group,
  ) {
    super(id, name, "property");
    this.price = price;
    this.rent = rent;
    this.houseCost = houseCost;
    this.group = group;
  }

  handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void {
    const position = player.getPosition();

    // Find if the property is owned by another player
    const owner = gameState
      .getPlayers()
      .filter((p) => p.ownsProperty(position))[0];

    if (owner && owner.id !== player.id) {
      // Property is owned by another player
      if (owner) {
        const property = owner
          .getOwnedProperties()
          .find((p) => p.id === position);
        const rentAmount = this.rent[property?.houses ?? 0] ?? 0;

        if (player.removeMoney(rentAmount)) {
          owner.addMoney(rentAmount);
          toastCallback({
            title: "Rent Paid",
            description: `Player ${player.id + 1} paid £${rentAmount} to Player ${owner.id + 1} for staying at ${this.name}`,
          });
        } else {
          toastCallback({
            title: "Insufficient Funds",
            description: `Player ${player.id + 1} cannot afford to pay rent of £${rentAmount} to Player ${owner.id + 1}`,
            variant: "destructive",
          });
        }
      }
    } else if (!owner) {
      // Property is not owned, offer to buy
      gameState.setSelectedProperty(position);
    }
  }

  calculateRent(houses: number): number {
    return this.rent[houses] ?? 0;
  }

  getPropertyColour(): string {
    return propertyColors[this.group] ?? "bg-gray-500";
  }

  toJSON() {
    return {
      ...super.toJSON(),
      price: this.price,
      rent: this.rent,
      houseCost: this.houseCost,
      group: this.group,
    };
  }
}

// StationSquare class
export class StationSquare extends Square {
  readonly price: number;
  readonly rent: number[];

  constructor(id: number, name: string, price: number, rent: number[]) {
    super(id, name, "station");
    this.price = price;
    this.rent = rent;
  }

  handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void {
    const position = player.getPosition();

    // Find if the station is owned by another player
    const ownerIndex = gameState
      .getPlayers()
      .findIndex((p) => p.id !== player.id && p.ownsProperty(position));

    if (ownerIndex >= 0) {
      // Station is owned by another player
      const owner = gameState.getPlayers()[ownerIndex];
      if (owner) {
        // Calculate rent based on how many stations the owner has
        const stationCount = owner.getPropertyCount("station");
        const rentAmount = this.rent[Math.min(stationCount - 1, 3)] ?? 0;

        if (player.removeMoney(rentAmount)) {
          owner.addMoney(rentAmount);
          toastCallback({
            title: "Rent Paid",
            description: `Player ${player.id + 1} paid £${rentAmount} to Player ${owner.id + 1} for staying at ${this.name}`,
          });
        } else {
          toastCallback({
            title: "Insufficient Funds",
            description: `Player ${player.id + 1} cannot afford to pay rent of £${rentAmount} to Player ${owner.id + 1}`,
            variant: "destructive",
          });
        }
      }
    } else {
      // Station is not owned, offer to buy
      gameState.setSelectedProperty(position);
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      price: this.price,
      rent: this.rent,
    };
  }
}

// UtilitySquare class
export class UtilitySquare extends Square {
  readonly price: number;
  readonly multipliers: number[];

  constructor(id: number, name: string, price: number, multipliers: number[]) {
    super(id, name, "utility");
    this.price = price;
    this.multipliers = multipliers;
  }

  handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void {
    const position = player.getPosition();

    // Find if the utility is owned by another player
    const ownerIndex = gameState
      .getPlayers()
      .findIndex((p) => p.id !== player.id && p.ownsProperty(position));

    if (ownerIndex >= 0) {
      // Utility is owned by another player
      const owner = gameState.getPlayers()[ownerIndex];

      if (owner) {
        // Calculate rent based on how many utilities the owner has
        const utilityCount = owner.getPropertyCount("utility");
        const multiplier = this.multipliers[Math.min(utilityCount - 1, 1)] ?? 1;
        const rentAmount = multiplier * diceRoll;

        if (player.removeMoney(rentAmount)) {
          owner.addMoney(rentAmount);
          toastCallback({
            title: "Rent Paid",
            description: `Player ${player.id + 1} paid £${rentAmount} to Player ${owner.id + 1} for staying at ${this.name}`,
          });
        } else {
          toastCallback({
            title: "Insufficient Funds",
            description: `Player ${player.id + 1} cannot afford to pay rent of £${rentAmount} to Player ${owner.id + 1}`,
            variant: "destructive",
          });
        }
      }
    } else {
      // Utility is not owned, offer to buy
      gameState.setSelectedProperty(position);
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      price: this.price,
      multipliers: this.multipliers,
    };
  }
}

// TaxSquare class
export class TaxSquare extends Square {
  readonly amount: number;

  constructor(id: number, name: string, amount: number) {
    super(id, name, "tax");
    this.amount = amount;
  }

  handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void {
    player.removeMoney(this.amount);
    toastCallback({
      title: "Tax Paid",
      description: `Player ${player.id + 1} paid £${this.amount} in ${this.name}`,
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      amount: this.amount,
    };
  }
}

// CardSquare class (Chance or Community Chest)
export class CardSquare extends Square {
  readonly cardType: string;

  constructor(id: number, name: string, cardType: string) {
    super(id, name, "card");
    this.cardType = cardType;
  }

  handleLanding(
    player: Player,
    gameState: GameState,
    diceRoll: number,
    toastCallback: ToastCallback,
  ): void {
    const card =
      this.cardType === "community"
        ? gameState.getBoard().drawCommunityChestCard()
        : gameState.getBoard().drawChanceCard();

    card.applyEffect(player, gameState, toastCallback);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      cardType: this.cardType,
    };
  }
}

export type AllSquares =
  | Square
  | CornerSquare
  | PropertySquare
  | StationSquare
  | UtilitySquare
  | TaxSquare
  | CardSquare;
