// src/components/OrderTable/OrderTable.tsx
"use client";

import { Info, Loader2 } from "lucide-react";
import "./OrderTable.css";
// Import Order from your service file (OrderStatus is used within Order, so no need to import explicitly here)
import { Order } from "../../service/orders_service";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onAccept: (orderId: number) => void;
  onCancel: (orderId: number) => void;
  onDone: (orderId: number) => void;
  onViewDetails: (orderId: number) => void;
}

export default function OrderTable({
  orders,
  loading,
  error,
  onViewDetails,
}: OrderTableProps) {
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading && orders.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={24} />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="no-orders-message">No orders found</div>;
  }

  return (
    <div className="orders-table-container">
      {loading && (
        <div className="loading-overlay">
          <Loader2 className="animate-spin" size={24} />
        </div>
      )}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Date</th>
            <th>Total</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customerName}</td>
              <td>
                <span
                  className={`status-badge status-${order.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {order.status}
                </span>
              </td>
              <td>{order.date}</td>
              <td>${order.totalPrice?.toFixed(2) || "0.00"}</td>

              <td>
                <button
                  className="details-button"
                  onClick={() => onViewDetails(order.id)}
                  aria-label="View details"
                >
                  <Info size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
