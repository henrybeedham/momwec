"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameState } from "~/models/GameState";
import BoardComponent from "./Board";
import PlayerControls from "./PlayerControls";
import { useToast } from "~/hooks/use-toast";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { getUserName, playerColoursLight } from "~/utils/monopoly";
import Chat from "./Chat";
import { Message } from "~/models/types";
import { PropertySquare } from "~/models/Square";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import PurchaseDialog from "./PurchaseDialog";
import { Trade } from "./TradeDialog";
import TradeProposalDialog from "./TradeProposedDialog";
import { BoardName } from "~/models/Board";
import { useUser } from "~/components/UserProvider";
import posthog from "posthog-js";

const SOCKET_SERVER_URL = "https://socket.ilpa.co.uk";

function GameComponent() {
  const gameRef = useRef<GameState | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [uniqueGameKey, setUniqueGameKey] = useState("");
  const [uniqueMessagesKey, setUniqueMessagesKey] = useState("");
  const { toast } = useToast();
  const { gameId } = useParams<{ gameId: string }>();
  const { user, isLoading } = useUser();

  const sendGameMove = () => {
    const data = gameRef.current?.toJSON();
    if (!data) throw new Error("Game data is null. Cannot send gameMove event.");
    if (socketRef.current) {
      socketRef.current.emit("gameMove", data);
      console.log("Sent gameMove event:", JSON.parse(data));
    } else {
      console.error("Socket connection is not established. (sendGameMove)");
    }
  };

  // Listen for game data from the server
  // and update the game state accordingly
  useEffect(() => {
    if (!user) return; // Early return if no user

    posthog.capture("userJoinedGame", {
      gameId,
    });

    // Establish a Socket.IO connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { gameId },
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server with id:", socketRef.current?.id);
      console.log("Asking for game data/Checking if game exists...");
      socketRef.current?.emit("getGameData", gameId);
    });

    socketRef.current.on("getGameData", () => {
      // Send the new player the game data
      console.log("Received request for game data. Sending data...");
      if (gameRef.current) {
        sendGameMove();
      } else {
        console.error("Game state is null. Cannot send game data.");
      }
    });

    // Listen for 'gameMove' events from the server
    socketRef.current.on("gameMove", (data) => {
      console.log("Received gameMove event:", JSON.parse(data as string));

      const newGame = new GameState();

      newGame.importFromJSON(data);
      gameRef.current = newGame;

      // check if I am a player
      const isUserAPlayer = newGame.getPlayers().some((player) => player.id === user.id);

      const userName = getUserName(user);

      if (!isUserAPlayer) {
        newGame.addPlayer(user.id, userName);
        sendGameMove();
      }

      setUniqueGameKey(newGame?.exportGameState() ?? "");
      setUniqueMessagesKey(newGame?.exportMessagesKey() ?? "");
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [gameId, user]);

  const initialiseGame = useCallback(
    (boardName: BoardName) => {
      const newGame = new GameState(boardName);
      if (!user) return;
      const userName = getUserName(user);
      newGame.addPlayer(user.id, userName);
      gameRef.current = newGame; // Store in ref for immediate access
      setUniqueGameKey(newGame.exportGameState());
      setUniqueMessagesKey(newGame?.exportMessagesKey() ?? "");
    },
    [user],
  );

  const updateGameState = useCallback(
    (action: () => void) => {
      console.log("Updating game state...");
      if (gameRef.current) {
        action();
        sendGameMove();
        setUniqueGameKey(gameRef.current.exportGameState());
        setUniqueMessagesKey(gameRef.current?.exportMessagesKey() ?? "");
      }
    },
    [gameRef.current],
  );

  const playerMove = useCallback(() => {
    updateGameState(() => {
      gameRef.current?.movePlayer((message) => {
        console.log(message.title, message.description);
        gameRef.current?.sendMessage({
          user: gameRef.current.getCurrentPlayer().id,
          type: "system",
          title: message.title,
          description: message.description,
        });
        toast(message);
      });
    });
  }, [updateGameState, gameRef.current]);

  const endTurn = useCallback(() => {
    updateGameState(() => {
      gameRef.current?.endTurn();
    });
  }, [updateGameState, gameRef.current]);

  const buyProperty = useCallback(() => {
    updateGameState(() => {
      const g = gameRef.current;
      if (!g) throw new Error("Game is not initialized");
      const p = g.getSelectedProperty();
      if (!p) throw new Error("No property selected");
      g.sendMessage({
        user: g.getCurrentPlayer().id,
        type: "system",
        title: "Property Purchased",
        description: `You have purchased ${g.getBoard().getSquareFromIndex(p)?.name}`,
      });
      g.buyProperty();
    });
  }, [updateGameState, gameRef.current]);

  const buyHouse = useCallback(
    (propertyId: number) => {
      updateGameState(() => {
        const g = gameRef.current;
        if (!g) throw new Error("Game is not initialized");
        const p = g.getBoard().getSquareFromIndex(propertyId) as PropertySquare;
        if (!p) throw new Error("No property selected");
        g.sendMessage({
          user: g.getCurrentPlayer().id,
          type: "system",
          title: "House Purchased",
          description: `You have purchased a house on ${g.getBoard().getSquareFromIndex(propertyId)?.name}`,
        });
        g.buyHouse(propertyId);
      });
    },
    [updateGameState, gameRef.current],
  );

  const mortgage = useCallback(
    (propertyId: number) => {
      updateGameState(() => {
        const g = gameRef.current;
        if (!g) throw new Error("Game is not initialized");
        g.sendMessage({
          user: g.getCurrentPlayer().id,
          type: "system",
          title: "Property Mortgaged",
          description: `You have mortgaged ${g.getBoard().getSquareFromIndex(propertyId)?.name} for £${(g.getBoard().getSquareFromIndex(propertyId) as PropertySquare).price / 2}`,
        });
        g.mortgage(propertyId);
      });
    },
    [updateGameState, gameRef.current],
  );

  const sendMessage = useCallback(
    (message: Message) => {
      updateGameState(() => {
        gameRef.current?.sendMessage(message);
      });
    },
    [updateGameState, gameRef.current],
  );

  const passProperty = useCallback(() => {
    updateGameState(() => {
      const g = gameRef.current;
      if (!g) throw new Error("Game is not initialized");
      // g.placeBid(g.getCurrentPlayer().id, -1);
      g.setSelectedProperty(null);
    });
  }, [updateGameState, gameRef.current]);

  const proposeTrade = useCallback(
    (trade: Trade) => {
      updateGameState(() => {
        const g = gameRef.current;
        if (!g) throw new Error("Game is not initialized");
        g.proposeTrade(trade);
        g.sendMessage({
          user: trade.proposer,
          type: "system",
          title: "Trade Proposed",
          description: `You have proposed a trade with ${g.getPlayerById(trade.selectedPlayer)?.name}`,
        });
      });
    },
    [updateGameState, gameRef.current],
  );

  const acceptTrade = useCallback(() => {
    updateGameState(() => {
      const g = gameRef.current;
      if (!g) throw new Error("Game is not initialized");
      const trade = g.getProposedTrade();
      if (!trade) throw new Error("No trade proposed");
      g.executeTrade();
      g.sendMessage({
        user: trade.selectedPlayer,
        type: "system",
        title: "Trade Accepted",
        description: `You have accepted a trade with ${g.getPlayerById(trade.proposer)?.name}`,
      });
    });
  }, [updateGameState, gameRef.current]);

  const denyTrade = useCallback(() => {
    updateGameState(() => {
      const g = gameRef.current;
      if (!g) throw new Error("Game is not initialized");
      const trade = g.getProposedTrade();
      if (!trade) throw new Error("No trade proposed");
      g.sendMessage({
        user: trade.selectedPlayer,
        type: "system",
        title: "Trade Denied",
        description: `You have denied a trade with ${g.getPlayerById(trade.proposer ?? "")?.name}`,
      });
      g.setTrade(null);
    });
  }, [updateGameState, gameRef.current]);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "t" && gameRef.current?.getPlayers().length === 1) {
      updateGameState(() => {
        const g = gameRef.current;
        if (!g) throw new Error("Game is not initialized");
        g.addPlayer("testuserid", "TestUser");
        sendGameMove();
        window.removeEventListener("keypress", handleKeyPress);
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  // Show UI to pick board ("uk", "us", "bry")
  if (!gameRef.current) {
    return (
      <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4 text-center text-emerald-800 dark:text-emerald-300">
        <h1 className="text-6xl font-bold">Welcome to Monopoly</h1>
        <p className="text-xl">Choose a board to start a game:</p>
        <div className="flex gap-4">
          <Button onClick={() => initialiseGame("uk")}>UK</Button>
          <Button onClick={() => initialiseGame("us")}>US</Button>
          {/* <Button onClick={() => initialiseGame("bry")}>Bry</Button> */}
          <Button onClick={() => initialiseGame("world")}>World</Button>
        </div>
      </div>
    );
  }

  // Now you can add your conditional return
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-500 p-4">
        <p>You must be signed in to play the game.</p>
      </div>
    );
  }

  if (!uniqueGameKey) {
    return <div>Loading game...</div>;
  }

  if (gameRef.current.getPlayers().length === 1) {
    const gameLink = `https://ilpa.co.uk/${gameId}`;
    // log in green saying if t is pressed, a test user will be added
    console.log("%cPress t to add a test user", "background: #222; color: #bada55");
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4 text-center text-emerald-800 dark:text-emerald-300">
        <h1 className="text-6xl font-bold">Game: {gameId}</h1>
        <h1 className="text-6xl font-bold">Waiting for opponents to join...</h1>
        <p className="text-xl">Share you game code or send link:</p>
        <div className="flex gap-4">
          <Input readOnly className="bg-white text-center text-black" value={gameLink} />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(gameLink);
              toast({
                description: "Link successfully copied",
              });
            }}
          >
            Copy link
          </Button>
        </div>

        <Loader2 className="animate-spin" size={80} color="#000" />
      </div>
    );
  }

  return (
    <div className={`${playerColoursLight[gameRef.current?.getCurrentPlayer().getColour()]} flex min-h-screen items-center justify-center`}>
      <div className="flex flex-col p-4 md:flex-row">
        <PurchaseDialog game={gameRef.current} buyProperty={buyProperty} passProperty={passProperty} key={`Popups-${uniqueGameKey}`} />
        <TradeProposalDialog onAccept={acceptTrade} onDeny={denyTrade} game={gameRef.current} key={`Trade-${uniqueGameKey}`} />
        <PlayerControls
          game={gameRef.current}
          onRollDice={playerMove}
          onEndTurn={endTurn}
          onBuyHouse={buyHouse}
          onMortgage={mortgage}
          proposeTrade={proposeTrade}
          keyPassthrough={`Controls-${uniqueGameKey}`}
        />
        <BoardComponent game={gameRef.current} key={`Board-${uniqueGameKey}`} />
        <Chat game={gameRef.current} onSendMessage={sendMessage} keyPassthrough={`Chat-${uniqueMessagesKey}`} />
      </div>
    </div>
  );
}

export default GameComponent;
