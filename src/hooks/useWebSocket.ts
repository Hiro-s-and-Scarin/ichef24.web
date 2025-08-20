import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface WebSocketMessage {
  message: string;
  payer: {
    name: string;
    email: string;
  };
}

export function useWebSocket(userEmail?: string) {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!userEmail) {
      console.log('❌ useWebSocket: userEmail não definido');
      return;
    }

    console.log('🔌 useWebSocket: Tentando conectar com email:', userEmail);

    // Conectar ao websocket do backend
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      query: { email: userEmail },
      transports: ['websocket'], // Forçar WebSocket
      timeout: 20000, // Timeout maior
    });

    // Eventos de conexão
    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket conectado com sucesso');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ WebSocket desconectado. Motivo:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('🚨 Erro de conexão WebSocket:', error);
    });

    // Eventos de pagamento
    socketRef.current.on('SUCCESS', (data: WebSocketMessage) => {
      console.log('🎉 EVENTO SUCCESS RECEBIDO:', data);
      toast.success(data.message, {
        description: `Pagamento confirmado para ${data.payer.name}`,
        duration: 5000,
      });
    });

    socketRef.current.on('REJECTED', (data: WebSocketMessage) => {
      console.log('❌ EVENTO REJECTED RECEBIDO:', data);
      toast.error(data.message, {
        description: `Falha no pagamento para ${data.payer.name}`,
        duration: 5000,
      });
    });

    socketRef.current.on('PENDING', (data: WebSocketMessage) => {
      console.log('⏳ EVENTO PENDING RECEBIDO:', data);
      toast.info(data.message, {
        description: `Status: ${data.payer.name}`,
        duration: 3000,
      });
    });
  }, [userEmail]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userEmail, connect, disconnect]);

  return { socket: socketRef.current };
}
