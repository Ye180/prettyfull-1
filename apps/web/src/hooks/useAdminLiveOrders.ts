import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * ============================================================================
 * USE ADMIN LIVE ORDERS HOOK - SSE Admin Dashboard
 * ============================================================================
 * Hook React pour recevoir notifications temps réel des nouvelles commandes (admin only)
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const { orders, isConnected, error, clearOrders } = useAdminLiveOrders();
 *
 *   return (
 *     <div>
 *       <h2>Nouvelles Commandes {orders.length > 0 && `(${orders.length})`}</h2>
 *       {orders.map((order) => (
 *         <OrderCard key={order.orderId} order={order} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

export interface NewOrderNotification {
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: {
    amount: number;
    currency: string;
  };
  timestamp: string;
}

export interface UseAdminLiveOrdersReturn {
  orders: NewOrderNotification[];
  latestOrder: NewOrderNotification | null;
  isConnected: boolean;
  error: string | null;
  clearOrders: () => void;
  reconnect: () => void;
}

export function useAdminLiveOrders(
  apiBaseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777',
  authToken?: string, // Bearer token pour authentification admin
): UseAdminLiveOrdersReturn {
  const [orders, setOrders] = useState<NewOrderNotification[]>([]);
  const [latestOrder, setLatestOrder] = useState<NewOrderNotification | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      // Fermer l'ancienne connexion si elle existe
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Note: EventSource ne supporte pas les headers personnalisés
      // Pour l'auth, on peut passer le token en query param ou utiliser des cookies
      const url = authToken
        ? `${apiBaseUrl}/orders/admin/live?token=${authToken}`
        : `${apiBaseUrl}/orders/admin/live`;

      console.log('🔌 Admin connecting to SSE:', url);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ Admin SSE connection established');
        setIsConnected(true);
        setError(null);
      };

      eventSource.addEventListener('new-order', (event: MessageEvent) => {
        try {
          const data: NewOrderNotification = JSON.parse(event.data);
          console.log('🛒 New order notification received:', data);

          setLatestOrder(data);
          setOrders((prev) => [data, ...prev]); // Plus récent en premier

          // Optionnel: Jouer un son de notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nouvelle Commande!', {
              body: `${data.orderNumber} - ${data.customerName} - ${data.totalAmount.amount} ${data.totalAmount.currency}`,
              icon: '/icon-order.png',
            });
          }

          // Optionnel: Jouer un son
          const audio = new Audio('/sounds/notification.mp3');
          audio.play().catch((err) => console.log('Audio play failed:', err));
        } catch (err) {
          console.error('❌ Failed to parse admin SSE data:', err);
        }
      });

      eventSource.onerror = (err) => {
        console.error('❌ Admin SSE connection error:', err);
        setIsConnected(false);
        setError('Connection lost. Reconnecting...');

        // Tenter une reconnexion après 5 secondes
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect admin SSE...');
          connect();
        }, 5000);
      };
    } catch (err) {
      console.error('❌ Failed to establish admin SSE connection:', err);
      setError('Failed to connect');
    }
  }, [apiBaseUrl, authToken]);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual admin reconnect triggered');
    connect();
  }, [connect]);

  const clearOrders = useCallback(() => {
    setOrders([]);
    setLatestOrder(null);
  }, []);

  useEffect(() => {
    // Demander permission pour notifications desktop
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    connect();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up admin SSE connection');
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
    orders,
    latestOrder,
    isConnected,
    error,
    clearOrders,
    reconnect,
  };
}
