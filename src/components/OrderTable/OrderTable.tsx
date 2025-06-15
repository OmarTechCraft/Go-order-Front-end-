"use client";

import { Info, Loader2 } from "lucide-react";
import "./OrderTable.css";
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
        <Loader2 className="animate-spin" size={24} aria-label="Loading orders" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0 && !loading) { // Ensure "No orders found" only shows when not loading and empty
    return <div className="no-orders-message">No orders found</div>;
  }

  return (
    <div className="orders-table-container" role="region" aria-labelledby="orders-table-caption" tabIndex={0}>
      <h2 id="orders-table-caption" className="sr-only">List of Orders</h2> {/* Screen reader only caption */}
      {loading && (
        <div className="loading-overlay" aria-live="polite" aria-busy="true">
          <Loader2 className="animate-spin" size={24} />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <table className="orders-table">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Total</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} tabIndex={0} aria-label={`Order ${order.id} from ${order.customerName}`}>
              {/* Add data-label attributes to each <td> for mobile view */}
              <td data-label="Order ID">#{order.id}</td>
              <td data-label="Customer">{order.customerName}</td>
              <td data-label="Status">
                <span
                  className={`status-badge status-${order.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {order.status}
                </span>
              </td>
              <td data-label="Date">{order.date}</td>
              <td data-label="Total">${order.totalPrice?.toFixed(2) || "0.00"}</td>
              <td data-label="Details">
                <button
                  className="details-button"
                  onClick={() => onViewDetails(order.id)}
                  aria-label={`View details for Order ${order.id}`}
                >
                  <Info size={16} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}