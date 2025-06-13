import React, { useState, useEffect } from "react";
import CustomButton from "../../components/Button";
import "../../styles/Accept_Register.css";
import Navbar from "../../components/navbar/Navbar";
import {
  getInactiveBusinesses,
  getInactiveDelivery,
  reviewBusiness,
  reviewDelivery,
  BusinessData,
  DeliveryData,
} from "../../service/Accept_Register_service";

// Which data set to display
type CurrentMode = "business" | "delivery";

// For Accept/Reject actions
type ActionType = "accept" | "reject";

const AcceptRegister: React.FC = () => {
  // Sidebar user data

  // Track which data set is shown
  const [currentMode, setCurrentMode] = useState<CurrentMode>("business");

  // States for storing API data
  const [businessData, setBusinessData] = useState<BusinessData[]>([]);
  const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);

  // Load data on component mount and when mode changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (currentMode === "business") {
          const data = await getInactiveBusinesses();
          setBusinessData(data);
        } else {
          const data = await getInactiveDelivery();
          setDeliveryData(data);
        }
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMode]);

  // Handle Accept/Reject button clicks
  const handleAccept = (id: string) => {
    setSelectedId(id);
    setActionType("accept");
    setShowConfirmModal(true);
  };

  const handleReject = (id: string) => {
    setSelectedId(id);
    setActionType("reject");
    setShowConfirmModal(true);
  };

  // Handle View ID Image button click
  const handleViewImage = (imageUrl: string) => {
    setImageLoading(true);
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Handle image load complete
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageLoading(false);
    setError("Failed to load image.");
  };

  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
    setImageLoading(false);
  };

  // Confirm action in the modal
  const confirmAction = async () => {
    if (selectedId !== null && actionType !== null) {
      setLoading(true);

      try {
        const isApproved = actionType === "accept";

        if (currentMode === "business") {
          await reviewBusiness(selectedId, isApproved);
          // Remove the processed item from the list
          setBusinessData((prev) =>
            prev.filter((item) => item.id !== selectedId)
          );
        } else {
          await reviewDelivery(selectedId, isApproved);
          // Remove the processed item from the list
          setDeliveryData((prev) =>
            prev.filter((item) => item.id !== selectedId)
          );
        }
      } catch (err) {
        setError(`Failed to ${actionType} the registration. Please try again.`);
        console.error(`Error ${actionType}ing registration:`, err);
      } finally {
        setLoading(false);
        // Reset modal state
        setShowConfirmModal(false);
        setSelectedId(null);
        setActionType(null);
      }
    }
  };

  // Cancel action in the modal
  const cancelAction = () => {
    setShowConfirmModal(false);
    setSelectedId(null);
    setActionType(null);
  };

  // Render cards for Businesses
  const renderBusinessCards = () => {
    if (loading) return <p>Loading business registrations...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (businessData.length === 0)
      return <p>No pending business registrations.</p>;

    return businessData.map((item) => (
      <div key={item.id} className="registration-card">
        <div className="card-header">
          <h3 className="registration-info card-title">
            Business Name: {item.businessName}
          </h3>
          {item.idImage && (
            <button
              className="exclamation-button"
              onClick={() => handleViewImage(item.idImage)}
              title="View ID Image"
            >
              !
            </button>
          )}
        </div>
        <div className="card-content">
          <p className="registration-info">Email: {item.email}</p>
          <p className="registration-info">Phone: {item.phoneNumber}</p>
          <p className="registration-info">Address: {item.address}</p>
          <p className="registration-info">
            Category: {item.globalCategory?.name || "N/A"}
          </p>
          <p className="registration-info">
            Subcategory: {item.specificCategory?.name || "N/A"}
          </p>
          <p className="registration-info">
            ID Image: {item.idImage ? "Provided" : "Not provided"}
          </p>
        </div>
        <div className="registration-actions">
          <CustomButton
            text="Accept"
            className="accept-button"
            onClick={() => handleAccept(item.id)}
          />
          <CustomButton
            text="Reject"
            className="reject-button"
            onClick={() => handleReject(item.id)}
          />
        </div>
      </div>
    ));
  };

  // Render cards for Delivery Men
  const renderDeliveryCards = () => {
    if (loading) return <p>Loading delivery registrations...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (deliveryData.length === 0)
      return <p>No pending delivery registrations.</p>;

    return deliveryData.map((item) => (
      <div key={item.id} className="registration-card">
        <div className="card-header">
          <h3 className="registration-info card-title">
            Delivery Man: {item.firstName} {item.lastName}
          </h3>
          {item.idImage && (
            <button
              className="exclamation-button"
              onClick={() => handleViewImage(item.idImage)}
              title="View ID Image"
            >
              !
            </button>
          )}
        </div>
        <div className="card-content">
          <p className="registration-info">
            Phone: {item.phoneNumber || "N/A"}
          </p>
          <p className="registration-info">Email: {item.email || "N/A"}</p>
          <p className="registration-info">Address: {item.address || "N/A"}</p>
          <p className="registration-info">
            Vehicle Type: {item.vehicleType || "N/A"}
          </p>
          <p className="registration-info">
            ID Photo: {item.idImage ? "Provided" : "Not provided"}
          </p>
        </div>
        <div className="registration-actions">
          <CustomButton
            text="Accept"
            className="accept-button"
            onClick={() => handleAccept(item.id)}
          />
          <CustomButton
            text="Reject"
            className="reject-button"
            onClick={() => handleReject(item.id)}
          />
        </div>
      </div>
    ));
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="accept-register-page">
        {/* Sidebar on the left */}

        {/* Main content area */}
        <div className="accept-register-content">
          {/* Tab buttons to switch between modes */}
          <div className="tab-buttons">
            <button
              className={`tab-button ${
                currentMode === "business" ? "active-tab" : ""
              }`}
              onClick={() => setCurrentMode("business")}
            >
              Businesses
            </button>
            <button
              className={`tab-button ${
                currentMode === "delivery" ? "active-tab" : ""
              }`}
              onClick={() => setCurrentMode("delivery")}
            >
              Delivery Man
            </button>
          </div>

          {/* Content based on current mode */}
          <div className="registration-container">
            <h2 className="section-title">
              Pending {currentMode === "business" ? "Business" : "Delivery"}{" "}
              Registrations
            </h2>
            <div className="registration-cards-grid">
              {currentMode === "business"
                ? renderBusinessCards()
                : renderDeliveryCards()}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal-content">
              <h2>
                Confirm {actionType === "accept" ? "Acceptance" : "Rejection"}
              </h2>
              <p>
                Are you sure you want to{" "}
                {actionType === "accept" ? "accept" : "reject"} this
                registration?
              </p>
              <div className="confirm-modal-actions">
                <button className="cancel-button" onClick={cancelAction}>
                  Cancel
                </button>
                <button
                  className={
                    actionType === "accept" ? "accept-button" : "reject-button"
                  }
                  onClick={confirmAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div
            className="image-modal-overlay animate-fade-in"
            onClick={closeImageModal}
          >
            <div
              className="image-modal-content animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="image-modal-header">
                <h2>ID Image</h2>
                <button className="close-button" onClick={closeImageModal}>
                  ×
                </button>
              </div>
              <div className="image-container">
                {imageLoading && (
                  <div className="image-loading">
                    <div className="loading-spinner"></div>
                    Loading image...
                  </div>
                )}
                <img
                  src={selectedImage}
                  alt="ID Document"
                  className="modal-image animate-image-appear"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? "none" : "block" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AcceptRegister;
