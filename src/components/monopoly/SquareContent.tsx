import {
  Zap,
  Train,
  Droplet,
  ArrowLeft,
  Columns4,
  Car,
  Pointer,
  Coins,
  Clover,
} from "lucide-react";
import { cn } from "~/lib/utils";

const sm = "sm:text-xs";

export default function renderSquareContent(squareName: string) {
  switch (squareName) {
    case "Go":
      return (
        <>
          <p className={cn(sm, "rotate-[135deg] text-lg font-bold")}>GO</p>
          <ArrowLeft className="text-green-600" />
        </>
      );
    case "Jail":
      return (
        <>
          <p className={cn(sm, "font-bold")}>JAIL</p>
          <Columns4 />
        </>
      );
    case "Free Parking":
      return (
        <>
          <p className={cn(sm, "font-bold text-red-600")}>FREE</p>
          <Car />
          <p className={cn(sm, "font-bold text-red-600")}>PARKING</p>
        </>
      );
    case "Go To Jail":
      return (
        <>
          <p className={cn(sm, "font-bold")}>GO TO</p>
          <Pointer className="rotate-[-135deg]" />
          <p className={cn(sm, "font-bold")}>JAIL</p>
        </>
      );
    case "Electric Company":
      return (
        <>
          <Zap className="h-8 w-8" />
          <p className={cn(sm, "text-center")}>{squareName}</p>
        </>
      );
    case "Water Works":
      return (
        <>
          <Droplet className="h-8 w-8" />
          <p className={cn(sm, "text-center")}>{squareName}</p>
        </>
      );
    case "Income Tax":
    case "Super Tax":
      return (
        <>
          <Coins className="h-8 w-8" />
          <p className={cn(sm, "text-center")}>{squareName}</p>
        </>
      );
    case "King's Cross Station":
    case "Marylebone Station":
    case "Fenchurch St. Station":
    case "Liverpool St. Station":
      return (
        <>
          <Train className="h-8 w-8" />
          <p className={cn(sm, "text-center")}>{squareName}</p>
        </>
      );
    case "Community Chest":
      return (
        <>
          <p className={cn(sm, "font-bold text-blue-600")}>COMMUNITY</p>
          <p className={cn(sm, "font-bold text-blue-600")}>CHEST</p>
        </>
      );
    case "Chance":
      return (
        <>
          <Clover />
          <p className={cn(sm, "font-bold text-orange-600")}>CHANCE</p>
        </>
      );
    case "Empty":
      return <p className={cn(sm, "font-bold text-gray-400")}>EMPTY</p>;
    default:
      return (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <p className={cn(sm, "text-center")}>{squareName}</p>
          </div>
        </>
      );
  }
}
