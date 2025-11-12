import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * ============================================================================
 * USE ORDER TRACKING HOOK - SSE Client
 * ============================================================================
 * Hook React pour tracking temps réel du statut de commande via Server-Sent Events
 *
 * @example
 * ```tsx
 * function OrderTracking({ orderId }) {
 *   const { status, message, timestamp, isConnected, error } = useOrderTracking(orderId);
 *
 *   return (
 *     <div>
 *       <h2>Statut: {status}</h2>
 *       <p>{message}</p>
 *       {isConnected && <span>🟢 Connecté</span>}
 *       {error && <span>❌ {error}</span>}
 *     </div>
 *   );
 * }
 * ```
 */

export interface OrderStatusUpdate {
  status: string;
  message: string;
  timestamp: string;
  metadata?: {
    orderNumber?: string;
    previousStatus?: string;
  };
}

export interface UseOrderTrackingReturn {
  status: string | null;
  message: string | null;
  timestamp: Date | null;
  metadata: Record<string, any> | null;
  isConnected: boolean;
  error: string | null;
  history: OrderStatusUpdate[];
  reconnect: () => void;
}

export function useOrderTracking(
  orderId: string,
  apiBaseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777',
): UseOrderTrackingReturn {
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<OrderStatusUpdate[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!orderId) {
      setError('Order ID is required');
      return;
    }

    try {
      // Fermer l'ancienne connexion si elle existe
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const url = `${apiBaseUrl}/orders/${orderId}/track`;
      console.log('🔌 Connecting to SSE:', url);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ SSE connection established');
        setIsConnected(true);
        setError(null);
      };

      eventSource.addEventListener('status-update', (event: MessageEvent) => {
        try {
          const data: OrderStatusUpdate = JSON.parse(event.data);
          console.log('📦 Status update received:', data);

          setStatus(data.status);
          setMessage(data.message);
          setTimestamp(new Date(data.timestamp));
          setMetadata(data.metadata || null);

          // Ajouter à l'historique
          setHistory((prev) => [...prev, data]);
        } catch (err) {
          console.error('❌ Failed to parse SSE data:', err);
        }
      });

      eventSource.onerror = (err) => {
        console.error('❌ SSE connection error:', err);
        setIsConnected(false);
        setError('Connection lost. Reconnecting...');

        // Tenter une reconnexion après 5 secondes
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 5000);
      };
    } catch (err) {
      console.error('❌ Failed to establish SSE connection:', err);
      setError('Failed to connect');
    }
  }, [orderId, apiBaseUrl]);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnect triggered');
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up SSE connection');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connect]);

  return {
    status,
    message,
    timestamp,
    metadata,
    isConnected,
    error,
    history,
    reconnect,
  };
}
