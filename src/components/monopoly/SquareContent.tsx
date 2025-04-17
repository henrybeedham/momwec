import { Zap, Train, Droplet, ArrowLeft, Columns4, Car, Pointer, Clover, PoundSterling } from "lucide-react";
import { cn } from "~/lib/utils";
import { Square } from "~/models/Square";

export default function renderSquareContent(square: Square) {
  const { name, type } = square;

  // Handle corner squares
  if (type === "corner") {
    switch (name) {
      case "Go":
        return (
          <>
            <p className={cn("rotate-[135deg] text-lg font-bold")}>GO</p>
            <ArrowLeft className="text-green-600" />
          </>
        );
      case "Jail":
        return (
          <>
            <p className={cn("font-bold")}>JAIL</p>
            <Columns4 />
          </>
        );
      case "Free Parking":
        return (
          <>
            <p className={cn("font-bold text-red-600")}>FREE</p>
            <Car />
            <p className={cn("font-bold text-red-600")}>PARKING</p>
          </>
        );
      case "Go To Jail":
        return (
          <>
            <p className={cn("font-bold")}>GO TO</p>
            <Pointer className="rotate-[-135deg]" />
            <p className={cn("font-bold")}>JAIL</p>
          </>
        );
      default:
        return <p className={cn("font-bold text-gray-400")}>{name}</p>;
    }
  }

  // Handle utility squares
  if (type === "utility") {
    switch (name) {
      case "Electric Company":
        return (
          <>
            <Zap className="h-8 w-8" />
            <p className={cn("text-center")}>{name}</p>
          </>
        );
      case "Water Works":
        return (
          <>
            <Droplet className="h-8 w-8" />
            <p className={cn("text-center")}>{name}</p>
          </>
        );
      default:
        return (
          <>
            <Zap className="h-8 w-8" />
            <p className={cn("text-center")}>{name}</p>
          </>
        );
    }
  }

  // Handle tax squares
  if (type === "tax") {
    return (
      <>
        <PoundSterling className="h-8 w-8" />
        <p className={cn("text-center")}>{name}</p>
      </>
    );
  }

  // Handle card squares
  if (type === "card") {
    switch (name) {
      case "Community Chest":
        return (
          <>
            <p className={cn("font-bold text-blue-600")}>COMMUNITY</p>
            <p className={cn("font-bold text-blue-600")}>CHEST</p>
          </>
        );
      case "Chance":
        return (
          <>
            <Clover />
            <p className={cn("font-bold text-orange-600")}>CHANCE</p>
          </>
        );
      default:
        return <p className={cn("font-bold")}>{name}</p>;
    }
  }

  // Handle station squares
  if (type === "station") {
    return (
      <>
        <Train className="h-8 w-8" />
        <p className={cn("text-center")}>{name}</p>
      </>
    );
  }

  // Default fallback
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className={cn("text-center")}>{name}</p>
    </div>
  );
}
