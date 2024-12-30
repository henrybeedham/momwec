const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

(async () => {
  await app.prepare();

  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  // Store game states (in-memory for simplicity; use a database for production)
  const games = {};

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Joining a game room
    socket.on('joinGame', (gameId) => {
      socket.join(gameId);

      // Send initial state if it exists
      if (games[gameId]) {
        socket.emit('stateUpdate', games[gameId]);
      } else {
        games[gameId] = { players: [], board: {}, turn: null }; // Initialize game
      }

      console.log(`Socket ${socket.id} joined game ${gameId}`);
    });

    // Handle state updates
    socket.on('updateState', ({ gameId, newState }) => {
      if (games[gameId]) {
        games[gameId] = newState; // Update the game state
        io.to(gameId).emit('stateUpdate', newState); // Broadcast the new state
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
})();
