import { GameState } from "~/models/GameState";
import { Message } from "~/models/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import PlayerTab from "./PlayerTab";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useUser } from "~/components/UserProvider";

interface ChatProps {
  game: GameState;
  onSendMessage: (message: Message) => void;
  keyPassthrough: string;
}

function Chat({ game, onSendMessage, keyPassthrough }: ChatProps) {
  const messages = [...game.getMessages()].reverse();
  const { user, isLoading } = useUser();
  const [message, setMessage] = useState("");

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage({
        user: user.id,
        title: "Message",
        description: message,
      });
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden rounded-xl">
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: "linear-gradient(to top, rgba(255, 255, 255, 1), transparent)",
            pointerEvents: "none", // Prevents blocking interactions
            zIndex: 10,
          }}
        />
        <Card
          key={keyPassthrough}
          className="relative flex pr-2"
          style={{
            height: "calc(100vh - 200px)",
            overflowY: "scroll",
          }}
        >
          <div className="w-full space-y-2 p-2">
            {messages.map((message, index) => {
              const p = game.getPlayerById(message.user);
              return (
                <Card key={index} className="border shadow-sm inset-shadow-black">
                  <CardHeader className="flex flex-row items-center gap-2 px-3 py-2">
                    <PlayerTab size={4} colour={p?.getColour() ?? "bg-black"} />
                    <div>
                      <h3 className="text-sm font-medium">{message.type === "system" ? `System: ${p?.name}` : p?.name}</h3>
                      <p className="text-muted-foreground text-xs">{message.title}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 py-1">
                    <p className="text-xs">{message.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-2 border-t shadow-sm">
        <CardContent className="flex flex-row items-center gap-2 p-2">
          <PlayerTab size={4} colour={game.getPlayerById(user.id)?.getColour() ?? "bg-black"} />
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="text-sm"
          />
          <Button size="sm" onClick={handleSendMessage}>
            Send
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Chat;
