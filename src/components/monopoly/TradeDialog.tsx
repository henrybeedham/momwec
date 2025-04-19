"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, PoundSterling } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { GameState } from "~/models/GameState";
import { BuyableSquare, PropertySquare } from "~/models/Square";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Player } from "~/models/Player";
import { useToast } from "~/hooks/use-toast";
import { useUser } from "~/components/UserProvider";

// Define schema for the form
const tradeFormSchema = z.object({
  selectedPlayer: z.string().min(1, "Please select a player"),
  giveProperties: z.array(z.number()).default([]),
  getProperties: z.array(z.number()).default([]),
  giveMoney: z.union([z.number().nonnegative("Amount must be zero or positive"), z.null()]).default(null),
  getMoney: z.union([z.number().nonnegative("Amount must be zero or positive"), z.null()]).default(null),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;
export type Trade = TradeFormValues & {
  proposer: string;
};

// Property list component to avoid repetition
function PropertyList({
  properties,
  playerProperties,
  onToggle,
  checkedIds,
  type,
  formField,
}: {
  properties: (BuyableSquare | null)[];
  playerProperties: ReturnType<Player["getOwnedProperties"]>;
  onToggle: (id: number) => void;
  checkedIds: number[];
  type: "give" | "get";
  formField: any;
}) {
  if (properties.length === 0) {
    return <p className="text-sm text-muted-foreground">No properties available to trade.</p>;
  }

  return (
    <div className="space-y-2 max-h-30 overflow-y-auto">
      {properties.map((property) => {
        if (!property) return null;
        const isProperty = property instanceof PropertySquare;
        const playerProperty = playerProperties.find((p) => p.id === property.id);

        return (
          <div key={property.id} className="flex items-center space-x-2">
            <Checkbox id={`${type}-square-${property.id}`} checked={checkedIds.includes(property.id)} onCheckedChange={() => onToggle(property.id)} {...formField} />
            <Label htmlFor={`${type}-square-${property.id}`} className="flex flex-1 items-center justify-between cursor-pointer text-sm">
              <div className="flex items-center gap-2">
                {isProperty && <div className={`w-3 h-3 rounded-full ${property.getPropertyColour()}`} />}
                <span>{property.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {!!playerProperty?.houses && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {playerProperty.houses}
                  </Badge>
                )}
                <Badge variant="secondary">${isProperty ? property.calculateValue(playerProperty?.houses ?? 0) : property.price}</Badge>
              </div>
            </Label>
          </div>
        );
      })}
    </div>
  );
}

type TradeDialogProps = {
  game: GameState;
  proposeTrade: (trade: Trade) => void;
};

export default function TradeDialog({ game, proposeTrade }: TradeDialogProps) {
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      selectedPlayer: "",
      giveProperties: [],
      getProperties: [],
      giveMoney: null,
      getMoney: null,
    },
  });

  const { toast } = useToast();

  const { user, isLoading } = useUser();
  if (!user) {
    return null;
  }

  const players = game.getPlayers();
  const me = game.getPlayerById(user.id);
  if (!me) {
    console.error("Player not found");
    throw new Error("Player not found");
  }
  const myProperties = me.getOwnedProperties() || [];

  const selectedPlayer = form.watch("selectedPlayer");
  const selectedPlayerData = game.getPlayerById(selectedPlayer);
  const selectedPlayerProperties = selectedPlayerData?.getOwnedProperties() || [];

  const giveProperties = form.watch("giveProperties");
  const getProperties = form.watch("getProperties");

  // Get actual property objects
  const myPropertyObjects = myProperties.map((p) => game.getBoard().getSquareFromIndex(p.id) as BuyableSquare).filter(Boolean);

  const theirPropertyObjects = selectedPlayerProperties.map((p) => game.getBoard().getSquareFromIndex(p.id) as BuyableSquare).filter(Boolean);

  const handleGivePropertyToggle = (propertyId: number) => {
    const currentValues = form.getValues("giveProperties");
    const newValues = currentValues.includes(propertyId) ? currentValues.filter((id) => id !== propertyId) : [...currentValues, propertyId];
    form.setValue("giveProperties", newValues, { shouldValidate: true });
  };

  const handleGetPropertyToggle = (propertyId: number) => {
    const currentValues = form.getValues("getProperties");
    const newValues = currentValues.includes(propertyId) ? currentValues.filter((id) => id !== propertyId) : [...currentValues, propertyId];
    form.setValue("getProperties", newValues, { shouldValidate: true });
  };

  const resetTrade = () => {
    form.reset({
      selectedPlayer: "",
      giveProperties: [],
      getProperties: [],
      giveMoney: 0,
      getMoney: 0,
    });
  };

  const handlePlayerChange = (value: string) => {
    form.setValue("selectedPlayer", value, { shouldValidate: true });
    form.setValue("giveProperties", [], { shouldValidate: true });
    form.setValue("getProperties", [], { shouldValidate: true });
    form.setValue("giveMoney", 0, { shouldValidate: true });
    form.setValue("getMoney", 0, { shouldValidate: true });
  };

  const calculateTotalGive = () => {
    const propertiesValue = giveProperties.reduce((sum, id) => {
      const property = game.getBoard().getSquareFromIndex(Number(id)) as BuyableSquare;
      if (!property) return sum;

      if (property instanceof PropertySquare) {
        const playerProperty = myProperties.find((p) => p.id === property.id);
        sum += property.houseCost * (playerProperty?.houses ?? 0);
      }
      return sum + (property?.price || 0);
    }, 0);
    return propertiesValue + (form.watch("giveMoney") || 0);
  };

  const calculateTotalGet = () => {
    const propertiesValue = getProperties.reduce((sum, id) => {
      const property = game.getBoard().getSquareFromIndex(Number(id)) as BuyableSquare;
      if (!property) return sum;

      if (property instanceof PropertySquare) {
        const playerProperty = selectedPlayerProperties.find((p) => p.id === property.id);
        sum += property.houseCost * (playerProperty?.houses ?? 0);
      }
      return sum + (property?.price || 0);
    }, 0);
    return propertiesValue + (form.watch("getMoney") || 0);
  };

  const onSubmit = (data: TradeFormValues) => {
    if (!selectedPlayerData) {
      console.error("Selected player not found.");
      resetTrade();
      return;
    }
    if ((data.giveMoney ?? 0) > (me.getMoney() < 0 ? 0 : me.getMoney()) || (data.getMoney ?? 0) > (selectedPlayerData?.getMoney() < 0 ? 0 : selectedPlayerData?.getMoney())) {
      toast({
        title: "Trade Error",
        description: "You cannot give more money than you have.",
        variant: "destructive",
      });
      resetTrade();
      return;
    }
    console.log("Trade proposal:", data);
    proposeTrade({ ...data, proposer: user.id });
    resetTrade();
  };

  const isTradeDisabled = !!game.getProposedTrade();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isTradeDisabled}>{isTradeDisabled ? "Someone is already trading" : "Trade"}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader className="mb-4">
              <AlertDialogTitle>Trade Properties and Money</AlertDialogTitle>
              <AlertDialogDescription>Select a player to trade with and choose what to give and what to get.</AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="player" className="min-w-24">
                  Trade with:
                </Label>
                <FormField
                  control={form.control}
                  name="selectedPlayer"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select value={field.value} onValueChange={handlePlayerChange}>
                        <SelectTrigger id="player" className="w-full">
                          <SelectValue placeholder="Select a player" />
                        </SelectTrigger>
                        <SelectContent>
                          {players
                            .filter((p) => p.id !== user.id)
                            .map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${player.getColour()}`} />
                                  <span>{player.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedPlayer && (
                <div className="flex flex-col gap-4">
                  {/* What you give */}
                  <Card className="border-red-200">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 text-red-600">What You Give</h3>
                      {/* Properties */}
                      <div className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="giveProperties"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <PropertyList
                                  properties={myPropertyObjects}
                                  playerProperties={myProperties}
                                  onToggle={handleGivePropertyToggle}
                                  checkedIds={giveProperties}
                                  type="give"
                                  formField={field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <h3 className="text-lg font-semibold mt-2 text-red-600">and</h3>
                      {/* Money */}
                      <div className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="giveMoney"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <PoundSterling className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Enter amount"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value === "" ? null : parseInt(e.target.value);
                                      field.onChange(value);
                                    }}
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4 text-right">
                        <p className="text-sm text-muted-foreground">Total value: £{calculateTotalGive()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* What you get */}
                  <Card className="border-green-200">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 text-green-600">What You Get</h3>
                      {/* Properties */}
                      <div className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="getProperties"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <PropertyList
                                  properties={theirPropertyObjects}
                                  playerProperties={selectedPlayerProperties}
                                  onToggle={handleGetPropertyToggle}
                                  checkedIds={getProperties}
                                  type="get"
                                  formField={field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <h3 className="text-lg font-semibold mt-2 text-green-600">and</h3>
                      {/* Money */}
                      <div className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="getMoney"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <PoundSterling className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Enter amount"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value === "" ? null : parseInt(e.target.value);
                                      field.onChange(value);
                                    }}
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4 text-right">
                        <p className="text-sm text-muted-foreground">Total value: £{calculateTotalGet()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <AlertDialogFooter className="pt-4">
              <AlertDialogCancel onClick={resetTrade} type="button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={!selectedPlayer || (!giveProperties.length && !getProperties.length && !form.watch("giveMoney") && !form.watch("getMoney"))}>
                Propose Trade
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
