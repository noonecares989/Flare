import { useEffect, useRef, useState } from 'react';

interface UseWebSocketReturn {
  lastMessage: MessageEvent | null;
  sendMessage: (message: any) => void;
  readyState: number;
  isConnected: boolean;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      const wsUrl = url.startsWith('ws') ? url : `ws://localhost:3001${url}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setReadyState(WebSocket.OPEN);
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        setLastMessage(event);
      };

      wsRef.current.onclose = () => {
        setReadyState(WebSocket.CLOSED);
        setIsConnected(false);
        console.log('WebSocket disconnected');

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setReadyState(WebSocket.CLOSED);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return {
    lastMessage,
    sendMessage,
    readyState,
    isConnected,
  };
}