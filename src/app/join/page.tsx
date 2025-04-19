"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { UserIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useUser } from "~/lib/user-context";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function JoinForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading, login } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user is found, redirect to home page
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Initialize react-hook-form with Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Generate a random user ID
      const userId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

      // Create user object
      const userData = {
        id: userId,
        username: values.username,
        createdAt: new Date().toISOString(),
      };

      // Use the login function from context
      login(userData);

      // Show success message
      toast({
        title: "Welcome aboard!",
        description: `Great to have you here, ${values.username}!`,
      });
      router.push("/");

      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-500 to-orange-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Join Us</CardTitle>
          <CardDescription className="text-center">Choose a username to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Get Started"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="text-center w-full">We'll create a unique profile ID for you automatically</div>
        </CardFooter>
      </Card>
    </div>
  );
}
