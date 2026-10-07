// Este arquivo exporta a instância do Socket.IO para ser usada em outros arquivos

import { Server } from 'socket.io';
import { ValidateToken } from './middleware/auth.js';
let io;

// Função para inicializar o Socket.IO
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["https://sysmp.vercel.app", "http://localhost:5173"],
      methods: ["GET", "POST"],
    }
  });

  io.use(async (socket, next) => {
    const req = { headers: { authorization: `Bearer ${socket.handshake.auth?.token || ''}` } };
    const res = { status() { return this; }, json() { next(new Error('Autenticação necessária')); } };
    await ValidateToken(req, res, () => { socket.data.user = req.user; next(); });
  });

  io.on('connection', (socket) => {
    const expiresIn = Math.max(0, socket.data.user.exp * 1000 - Date.now());
    const expiryTimer = setTimeout(() => socket.disconnect(true), expiresIn);
    expiryTimer.unref();
    socket.on('disconnect', () => clearTimeout(expiryTimer));
    console.log('Cliente conectado:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
};

// Exporta a instância do io (será definida após a inicialização)
export { io };