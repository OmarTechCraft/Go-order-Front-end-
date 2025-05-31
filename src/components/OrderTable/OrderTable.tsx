"use client"

import { Info, Loader2 } from "lucide-react"
import "./OrderTable.css"
import { Order } from "../../Pages/Business/Orders/context/OrdersContext"

interface OrderTableProps {
  orders: Order[]
  loading: boolean
  error: string | null
  onAccept: (orderId: string) => void
  onCancel: (orderId: string) => void
  onDone: (orderId: string) => void
  onViewDetails: (orderId: string) => void
}

export default function OrderTable({ 
  orders, 
  loading, 
  error, 
  onAccept, 
  onCancel, 
  onDone, 
  onViewDetails 
}: OrderTableProps) {
  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (loading && orders.length === 0) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={24} />
        <p>Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return <div className="no-orders-message">No orders found</div>
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
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customerName}</td>
              <td>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.date}</td>
              <td>${order.totalPrice?.toFixed(2) || "0.00"}</td>
              <td>
                {order.action === "pending" && (
                  <div className="action-buttons">
                    <button 
                      className="btn-primary"
                      onClick={() => onAccept(order.id)}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => onCancel(order.id)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {order.action === "in-progress" && (
                  <div className="action-buttons">
                    <button 
                      className="btn-primary"
                      onClick={() => onDone(order.id)}
                      disabled={loading}
                    >
                      Done
                    </button>
                    <button className="btn-secondary" disabled>
                      In progress
                    </button>
                  </div>
                )}
                {order.action === "completed" && <div className="completed-status">Completed</div>}
                {order.action === "cancelled" && <div className="cancelled-status">Cancelled</div>}
              </td>
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
  )
}