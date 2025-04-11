import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Conecta ao servidor WebSocket
let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket === null) {
    socket = io(import.meta.env.VITE_API_URL);
    
    // Configurações iniciais
    socket.on('connect', () => {
      console.log('Conectado ao WebSocket');
    });
    
    socket.on('connect_error', (err) => {
      console.error('Erro de conexão WebSocket:', err);
    });
    
    socket.on('disconnect', () => {
      console.log('Desconectado do WebSocket');
    });
  }
  
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Hook para usar o socket em componentes React
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const socket = initializeSocket();
    
    // Monitora o estado da conexão
    const onConnect = () => {
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      setIsConnected(false);
    };
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    
    // Configura estado inicial
    setIsConnected(socket.connected);
    
    // Cleanup quando o componente é desmontado
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  
  return { socket: socket as Socket, isConnected };
};

// Hook para escutar eventos específicos do servidor
export const useSocketEvent = <T>(eventName: string, callback: (data: T) => void) => {
  useEffect(() => {
    const socket = initializeSocket();
    
    // Adiciona o ouvinte para o evento
    socket.on(eventName, callback);
    
    // Cleanup quando o componente é desmontado
    return () => {
      socket.off(eventName, callback);
    };
  }, [eventName, callback]);
};