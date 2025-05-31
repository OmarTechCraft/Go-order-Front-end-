"use client";

import { useState, useEffect } from "react";

import OrderTable from "../../../components/OrderTable/OrderTable";
import { useOrders } from "./context/OrdersContext";
import "./orders.css";

import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";

// Define proper types to match your OrdersContext
interface OrderItem {
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    ingredients?: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface Order {
  id: string;
  customerName: string;
  status: string;
  date: string;
  totalPrice?: number; // Made optional to match context
  deliveryFee?: number; // Made optional to match context
  address?: string; // Made optional to match context
  items?: OrderItem[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export default function AllOrders() {
  const {
    orders,
    loading,
    error,
    acceptOrder,
    cancelOrder,
    completeOrder,
    refreshOrders,
  } = useOrders();

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Refresh orders periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [refreshOrders]);

  const handleAccept = async (orderId: string) => {
    try {
      await acceptOrder(orderId);
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  const handleCancel = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (selectedOrderId) {
      try {
        await cancelOrder(selectedOrderId);
        setShowCancelDialog(false);
        setSelectedOrderId(null);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    }
  };

  const handleDone = (orderId: string) => {
    completeOrder(orderId);
  };

  const handleViewDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedOrder(null);
  };

  // Get user info from localStorage with proper error handling
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData: UserData = JSON.parse(userDataString);
        // You can use userData here if needed
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
              <h1 className="page-title">All Orders</h1>
              <button
                className="refresh-button"
                onClick={() => refreshOrders()}
                disabled={loading}
              >
                Refresh
              </button>
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
                        className={`status-badge status-${selectedOrder.status.toLowerCase()}`}
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
                      <strong>Address:</strong> {selectedOrder.address || "N/A"}
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
                                          (ingredient) => (
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
