const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://momwec.vercel.app", "http://localhost:3000", "https://ilpa.co.uk"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const { gameId } = socket.handshake.query;
  if (gameId) {
    socket.join(gameId);
    console.log(`Client ${socket.id} joined game ${gameId}`);

    // Listen for game moves
    socket.on("gameMove", (data) => {
      console.log(`Move received in game ${gameId} from ${socket.id}:`, data);
      // Broadcast the move to all other clients in the same room
      socket.to(gameId).emit("gameMove", data);
    });

    socket.on("getGameData", (data) => {
      console.log(`Request for game data received in game ${gameId} from ${socket.id}:`, data);
      // Broadcast the move to all other clients in the same room
      socket.to(gameId).emit("getGameData", data);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  } else {
    console.log(`Client ${socket.id} did not provide a gameId.`);
    socket.disconnect();
  }
});

// Serve a simple message at the root URL
app.get("/", (req, res) => {
  res.send("Socket.IO server is running.");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
