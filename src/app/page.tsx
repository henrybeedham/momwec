"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserName } from "~/utils/monopoly";
import { Github, DollarSign, Users, Dice1Icon as Dice, Building, Loader2, PoundSterling } from "lucide-react";
import { useUser } from "~/components/UserProvider";
import posthog from "posthog-js";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import JoinForm from "~/components/monopoly/CreateAccount";
import Profile from "~/components/monopoly/Profile";

const formSchema = z.object({
  gameId: z.string().min(4).max(4),
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: userLoading } = useUser();

  const startNewGame = () => {
    setIsLoading(true);
    // Generate a unique game ID
    const gameId = Math.random().toString(10).substring(2, 6);
    posthog.capture("userCreatedGame", {
      gameId,
    });
    router.push(`/${gameId}`);
  };

  const joinGame = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    router.push(`/${values.gameId}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: "",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PoundSterling className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300">MOMWEC</h1>
          </div>
          <div className="flex items-center gap-4">
            <Profile />
            <a
              href="https://github.com/henrybeedham/momwec"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <Github size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tighter text-emerald-900 dark:text-emerald-100 sm:text-5xl md:text-6xl">
              Multiplayer Online Monopoly With Extra Capitalism
            </h2>
            <p className="mb-6 text-lg text-slate-700 dark:text-slate-300">
              Hello {getUserName(user)}! Welcome to the ultimate property trading experience! MOMWEC takes the classic game you know and love to new heights with expanded capitalism features and
              multiplayer action.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                <Building className="mb-2 h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <span className="text-center text-sm font-medium">Property Empire</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                <Users className="mb-2 h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <span className="text-center text-sm font-medium">Multiplayer</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                <Dice className="mb-2 h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <span className="text-center text-sm font-medium">Strategic Play</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-emerald-200 shadow-md dark:border-slate-700">
              {!!user ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-center text-2xl text-emerald-800 dark:text-emerald-300">Join the Game</CardTitle>
                    <CardDescription className="text-center">Create a new game or join an existing one</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={startNewGame} disabled={isLoading} className="w-full bg-emerald-600 py-6 text-lg font-medium hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                      {isLoading ? "Creating Game..." : "Start New Game"}
                    </Button>
                    <div className="relative flex items-center py-2">
                      <Separator className="flex-1" />
                      <span className="mx-2 text-xs text-slate-500 dark:text-slate-400">OR</span>
                      <Separator className="flex-1" />
                    </div>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(joinGame)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="gameId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="bg-white py-6 text-lg dark:bg-slate-800" placeholder="Enter 4-digit Game ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-slate-800 py-6 text-lg font-medium hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">
                          {isLoading ? <Loader2 className="animate-spin" /> : "Join Game"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center text-sm text-slate-500 dark:text-slate-400">Play with friends from anywhere in the world</CardFooter>
                </>
              ) : (
                <JoinForm />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
