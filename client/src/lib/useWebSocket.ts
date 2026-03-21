import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface GenerationProgress {
  assignmentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  progress: number;
}

export function useWebSocket(assignmentId: string | undefined) {
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      newSocket.emit('join', assignmentId);
    });

    newSocket.on('generation:progress', (data: GenerationProgress) => {
      setProgress(data);
    });

    newSocket.on('generation:complete', (data: GenerationProgress) => {
      setProgress(data);
    });

    newSocket.on('generation:error', (data: GenerationProgress) => {
      setProgress(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [assignmentId]);

  return { progress, socket };
}
