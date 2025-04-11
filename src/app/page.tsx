"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { getUserName } from "~/utils/monopoly";

const formSchema = z.object({
  gameId: z.string().min(4).max(4),
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [idInput, setIdInput] = useState("");

  const { isSignedIn, user, isLoaded } = useUser();

  const startNewGame = () => {
    setIsLoading(true);
    // Generate a unique game ID (you might want to use a more robust method in production)
    const gameId = Math.random().toString(10).substring(2, 6);
    router.push(`/${gameId}`);
  };

  const joinGame = (values: z.infer<typeof formSchema>) => {
    router.push(`/${values.gameId}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: "",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-red-500 to-orange-600">
      <div className="max-w-6xl p-4 text-center">
        <h1 className="text-6xl font-bold text-white">MOMWEC</h1>
        <h2 className="mb-8 text-xl text-gray-300">
          Multiplayer Online Monopoly With Extra Capitalism
        </h2>
        {/* <p className="my-4 text-xl text-white">
          Hello {user?.firstName ?? user?.emailAddresses[0]?.emailAddress} welcome to MOMWEC. The start game button below will yk start a new game. From here, you can either 
        </p> */}
        {/* TODO: FIX THIS */}
        <p className="my-4 text-xl text-white">
          Hello {getUserName(user)}! Welcome to the ultimate property trading
          experience! MOMWEC takes the classic game you know and love to new
          heights with expanded capitalism features and multiplayer action.
        </p>
        <Button
          onClick={startNewGame}
          disabled={isLoading}
          className="px-8 py-6 text-xl"
        >
          {isLoading ? "Creating Game..." : "Start New Game"}
        </Button>
        <p className="my-4 text-lg text-white">or</p>
        <h2 className="mb-8 text-3xl font-bold text-white">Join game</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(joinGame)} className="space-y-8">
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Enter Game ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
