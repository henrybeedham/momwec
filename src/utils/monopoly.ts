// Monopoly UK squares
// export const squares: string[] = [
//   "Go",
//   "Old Kent Road",
//   "Community Chest",
//   "Whitechapel Road",
//   "Income Tax",
//   "Kings Cross Station",
//   "The Angel Islington",
//   "Chance",
//   "Euston Road",
//   "Pentonville Road",
//   "Jail",
//   "Pall Mall",
//   "Electric Company",
//   "Whitehall",
//   "Northumberland Avenue",
//   "Marylebone Station",
//   "Bow Street",
//   "Community Chest",
//   "Marlborough Street",
//   "Vine Street",
//   "Free Parking",
//   "Strand",
//   "Chance",
//   "Fleet Street",
//   "Trafalgar Square",
//   "Fenchurch Street Station",
//   "Leicester Square",
//   "Coventry Street",
//   "Water Works",
//   "Piccadilly",
//   "Go To Jail",
//   "Regent Street",
//   "Oxford Street",
//   "Community Chest",
//   "Bond Street",
//   "Liverpool Street Station",
//   "Chance",
//   "Park Lane",
//   "Super Tax",
//   "Mayfair",
// ];

// New version of the squares thing above but with more information. Same content.
type EntityType = "property" | "utility" | "station" | "other";

type Group =
  | "brown"
  | "light-blue"
  | "pink"
  | "orange"
  | "red"
  | "yellow"
  | "green"
  | "dark-blue";

type BaseSquare = {
  name: string;
  type: EntityType;
};

type Buyable = BaseSquare & {
  price: number;
};

export type PropertySquare = Buyable & {
  type: "property";
  group: Group;
  rent: number[];
  houseCost: number;
};

export type UtilitySquare = Buyable & {
  type: "utility";
};

export type StationSquare = Buyable & {
  type: "station";
  rent: number[];
};

export type OtherSquare = BaseSquare & {
  type: "other";
};

type Square = PropertySquare | UtilitySquare | StationSquare | OtherSquare;
export const squares: Square[] = [
  {
    type: "other",
    name: "Go",
  },
  {
    type: "property",
    name: "Old Kent Road",
    group: "brown",
    price: 60,
    rent: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
  },
  {
    type: "other",
    name: "Community Chest",
  },
  {
    type: "property",
    name: "Whitechapel Road",
    group: "brown",
    price: 60,
    rent: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
  },
  {
    type: "other",
    name: "Income Tax",
  },
  {
    type: "station",
    name: "Kings Cross Station",
    price: 200,
    rent: [25, 50, 100, 200],
  },
  {
    type: "property",
    name: "The Angel Islington",
    group: "light-blue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
  },
  {
    type: "other",
    name: "Chance",
  },
  {
    type: "property",
    name: "Euston Road",
    group: "light-blue",
    price: 100,
    rent: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
  },
  {
    type: "property",
    name: "Pentonville Road",
    group: "light-blue",
    price: 120,
    rent: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
  },
  {
    type: "other",
    name: "Jail",
  },
  {
    type: "property",
    name: "Pall Mall",
    group: "pink",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
  },
  {
    type: "utility",
    name: "Electric Company",
    price: 150,
  },
  {
    type: "property",
    name: "Whitehall",
    group: "pink",
    price: 140,
    rent: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
  },
  {
    type: "property",
    name: "North Avenue",
    group: "pink",
    price: 160,
    rent: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
  },
  {
    type: "station",
    name: "Marylebone Station",
    price: 200,
    rent: [25, 50, 100, 200],
  },
  {
    type: "property",
    name: "Bow Street",
    group: "orange",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
  },
  {
    type: "other",
    name: "Community Chest",
  },
  {
    type: "property",
    name: "Marlb Street",
    group: "orange",
    price: 180,
    rent: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
  },
  {
    type: "property",
    name: "Vine Street",
    group: "orange",
    price: 200,
    rent: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
  },
  {
    type: "other",
    name: "Free Parking",
  },
  {
    type: "property",
    name: "Strand",
    group: "red",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
  },
  {
    type: "other",
    name: "Chance",
  },
  {
    type: "property",
    name: "Fleet Street",
    group: "red",
    price: 220,
    rent: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
  },
  {
    type: "property",
    name: "Trafalgar Square",
    group: "red",
    price: 240,
    rent: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
  },
  {
    type: "station",
    name: "Fenchurch Street Station",
    price: 200,
    rent: [25, 50, 100, 200],
  },
  {
    type: "property",
    name: "Leicester Square",
    group: "yellow",
    price: 260,
    rent: [22,110,330,800,975,1150],
    houseCost: 150,
  },
  {
    type: "property",
    name: "Coventry Street",
    group: "yellow",
    price: 260,
    rent: [22,110,330,800,975,1150],
    houseCost: 150,
  },
  {
    type: "utility",
    name: "Water Works",
    price: 150,
  },
  {
    type: "property",
    name: "Piccadilly",
    group: "yellow",
    price: 280,
    rent: [22,120,360,850,1025,1200],
    houseCost: 150,
  },
  {
    type: "other",
    name: "Go To Jail",
  },
  {
    type: "property",
    name: "Regent Street",
    group: "green",
    price: 300,
    rent: [26,130,390,900,1100,1275],
    houseCost: 200,
  },
  {
    type: "property",
    name: "Oxford Street",
    group: "green",
    price: 300,
    rent: [26,130,390,900,1100,1275],
    houseCost: 200,
  },
  {
    type: "other",
    name: "Community Chest",
  },
  {
    type: "property",
    name: "Bond Street",
    group: "green",
    price: 320,
    rent: [28,150,450,1000,1200,1400],
    houseCost: 200,
  },
  {
    type: "station",
    name: "Liverpool Street Station",
    price: 200,
    rent: [25, 50, 100, 200],
  },
  {
    type: "other",
    name: "Chance",
  },
  {
    type: "property",
    name: "Park Lane",
    group: "dark-blue",
    price: 350,
    rent: [35,175,500,1100,1300,1500],
    houseCost: 200,
  },
  {
    type: "other",
    name: "Super Tax",
  },
  {
    type: "property",
    name: "Mayfair",
    group: "dark-blue",
    price: 400,
    rent: [50,200,600,1400,1700,2000],
    houseCost: 200,
  },
];

export const propertyColors: Record<string, string> = {
  brown: "bg-amber-900",
  "light-blue": "bg-sky-400",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  "dark-blue": "bg-blue-800",
  station: "bg-gray-400",
  utility: "bg-gray-400",
};
