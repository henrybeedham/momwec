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
    rent: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
  },
  {
    type: "property",
    name: "Coventry Street",
    group: "yellow",
    price: 260,
    rent: [22, 110, 330, 800, 975, 1150],
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
    rent: [22, 120, 360, 850, 1025, 1200],
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
    rent: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
  },
  {
    type: "property",
    name: "Oxford Street",
    group: "green",
    price: 300,
    rent: [26, 130, 390, 900, 1100, 1275],
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
    rent: [28, 150, 450, 1000, 1200, 1400],
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
    rent: [35, 175, 500, 1100, 1300, 1500],
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
    rent: [50, 200, 600, 1400, 1700, 2000],
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

type BaseChance = {
  description: string;
  type: "go" | "pardon" | "jail";
};

type RepairsChance = {
  description: string;
  type: "repairs";
  house: number;
  hotel: number;
};

type Other = {
  description: string;
  type: "move" | "pay" | "collect" | "back" | "birthday";
  value: number;
};

export type Chance = BaseChance | RepairsChance | Other;

export const chanceCards: Chance[] = [
  {
    description: "Advance to Go",
    type: "go",
  },
  {
    description: "Advance to Pall Mall",
    type: "move",
    value: 11,
  },
  {
    description: "Advance to Marylebone Station",
    type: "move",
    value: 15,
  },
  {
    description: "Advance to Trafalgar Square",
    type: "move",
    value: 24,
  },
  {
    description: "Advance to Mayfair",
    type: "move",
    value: 39,
  },
  {
    description: "Go to Jail",
    type: "jail",
  },
  {
    description: "Pay poor tax of £15",
    type: "pay",
    value: 15,
  },
  {
    description: "Take a trip to King's Cross Station",
    type: "move",
    value: 5,
  },
  {
    description: "Take a walk on the Old Kent Road",
    type: "move",
    value: 1,
  },
  {
    description: "You have been elected chairman of the board",
    type: "collect",
    value: 50,
  },
  {
    description: "Your building loan matures",
    type: "collect",
    value: 150,
  },
  {
    description: "You have won a crossword competition",
    type: "collect",
    value: 100,
  },
  {
    description: "You inherit £100",
    type: "collect",
    value: 100,
  },
  {
    description: "You are assessed for street repairs",
    type: "repairs",
    house: 40,
    hotel: 115,
  },
  {
    description: "You have won second prize in a beauty contest",
    type: "collect",
    value: 10,
  },
  {
    description: "Bank pays you dividend of £50",
    type: "collect",
    value: 50,
  },
  {
    description: "Get out of jail free",
    type: "pardon",
  },
  {
    description: "Go back 3 spaces",
    type: "back",
    value: 3,
  },
];

export const communityChestCards: Chance[] = [
  {
    description: "Advance to Go",
    type: "go",
  },
  {
    description: "Bank error in your favour",
    type: "collect",
    value: 200,
  },
  {
    description: "Doctor's fee",
    type: "pay",
    value: 50,
  },
  {
    description: "From sale of stock you get £50",
    type: "collect",
    value: 50,
  },
  {
    description: "Get out of jail free",
    type: "pardon",
  },
  {
    description: "Go to jail",
    type: "jail",
  },
  {
    description: "Grand opera night",
    type: "collect",
    value: 50,
  },
  {
    description: "Holiday fund matures",
    type: "collect",
    value: 100,
  },
  {
    description: "Income tax refund",
    type: "collect",
    value: 20,
  },
  {
    description: "It's your birthday",
    type: "birthday",
    value: 10,
  },
  {
    description: "Life insurance matures",
    type: "collect",
    value: 100,
  },
  {
    description: "Pay hospital fees of £100",
    type: "pay",
    value: 100,
  },
  {
    description: "Pay school fees of £50",
    type: "pay",
    value: 50,
  },
  {
    description: "Receive £25 consultancy fee",
    type: "collect",
    value: 25,
  },
  {
    description: "You are assessed for street repairs",
    type: "repairs",
    house: 40,
    hotel: 115,
  },
  {
    description: "You have won second prize in a beauty contest",
    type: "collect",
    value: 10,
  },
  {
    description: "You inherit £100",
    type: "collect",
    value: 100,
  },
  {
    description: "You win £10",
    type: "collect",
    value: 10,
  },
];
