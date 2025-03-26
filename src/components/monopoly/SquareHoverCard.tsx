import {
  PropertySquare,
  Square,
  StationSquare,
  UtilitySquare,
} from "~/models/Square";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

export default function SquareHoverCard({
  square,
  colourClass,
}: {
  square: Square;
  colourClass: string;
}) {
  if (square instanceof PropertySquare) {
    return (
      <>
        <HasPrice square={square} colourClass={colourClass} />
        <div className="mb-1 font-semibold">Rent:</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Houses</TableHead>
              <TableHead>Rent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {square.rent.map((rent, index) => (
              <TableRow key={index}>
                <TableCell>{index === 5 ? "Hotel" : index}</TableCell>
                <TableCell>£{rent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-2">House Cost: £{square.houseCost}</div>
      </>
    );
  }

  if (square instanceof StationSquare) {
    return (
      <>
        <HasPrice square={square} colourClass={colourClass} />
        <div className="mb-1 font-semibold">Rent:</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stations Owned</TableHead>
              <TableHead>Rent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {square.rent.map((rent, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>£{rent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }

  if (square instanceof UtilitySquare) {
    return (
      <>
        <HasPrice square={square} colourClass={colourClass} />
        <div>
          Rent: 4x dice roll if one utility is owned, 10x dice roll if both
          utilities are owned.
        </div>
      </>
    );
  }
}

function HasPrice({
  colourClass,
  square,
}: {
  colourClass: string;
  square: PropertySquare | UtilitySquare | StationSquare;
}) {
  return (
    <>
      <Badge className={cn(colourClass)}>
        {square instanceof PropertySquare ? square.group : square.type}
      </Badge>
      <div className="font-semibold">Price: £{square.price}</div>
      <Separator className="my-2" />
    </>
  );
}
