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
type propertyType = "property" | "utility" | "station" | "other";
type group =
  | "brown"
  | "light-blue"
  | "pink"
  | "orange"
  | "red"
  | "yellow"
  | "green"
  | "dark-blue"
  | "utility"
  | "station";
export const squares: { type: propertyType; name: string; group?: group }[] = [
  {
    type: "other",
    name: "Go",
  },
  {
    type: "property",
    name: "Old Kent Road",
    group: "brown",
  },
  {
    type: "other",
    name: "Community Chest",
  },
  {
    type: "property",
    name: "Whitechapel Road",
    group: "brown",
  },
  {
    type: "other",
    name: "Income Tax",
  },
  {
    type: "station",
    name: "Kings Cross Station",
    group: "station",
  },
  {
    type: "property",
    name: "The Angel Islington",
    group: "light-blue",
  },
  {
    type: "other",
    name: "Chance",
  },
  {
    type: "property",
    name: "Euston Road",
    group: "light-blue",
  },
  {
    type: "property",
    name: "Pentonville Road",
    group: "light-blue",
  },
  {
    type: "other",
    name: "Jail",
  },
  {
    type: "property",
    name: "Pall Mall",
    group: "pink",
  },
  {
    type: "utility",
    name: "Electric Company",
    group: "utility",
  },
  {
    type: "property",
    name: "Whitehall",
    group: "pink",
  },
  {
    type: "property",
    name: "North Avenue",
    group: "pink",
  },
  {
    type: "station",
    name: "Marylebone Station",
    group: "station",
  },
  {
    type: "property",
    name: "Bow Street",
    group: "orange",
  },
  {
    type: "other",
    name: "Community Chest",
  },
  {
    type: "property",
    name: "Marlborough Street",
    group: "orange",
  },
  {
    type: "property",
    name: "Vine Street",
    group: "orange",
  },
  {
    type: "other",
    name: "Free Parking",
  },
  {
    type: "property",
    name: "Strand",
    group: "red",
  },
  {
    type: "other",
    name: "Chance",
  },
  {
    type: "property",
    name: "Fleet Street",
    group: "red",
  },
  {
    type: "property",
    name: "Trafalgar Square",
    group: "red",
  },
  {
    type: "station",
    name: "Fenchurch Street Station",
    group: "station",
  },
  {
    type: "property",
    name: "Leicester Square",
    group: "yellow",
  },
  {
    type: "property",
    name: "Coventry Street",
    group: "yellow",
  },
  {
    type: "utility",
    name: "Water Works",
    group: "utility",
  },
  {
    type: "property",
    name: "Piccadilly",
    group: "yellow",
  },
  {
    type: "other",
    name: "Go To Jail",
  },
  {
    type: "property",
    name: "Regent Street",
    group: "green",
  },
  {
    type: "property",
    name: "Oxford Street",
    group: "green",
  },
  {
    type: "other",
    name: "Community Chest",
  },
  {
    type: "property",
    name: "Bond Street",
    group: "green",
  },
  {
    type: "station",
    name: "Liverpool Street Station",
    group: "station",
  },
  {
    type: "other",
    name: "Chance",
  },
  {
    type: "property",
    name: "Park Lane",
    group: "dark-blue",
  },
  {
    type: "other",
    name: "Super Tax",
  },
  {
    type: "property",
    name: "Mayfair",
    group: "dark-blue",
  },
];

export const propertyColors: Record<string, string> = {
  brown: "bg-amber-900",
  "light-blue": "bg-sky-400",
  pink: "bg-pink-400",
  orange: "bg-orange-400",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-400",
  "dark-blue": "bg-blue-600",
  station: "bg-gray-400",
  utility: "bg-gray-400",
};
