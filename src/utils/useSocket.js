// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const useSocket = (gameId) => {
//   const [socket, setSocket] = useState(null);
//   const [gameState, setGameState] = useState(null);

//   useEffect(() => {
//     const socketInstance = io();

//     // Join the game room
//     socketInstance.emit('joinGame', gameId);

//     // Listen for state updates
//     socketInstance.on('stateUpdate', (newState) => {
//       setGameState(newState);
//     });

//     setSocket(socketInstance);

//     // Clean up on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [gameId]);

//   // Function to send updates
//   const sendUpdate = (newState) => {
//     if (socket) {
//       socket.emit('updateState', { gameId, newState });
//     }
//   };

//   return { gameState, sendUpdate };
// };

// export default useSocket;
