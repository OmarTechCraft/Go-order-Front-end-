"use client";

import { useState } from "react";
import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";
import OrderTable from "../../../components/OrderTable/OrderTable";
import { useOrders } from "./context/OrdersContext";
import "./orders.css";

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
  totalPrice?: number;
  deliveryFee?: number;
  address?: string;
  items?: OrderItem[];
}

export default function DoneOrders() {
  const { getFilteredOrders, acceptOrder, cancelOrder, completeOrder } =
    useOrders();
  const doneOrders = getFilteredOrders("delivered");

  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Using const declarations instead of useState since we don't need to update these values
  const loading = false;
  const error: string | null = null;

  // These handlers are included for consistency with the OrderTable props,
  // but they won't be used for completed orders
  const handleAccept = (orderId: string): void => {
    acceptOrder(orderId);
  };

  const handleCancel = (orderId: string): void => {
    cancelOrder(orderId);
  };

  const handleDone = (orderId: string): void => {
    completeOrder(orderId);
  };

  const handleViewDetails = (orderId: string): void => {
    const order = doneOrders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = (): void => {
    setShowDetailsPopup(false);
    setSelectedOrder(null);
  };

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
            <h1 className="page-title">Done</h1>

            <OrderTable
              orders={doneOrders}
              loading={loading}
              error={error}
              onAccept={handleAccept}
              onCancel={handleCancel}
              onDone={handleDone}
              onViewDetails={handleViewDetails}
            />

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
