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
import { Github } from "lucide-react";
import Link from "next/link";
import { useUser } from "~/lib/user-context";
import posthog from "posthog-js";

const formSchema = z.object({
  gameId: z.string().min(4).max(4),
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [idInput, setIdInput] = useState("");

  const { user } = useUser();

  const startNewGame = () => {
    setIsLoading(true);
    // Generate a unique game ID (you might want to use a more robust method in production)
    const gameId = Math.random().toString(10).substring(2, 6);
    posthog.capture("userCreatedGame", {
      gameId,
    });
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
        <h2 className="mb-8 text-xl text-gray-300">Multiplayer Online Monopoly With Extra Capitalism</h2>
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
        <p className="my-4 text-xl text-white">
          Hello {getUserName(user)}! Welcome to the ultimate property trading experience! MOMWEC takes the classic game you know and love to new heights with expanded capitalism features and
          multiplayer action.
        </p>
        <Button onClick={startNewGame} disabled={isLoading} className="px-8 py-6 text-xl">
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
                    <Input className="bg-white" placeholder="Enter Game ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <div className="mt-12">
          <a href="https://github.com/henrybeedham/momwec" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
            <Github size={24} />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
