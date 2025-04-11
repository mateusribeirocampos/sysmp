// Este arquivo exporta a instância do Socket.IO para ser usada em outros arquivos

import { Server } from 'socket.io';
let io;

// Função para inicializar o Socket.IO
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["https://sysmp.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST"],
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
};

// Exporta a instância do io (será definida após a inicialização)
export { io };