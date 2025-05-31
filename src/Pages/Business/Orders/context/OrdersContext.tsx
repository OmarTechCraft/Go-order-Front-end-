"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ApiOrder, fetchOrders, reviewOrder, formatDate, mapOrderStatus } from "./orders_service"

export interface Order {
  id: string;
  customerName: string;
  status: string;
  date: string;
  action: string;
  totalPrice?: number;
  address?: string;
  items?: any[];
  deliveryFee?: number;
  rawData?: ApiOrder; // Store the raw API data for detail views
}

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  acceptOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string) => void;
  getFilteredOrders: (status: string | string[]) => Order[];
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load orders from API
  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      
      const apiOrders = await fetchOrders();
      
      // Transform API orders to our Order interface
      const transformedOrders = apiOrders.map((apiOrder: ApiOrder) => {
        const { status, action } = mapOrderStatus(apiOrder.status);
        
        // Extract customer name from the first item or use "Unknown"
        // In a real app, you'd get this from the API directly
        const customerName = "Customer"; // Replace with actual data when available
        
        // Format address as a string
        const address = apiOrder.address ? 
          `${apiOrder.address.buildingNumber} ${apiOrder.address.street}, ${apiOrder.address.city}, ${apiOrder.address.country}` : 
          "No address provided";
        
        return {
          id: apiOrder.id.toString(),
          customerName,
          status,
          date: formatDate(apiOrder.createdAt),
          action,
          totalPrice: apiOrder.totalPrice,
          deliveryFee: apiOrder.deliveryFee,
          address,
          items: apiOrder.items,
          rawData: apiOrder
        };
      });
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const refreshOrders = async () => {
    await loadOrders();
  };

  const acceptOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await reviewOrder(parseInt(orderId), true);
      
      // Update local state optimistically
      setOrders(
        orders.map((order) => 
          order.id === orderId ? 
            { ...order, status: "preparing", action: "in-progress" } : 
            order
        )
      );
      
      // Refresh orders to get the actual updated state from server
      await loadOrders();
    } catch (err) {
      console.error("Failed to accept order:", err);
      setError("Failed to accept order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await reviewOrder(parseInt(orderId), false);
      
      // Update local state optimistically
      setOrders(
        orders.map((order) => 
          order.id === orderId ? 
            { ...order, status: "cancelled", action: "cancelled" } : 
            order
        )
      );
      
      // Refresh orders to get the actual updated state from server
      await loadOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      setError("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = (orderId: string) => {
    // In a real app, this would make an API call to mark the order as complete
    setOrders(
      orders.map((order) => 
        order.id === orderId ? 
          { ...order, status: "delivered", action: "completed" } : 
          order
      )
    );
  };

  const getFilteredOrders = (status: string | string[]) => {
    if (Array.isArray(status)) {
      return orders.filter((order) => status.includes(order.status));
    }
    return orders.filter((order) => order.status === status);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        acceptOrder,
        cancelOrder,
        completeOrder,
        getFilteredOrders,
        refreshOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}