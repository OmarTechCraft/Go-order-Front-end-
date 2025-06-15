"use client";

import { useState, useEffect } from "react";
import { Info, Loader2 } from "lucide-react"; // Import necessary icons
import "./orders.css";
import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";
// Import all necessary types from your service file
import { getOrders, updateOrderStatus, Order, OrderItem, Ingredient, OrderStatus } from "../../../service/orders_service";

interface UserData {
  id: string;
  name: string;
  email: string;
}

const ORDER_STATUSES: (OrderStatus | "All")[] = [
  "All",
  "Pending",
  "In progress",
  "Cooked",
  "Out to delivery",
  "Delivered",
];

const STATE_TRANSITIONS: { [key in OrderStatus]?: OrderStatus | null } = {
  Pending: "In progress",
  "In progress": "Cooked",
  Cooked: "Out to delivery",
  "Out to delivery": "Delivered",
  Delivered: null,
  Canceled: null,
};

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "All">("All");
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders based on selected status
  const fetchOrders = async (status?: OrderStatus | "All") => {
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

  const handleStatusChange = (status: OrderStatus | "All") => {
    setSelectedStatus(status);
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: OrderStatus
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

  // Inlined OrderTable component logic
  const renderOrderTable = () => {
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
                    onClick={() => handleViewDetails(order.id)}
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
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Nav_2 /> {/* This component likely has position: fixed; top: 0; */}
        <Sidebar_2 /> {/* This component likely has position: fixed; top: var(--navbar-height); left: 0; */}

        {/* This div represents the main content area, to the right of the sidebar and below the navbar */}
        <div className="content-area1">

          {/* NEW: Fixed Orders Page Header (Title + Refresh + Filters) */}
          {/* This wrapper will be fixed to the top of content-area1's visible space */}
          <div className="fixed-orders-page-header">
            <div className="page-header">
              <h1 className="page-title">Orders</h1>
              <button
                className="refresh-button"
                onClick={refreshOrders}
                disabled={loading}
                aria-label="Refresh Orders"
              >
                Refresh
              </button>
            </div>

            {/* Status Filter Buttons - now part of the fixed orders header */}
            <div className="status-filter-container">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  className={`status-filter-button ${
                    selectedStatus === status ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange(status)}
                  aria-pressed={selectedStatus === status}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* NEW: Scrollable Orders Content (Order Table and Modals) */}
          {/* This div will handle its own scrolling */}
          <div className="orders-scrollable-content">
            {renderOrderTable()} {/* Render the inlined OrderTable */}

            {/* Modals are already position: fixed, so they will naturally overlay */}
            {showCancelDialog && (
              <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
                <div className="modal">
                  <div className="modal-header">
                    <h3 id="cancel-order-title">Cancel Order</h3>
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
              <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="order-details-title">
                <div className="modal">
                  <div className="modal-header">
                    <h3 id="order-details-title">Order Details</h3>
                    <button
                      className="close-button"
                      onClick={closeDetailsPopup}
                      aria-label="Close details"
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

                    {/* Action buttons (Accept, Cancel, Mark as Delivered) directly in the details modal */}
                    <div className="modal-action-buttons">
                      {selectedOrder.status === "Pending" && (
                        <button
                          className="btn-primary"
                          onClick={() => handleAccept(selectedOrder.id)}
                        >
                          Accept Order
                        </button>
                      )}
                      {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Canceled" && (
                        <button
                          className="btn-secondary cancel-button"
                          onClick={() => handleCancel(selectedOrder.id)}
                        >
                          Cancel Order
                        </button>
                      )}
                      {selectedOrder.status === "Out to delivery" && (
                        <button
                          className="btn-primary"
                          onClick={() => handleDone(selectedOrder.id)}
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>

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