"use client";

import { useState } from "react";
import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";
import OrderTable from "../../../components/OrderTable/OrderTable";
import { useOrders } from "./context/OrdersContext";
import "./orders.css";

export default function WaitingOrders() {
  const { getFilteredOrders, acceptOrder, cancelOrder, completeOrder } =
    useOrders();
  const waitingOrders = getFilteredOrders("waiting");

  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);

  // Using const declarations since we don't need to update these values
  const loading = false;
  const error: string | null = null;

  const handleAccept = (orderId: string): void => {
    acceptOrder(orderId);
  };

  const handleCancel = (orderId: string): void => {
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  const confirmCancel = (): void => {
    if (selectedOrderId) {
      cancelOrder(selectedOrderId);
      setShowCancelDialog(false);
      setSelectedOrderId(null);
    }
  };

  const handleDone = (orderId: string): void => {
    completeOrder(orderId);
  };

  const handleViewDetails = (): void => {
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = (): void => {
    setShowDetailsPopup(false);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Nav_2 />
        <Sidebar_2 />
        <div className="content-area">
          <div className="orders-content">
            <h1 className="page-title">Waiting</h1>

            <OrderTable
              orders={waitingOrders}
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

            {showDetailsPopup && (
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
                      <strong>Total Price:</strong> $32.00
                    </p>
                    <p>
                      <strong>Address:</strong> 123 Main Street, Cairo
                    </p>
                    <p>
                      <strong>Payment Type:</strong> Credit Card
                    </p>
                    <p>
                      <strong>Date:</strong> 13-2-2025
                    </p>
                    <p>
                      <strong>Customer Name:</strong> Mohamed
                    </p>

                    <h4>Items:</h4>
                    <p>Product: Cheeseburger</p>
                    <p>Default Price: $8.00</p>

                    <h4>Ingredients:</h4>
                    <ul>
                      <li>Bun</li>
                      <li>Beef Patty</li>
                      <li>Cheese</li>
                      <li>Lettuce</li>
                      <li>Tomato</li>
                    </ul>
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
