// export interface Player {
//   id: number;
//   position: number;
//   previousPosition?: number;
//   colour: string;
//   money: number;
//   ownedProperties?: Property[];
//   pardons?: number;
// }

export type Edge = "top" | "right" | "bottom" | "left" | "corner" | "";

export type ToastCallback = (message: { title: string; description: string; variant?: "destructive" | "default" }) => void;

export type Message = {
  user: string;
  type?: "system" | "player";
  title: string;
  description: string;
};

export type Group = "brown" | "light-blue" | "pink" | "orange" | "red" | "yellow" | "green" | "dark-blue";

// type SquareType = "property" | "utility" | "station" | "other";

// type BaseSquare = {
//   name: string;
//   type: SquareType;
// };

// type Buyable = BaseSquare & {
//   price: number;
// };

// export type PropertySquare = Buyable & {
//   type: "property";
//   group: Group;
//   rent: number[];
//   houseCost: number;
// };

// export type UtilitySquare = Buyable & {
//   type: "utility";
// };

// export type StationSquare = Buyable & {
//   type: "station";
//   rent: number[];
// };

// export type OtherSquare = BaseSquare & {
//   type: "other";
// };

// export type Square = PropertySquare | UtilitySquare | StationSquare | OtherSquare;

// type BaseChance = {
//   description: string;
//   type: "go" | "pardon" | "jail";
// };

// type RepairsChance = {
//   description: string;
//   type: "repairs";
//   house: number;
//   hotel: number;
// };

// type OtherChance = {
//   description: string;
//   type: "move" | "pay" | "collect" | "back" | "birthday";
//   value: number;
// };

// export type Chance = BaseChance | RepairsChance | OtherChance;
