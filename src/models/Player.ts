import { Board } from "./Board";
import { PropertySquare, StationSquare, UtilitySquare } from "./Square";
import { Group } from "./types";

export class Player {
  readonly id: string;
  readonly name: string;
  private position: number;
  private previousPosition?: number;
  private colour: string;
  private money: number;
  private ownedProperties: Array<{ id: number; houses?: number }>;
  private pardons: number;
  private board: Board;

  constructor(
    id: string,
    name: string,
    colour: string,
    board: Board,
    initialMoney = 1500,
  ) {
    this.id = id;
    this.name = name;
    this.position = 0;
    this.colour = colour;
    this.money = initialMoney;
    this.ownedProperties = [];
    this.pardons = 0;
    this.board = board;
  }

  // Getters

  getPosition(): number {
    return this.position;
  }

  getPreviousPosition(): number | undefined {
    return this.previousPosition;
  }

  getColour(): string {
    return this.colour;
  }

  getMoney(): number {
    return this.money;
  }

  getOwnedProperties(): Array<{ id: number; houses?: number }> {
    return this.ownedProperties;
  }

  getPardons(): number {
    return this.pardons;
  }

  // Setters
  setPosition(position: number): void {
    this.previousPosition = this.position;
    this.position = position;
  }

  setOwnedProperties(properties: Array<{ id: number; houses?: number }>): void {
    this.ownedProperties = properties;
  }

  setPreviousPosition(position: number | undefined): void {
    this.previousPosition = position;
  }

  setPardons(pardons: number): void {
    this.pardons = pardons;
  }

  setMoney(money: number): void {
    this.money = money;
  }

  // Player actions
  moveForward(steps: number): void {
    this.previousPosition = this.position;
    this.position = this.board.getPositionAfterMove(this.position, steps);
  }

  addMoney(amount: number): void {
    this.money += amount;
  }

  removeMoney(amount: number): boolean {
    if (this.money >= amount) {
      this.money -= amount;
      return true;
    }
    return false;
  }

  addProperty(propertyId: number): void {
    this.ownedProperties.push({ id: propertyId });
  }

  ownsProperty(propertyId: number): boolean {
    return this.ownedProperties.some((property) => property.id === propertyId);
  }

  ownsPropertyGroup(group: Group): boolean {
    return !this.board
      .getPropertiesByGroup(group)
      .some((property) => !this.ownsProperty(property.id));
  }

  buyProperty(square: PropertySquare | StationSquare | UtilitySquare): boolean {
    if (this.money >= square.price) {
      this.money -= square.price;
      this.addProperty(square.id);
      return true;
    }
    return false;
  }

  buyHouse(property: PropertySquare): boolean {
    const ownedProperty = this.ownedProperties.find(
      (prop) => prop.id === property.id,
    );

    if (!ownedProperty) return false;
    if (this.money < property.houseCost) return false;
    if ((ownedProperty.houses ?? 0) >= 5) return false;

    this.money -= property.houseCost;
    ownedProperty.houses = (ownedProperty.houses ?? 0) + 1;

    return true;
  }

  getPropertyCount(propertyType: string): number {
    return this.ownedProperties.filter((property) => {
      const square = this.board.getSquareFromIndex(property.id);
      return square && square.type === propertyType;
    }).length;
  }

  addPardon(): void {
    this.pardons += 1;
  }

  usePardon(): boolean {
    if (this.pardons > 0) {
      this.pardons -= 1;
      return true;
    }
    return false;
  }

  passedGo(): boolean {
    if (this.previousPosition === undefined) return false;
    return this.previousPosition > this.position && this.position !== 10; // Not if sent to jail
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      colour: this.colour,
      money: this.money,
      ownedProperties: this.ownedProperties,
      pardons: this.pardons,
      previousPosition: this.previousPosition,
    };
  }
}
