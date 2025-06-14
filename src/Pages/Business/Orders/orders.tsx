// src/Pages/Business/Orders/orders.tsx
"use client";

import { useState, useEffect } from "react";
import OrderTable from "../../../components/OrderTable/OrderTable";
import "./orders.css";
import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";
// Import all necessary types from your service file
import { getOrders, updateOrderStatus, Order, OrderStatus, OrderItem, Ingredient } from "../../../service/orders_service"; 

interface UserData { // Keep this here as it's specific to this file
  id: string;
  name: string;
  email: string;
}

const ORDER_STATUSES: (OrderStatus | "All")[] = [ // Allow "All" for the filter UI
  "All",
  "Pending",
  "In progress",
  "Cooked",
  "Out to delivery",
  "Delivered",
];

// Define state transitions using OrderStatus
const STATE_TRANSITIONS: { [key in OrderStatus]?: OrderStatus | null } = {
  Pending: "In progress",
  "In progress": "Cooked",
  Cooked: "Out to delivery",
  "Out to delivery": "Delivered",
  Delivered: null, // Cannot move to any other state
  Canceled: null, // Canceled orders cannot transition
};

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "All">("All"); // Use OrderStatus for filter
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders based on selected status
  const fetchOrders = async (status?: OrderStatus | "All") => { // Parameter expects OrderStatus or "All"
    try {
      setLoading(true);
      setError(null);
      // Pass 'undefined' to getOrders service if "All" is selected
      const fetchedOrders = await getOrders(
        status === "All" ? undefined : status
      );

      // Transform the data to match the expected format for display
      const transformedOrders: Order[] = fetchedOrders.map((order: any) => ({
        ...order,
        // Ensure status is correctly mapped to OrderStatus union type
        status: order.status as OrderStatus,
        customerName: order.address
          ? `${order.address.street}, ${order.address.city}`
          : "Unknown Customer",
        date: new Date(order.createdAt).toLocaleDateString(),
      }));

      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [selectedStatus]);

  // Refresh orders periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(selectedStatus);
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [selectedStatus]);

  const handleStatusChange = (status: OrderStatus | "All") => { // Parameter expects OrderStatus or "All"
    setSelectedStatus(status);
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: OrderStatus // Use OrderStatus for newStatus
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Close the details popup when order moves to another state
      setShowDetailsPopup(false);
      setSelectedOrder(null);
      // Refresh orders after status update
      fetchOrders(selectedStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError("Failed to update order status");
    }
  };

  const handleAccept = async (orderId: number) => {
    try {
      await handleUpdateOrderStatus(orderId, "In progress");
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  const handleCancel = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (selectedOrderId !== null) { // Check for null explicitly
      try {
        await handleUpdateOrderStatus(selectedOrderId, "Canceled");
        setShowCancelDialog(false);
        setSelectedOrderId(null);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    }
  };

  const handleDone = async (orderId: number) => {
    try {
      await handleUpdateOrderStatus(orderId, "Delivered");
    } catch (error) {
      console.error("Failed to complete order:", error);
    }
  };

  const handleViewDetails = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedOrder(null);
  };

  const refreshOrders = () => {
    fetchOrders(selectedStatus);
  };

  // Get the next status for an order
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    return STATE_TRANSITIONS[currentStatus] || null;
  };

  // Get user info from localStorage with proper error handling
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData: UserData = JSON.parse(userDataString);
        console.log("User data loaded:", userData);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  // Format price to display with 2 decimal places
  const formatPrice = (price?: number): string => {
    return price ? price.toFixed(2) : "0.00";
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Nav_2 />
        <Sidebar_2 />
        <div className="content-area">
          <div className="orders-content">
            <div className="page-header">
              <h1 className="page-title">Orders</h1>
              <button
                className="refresh-button"
                onClick={refreshOrders}
                disabled={loading}
              >
                Refresh
              </button>
            </div>

            {/* Status Filter Buttons */}
            <div className="status-filter-container">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  className={`status-filter-button ${
                    selectedStatus === status ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <OrderTable
              orders={orders}
              loading={loading}
              error={error}
              onAccept={handleAccept}
              onCancel={handleCancel}
              onDone={handleDone}
              onViewDetails={handleViewDetails}
            />

            {showCancelDialog && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>Cancel Order</h3>
                  </div>
                  <div className="modal-body">
                    <p>
                      Are you sure you want to cancel this order? This action
                      cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn-secondary"
                      onClick={() => setShowCancelDialog(false)}
                    >
                      No
                    </button>
                    <button className="btn-primary" onClick={confirmCancel}>
                      Yes, Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDetailsPopup && selectedOrder && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h3>Order Details</h3>
                    <button
                      className="close-button"
                      onClick={closeDetailsPopup}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>
                      <strong>Order ID:</strong>{" "}
                      <span className="order-id">#{selectedOrder.id}</span>
                    </p>
                    <p>
                      <strong>Customer:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-badge status-${selectedOrder.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p>
                      <strong>Date:</strong> {selectedOrder.date}
                    </p>
                    <p>
                      <strong>Total Price:</strong> $
                      {formatPrice(selectedOrder.totalPrice)}
                    </p>
                    {selectedOrder.deliveryFee &&
                      selectedOrder.deliveryFee > 0 && (
                        <p>
                          <strong>Delivery Fee:</strong> $
                          {formatPrice(selectedOrder.deliveryFee)}
                        </p>
                      )}
                    <p>
                      <strong>Address:</strong>
                      {selectedOrder.address
                        ? `${selectedOrder.address.street}, ${selectedOrder.address.city}, ${selectedOrder.address.country}`
                        : "N/A"}
                    </p>

                    {selectedOrder.items && selectedOrder.items.length > 0 && (
                      <>
                        <h4>Items ({selectedOrder.items.length})</h4>
                        <div className="order-items">
                          {selectedOrder.items.map(
                            (item: OrderItem, index: number) => (
                              <div key={index} className="order-item">
                                <p>
                                  <strong>Product:</strong> {item.product.name}
                                </p>
                                <p>
                                  <strong>Price:</strong> $
                                  {formatPrice(item.product.price)}
                                </p>
                                <p>
                                  <strong>Quantity:</strong> {item.quantity}
                                </p>
                                <p>
                                  <strong>Subtotal:</strong> $
                                  {formatPrice(
                                    item.product.price * item.quantity
                                  )}
                                </p>

                                {item.product.ingredients &&
                                  item.product.ingredients.length > 0 && (
                                    <>
                                      <h5>Ingredients:</h5>
                                      <ul>
                                        {/* Ingredient type inferred correctly now */}
                                        {item.product.ingredients.map(
                                          (ingredient: Ingredient) => ( 
                                            <li key={ingredient.id}>
                                              {ingredient.name}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </>
                                  )}
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}

                    {/* Order Status Update Section - Only show next state */}
                    {getNextStatus(selectedOrder.status) && (
                      <div className="status-update-section">
                        <h4>Move Order to Next State</h4>
                        <div className="status-buttons">
                          <button
                            className="status-update-button next-state"
                            onClick={() =>
                              handleUpdateOrderStatus(
                                selectedOrder.id,
                                getNextStatus(selectedOrder.status)!
                              )
                            }
                          >
                            Move to {getNextStatus(selectedOrder.status)}
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === "Delivered" && (
                      <div className="status-update-section">
                        <h4>Order Status</h4>
                        <p className="final-status-message">
                          This order has been delivered and cannot be moved to
                          another state.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}