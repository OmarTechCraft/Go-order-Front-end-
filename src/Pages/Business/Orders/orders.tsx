"use client";

import { useState, useEffect } from "react";
import OrderTable from "../../../components/OrderTable/OrderTable";
import "./orders.css";
import Nav_2 from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";
import { getOrders, updateOrderStatus } from "../../../service/orders_service";

// Define proper types to match your API response
interface Address {
  id: number;
  country: string;
  city: string;
  street: string;
  note: string;
  buildingNumber: number;
  floorNumber: number;
}

interface Business {
  id: string;
  businessName: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  businessId: string;
  parentCategoryId: number;
  image: string;
  subCategories: string[];
}

interface Image {
  url: string;
}

interface Variant {
  id: number;
  price: number;
  image: string;
  stock: number;
  color: string;
  size: string;
  weight: string;
}

interface Ingredient {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  stock: number;
  category: Category;
  businessId: string;
  images: Image[];
  variants: Variant[];
  ingredients: Ingredient[];
}

interface OrderItem {
  variantId: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  deliveryFee: number;
  address: Address;
  business: Business;
  items: OrderItem[];
  createdAt: string;
  customerName?: string; // Added for compatibility
  date?: string; // Added for compatibility
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

const ORDER_STATUSES = [
  "All",
  "Pending",
  "In progress",
  "Cooked",
  "Out to delivery",
  "Delivered",
];

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders based on selected status
  const fetchOrders = async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedOrders = await getOrders(
        status === "All" ? undefined : status
      );

      // Transform the data to match the expected format
      const transformedOrders = fetchedOrders.map((order: any) => ({
        ...order,
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

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders after status update
      fetchOrders(selectedStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
      setError("Failed to update order status");
    }
  };

  const handleAccept = async (orderId: string) => {
    try {
      await handleUpdateOrderStatus(parseInt(orderId), "In progress");
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  const handleCancel = (orderId: string) => {
    setSelectedOrderId(parseInt(orderId));
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (selectedOrderId) {
      try {
        await handleUpdateOrderStatus(selectedOrderId, "Cancelled");
        setShowCancelDialog(false);
        setSelectedOrderId(null);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    }
  };

  const handleDone = async (orderId: string) => {
    try {
      await handleUpdateOrderStatus(parseInt(orderId), "Delivered");
    } catch (error) {
      console.error("Failed to complete order:", error);
    }
  };

  const handleViewDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === parseInt(orderId));
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
              <h1 className="page-title">All Orders</h1>
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

                    {/* Order Status Update Section */}
                    <div className="status-update-section">
                      <h4>Update Order Status</h4>
                      <div className="status-buttons">
                        {ORDER_STATUSES.slice(1).map((status) => (
                          <button
                            key={status}
                            className={`status-update-button ${
                              selectedOrder.status === status ? "current" : ""
                            }`}
                            onClick={() =>
                              handleUpdateOrderStatus(selectedOrder.id, status)
                            }
                            disabled={selectedOrder.status === status}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
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
