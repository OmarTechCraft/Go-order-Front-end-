import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import CustomButton from "../../components/Button";
import "../../styles/manage-business.css";
import Navbar from "../../components/navbar/Navbar";
import BusinessService from "../../service/manage-business_service";

interface Business {
  id: string;
  businessName: string;
  address: string;
  phoneNumber: string;
  email: string;
  image: string;
  idImage: string;
  bankAccountNumber: string;
  active: string;
  globalCategory: {
    id: number;
    name: string;
    image: string;
    subCategories: {
      id: number;
      name: string;
      image: string;
      parentCategoryId: number;
    }[];
  };
  specificCategory: {
    id: number;
    name: string;
    image: string;
    parentCategoryId: number;
  };
}

interface GlobalCategory {
  id: number;
  name: string;
  image: string;
  subCategories: {
    id: number;
    name: string;
    image: string;
    parentCategoryId: number;
  }[];
}

interface SpecificCategory {
  id: number;
  name: string;
  image: string;
  parentCategoryId: number;
}

interface ErrorMessage {
  message: string;
  statusCode?: number;
  visible: boolean;
  type: "error" | "success";
}

interface FormDataType {
  businessName: string;
  phoneNumber: string;
  address: string;
  email: string;
  bankAccountNumber: string;
  password: string;
  globalCategoryId: number;
  specificCategoryId: number;
  image: File | null;
  idImage: File | null;
}

// Define error type properly
interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
    statusText: string;
  };
  request?: unknown;
  message?: string;
}

const ManageBusiness: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null
  );
  const [globalCategories, setGlobalCategories] = useState<GlobalCategory[]>(
    []
  );
  const [specificCategories, setSpecificCategories] = useState<
    SpecificCategory[]
  >([]);
  const [hasSpecificCategories, setHasSpecificCategories] =
    useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [notification, setNotification] = useState<ErrorMessage>({
    message: "",
    statusCode: undefined,
    visible: false,
    type: "error",
  });
  const [formData, setFormData] = useState<FormDataType>({
    businessName: "",
    phoneNumber: "",
    address: "",
    email: "",
    bankAccountNumber: "",
    password: "",
    globalCategoryId: 0,
    specificCategoryId: 0,
    image: null,
    idImage: null,
  });

  // Notification handling function
  const showNotification = useCallback(
    (message: string, type: "error" | "success", statusCode?: number) => {
      setNotification({
        message,
        statusCode,
        visible: true,
        type,
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 5000);
    },
    []
  );

  // Error handling function - now properly typed and memoized
  const handleError = useCallback(
    (error: ApiError) => {
      console.error("Error:", error);
      let errorMsg = "An unexpected error occurred";
      let statusCode = 500;

      if (error.response) {
        // The request was made and the server responded with a status code
        statusCode = error.response.status;
        errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          `Error ${statusCode}: ${error.response.statusText}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMsg =
          "No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMsg = error.message || errorMsg;
      }

      showNotification(errorMsg, "error", statusCode);
    },
    [showNotification]
  );

  // Fetch all businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await BusinessService.getBusinesses(true);
        setBusinesses(response);
        setLoading(false);
      } catch (error) {
        handleError(error as ApiError);
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [handleError]);

  // Fetch global categories
  useEffect(() => {
    const fetchGlobalCategories = async () => {
      try {
        const response = await BusinessService.getGlobalCategories();
        setGlobalCategories(response);
      } catch (error) {
        handleError(error as ApiError);
      }
    };

    fetchGlobalCategories();
  }, [handleError]);

  // Fetch specific categories when global category changes
  useEffect(() => {
    const fetchSpecificCategories = async () => {
      if (formData.globalCategoryId > 0) {
        try {
          const response = await BusinessService.getSpecificCategories(
            formData.globalCategoryId
          );
          setSpecificCategories(response);
          // Check if there are specific categories available
          setHasSpecificCategories(response && response.length > 0);
        } catch (error) {
          handleError(error as ApiError);
          setSpecificCategories([]);
          setHasSpecificCategories(false);
        }
      } else {
        setSpecificCategories([]);
        setHasSpecificCategories(false);
      }
    };

    fetchSpecificCategories();
  }, [formData.globalCategoryId, handleError]);

  // Reset form data when editing business changes
  useEffect(() => {
    if (editingBusiness) {
      setFormData({
        businessName: editingBusiness.businessName || "",
        phoneNumber: editingBusiness.phoneNumber || "",
        address: editingBusiness.address || "",
        email: editingBusiness.email || "",
        bankAccountNumber: editingBusiness.bankAccountNumber || "",
        password: "", // Password isn't returned from API, empty for edit
        globalCategoryId: editingBusiness.globalCategory?.id || 0,
        specificCategoryId: editingBusiness.specificCategory?.id || 0,
        image: null,
        idImage: null,
      });
    } else {
      // Reset form with empty values
      setFormData({
        businessName: "",
        phoneNumber: "",
        address: "",
        email: "",
        bankAccountNumber: "",
        password: "",
        globalCategoryId: 0,
        specificCategoryId: 0,
        image: null,
        idImage: null,
      });
    }
  }, [editingBusiness]);

  const handleDeleteClick = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedBusinessId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedBusinessId) {
      try {
        setIsProcessing(true);
        await BusinessService.deleteBusiness(selectedBusinessId);
        setBusinesses(
          businesses.filter((business) => business.id !== selectedBusinessId)
        );
        setShowDeleteModal(false);
        setSelectedBusinessId(null);
        showNotification("Business deleted successfully", "success");
      } catch (error) {
        handleError(error as ApiError);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const openAddBusiness = () => {
    setEditingBusiness(null);
    setShowBusinessModal(true);

    // Reset form with empty values
    setFormData({
      businessName: "",
      phoneNumber: "",
      address: "",
      email: "",
      bankAccountNumber: "",
      password: "",
      globalCategoryId: 0,
      specificCategoryId: 0,
      image: null,
      idImage: null,
    });

    // Clear specific categories when opening add form
    setSpecificCategories([]);
    setHasSpecificCategories(false);
  };

  const openEditBusiness = async (business: Business) => {
    setEditingBusiness(business);
    setShowBusinessModal(true);

    // Set form data from business
    setFormData({
      businessName: business.businessName || "",
      phoneNumber: business.phoneNumber || "",
      address: business.address || "",
      email: business.email || "",
      bankAccountNumber: business.bankAccountNumber || "",
      password: "", // Password isn't returned from API, empty for edit
      globalCategoryId: business.globalCategory?.id || 0,
      specificCategoryId: business.specificCategory?.id || 0,
      image: null,
      idImage: null,
    });

    // Fetch specific categories for the selected global category
    if (business.globalCategory?.id) {
      try {
        const response = await BusinessService.getSpecificCategories(
          business.globalCategory.id
        );
        setSpecificCategories(response);
        setHasSpecificCategories(response && response.length > 0);
      } catch (error) {
        handleError(error as ApiError);
        setSpecificCategories([]);
        setHasSpecificCategories(false);
      }
    }
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle number conversion for category IDs
    if (name === "globalCategoryId" || name === "specificCategoryId") {
      const numValue = parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: numValue || 0 }));

      // Reset specific category when global category changes
      if (name === "globalCategoryId") {
        setFormData((prev) => ({ ...prev, specificCategoryId: 0 }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const { name } = e.target;
      setFormData((prev) => ({ ...prev, [name]: e.target.files?.[0] || null }));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsProcessing(true);

      // Common validation for both create and update
      if (
        !formData.businessName ||
        !formData.address ||
        !formData.phoneNumber ||
        !formData.bankAccountNumber ||
        !formData.globalCategoryId
      ) {
        showNotification("Please fill all required fields", "error");
        setIsProcessing(false);
        return;
      }

      // Validate specific category only if the global category has specific categories
      if (hasSpecificCategories && !formData.specificCategoryId) {
        showNotification("Please select a specific category", "error");
        setIsProcessing(false);
        return;
      }

      if (editingBusiness) {
        // Update existing business
        // Fix: Handle null values for specificCategoryId parameter
        const specificCategoryId =
          hasSpecificCategories && formData.specificCategoryId > 0
            ? formData.specificCategoryId
            : 0; // Use 0 instead of null for consistency

        await BusinessService.updateBusiness(
          editingBusiness.id,
          formData.businessName,
          formData.address,
          formData.phoneNumber,
          formData.bankAccountNumber,
          formData.globalCategoryId,
          specificCategoryId, // Now always a number
          formData.image || undefined,
          formData.idImage || undefined
        );

        // Refresh the business list
        const updatedBusinesses = await BusinessService.getBusinesses(true);
        setBusinesses(updatedBusinesses);
        showNotification("Business updated successfully", "success");
      } else {
        // Additional validation for create
        if (!formData.email || !formData.password) {
          showNotification("Please fill email and password fields", "error");
          setIsProcessing(false);
          return;
        }

        // Validate image uploads
        if (!formData.image || !formData.idImage) {
          showNotification(
            "Please upload both business image and ID image",
            "error"
          );
          setIsProcessing(false);
          return;
        }

        // Create new business
        // Fix: Handle null values for specificCategoryId parameter
        const specificCategoryId =
          hasSpecificCategories && formData.specificCategoryId > 0
            ? formData.specificCategoryId
            : 0; // Use 0 instead of null for consistency

        await BusinessService.createBusiness(
          formData.businessName,
          formData.phoneNumber,
          formData.address,
          formData.email,
          formData.bankAccountNumber,
          formData.password,
          formData.globalCategoryId,
          specificCategoryId, // Now always a number
          formData.image,
          formData.idImage
        );

        // Refresh the business list
        const updatedBusinesses = await BusinessService.getBusinesses(true);
        setBusinesses(updatedBusinesses);
        showNotification("Business created successfully", "success");
      }

      setShowBusinessModal(false);
    } catch (error) {
      handleError(error as ApiError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseBusinessModal = () => {
    setShowBusinessModal(false);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="manage-business-page">
        <div className="manage-business-background">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <img
            src="/Component 1.png"
            alt="Decorative"
            className="bottom-right-image"
          />
        </div>

        {/* Notification display (error or success) */}
        {notification.visible && (
          <div className="notification-container">
            <div
              className={`notification ${
                notification.type === "error"
                  ? "error-message"
                  : "success-message"
              }`}
            >
              <span>
                {notification.type === "error" && notification.statusCode
                  ? `Error ${notification.statusCode}: `
                  : ""}
                {notification.message}
              </span>
              <button
                onClick={handleCloseNotification}
                className="close-notification-btn"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div className="manage-business-content">
          <div className="manage-business-header">
            <h2>Manage Business</h2>
            <CustomButton
              text="Add New Business"
              className="purple-add-button"
              onClick={openAddBusiness}
            />
          </div>

          <div className="business-cards-container">
            {businesses.length > 0 ? (
              businesses.map((business) => (
                <div key={business.id} className="business-card">
                  <h3 className="business-info-line">
                    Business Name: {business.businessName}
                  </h3>
                  <p className="business-info-line">
                    Phone: {business.phoneNumber}
                  </p>
                  <p className="business-info-line">
                    Address: {business.address}
                  </p>
                  <p className="business-info-line">
                    Category: {business.globalCategory?.name}
                    {business.specificCategory?.name &&
                      ` - ${business.specificCategory.name}`}
                  </p>
                  <div className="business-actions">
                    <CustomButton
                      text="Edit"
                      className="gray-button"
                      onClick={() => openEditBusiness(business)}
                    />
                    <CustomButton
                      text="Delete"
                      className="gray-button"
                      onClick={() => handleDeleteClick(business.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="no-businesses-message">
                No businesses found. Add a new business to get started.
              </div>
            )}
          </div>
        </div>

        {/* Business Modal */}
        {showBusinessModal && (
          <div
            className="business-modal-overlay"
            onClick={handleCloseBusinessModal}
          >
            <div
              className="business-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editingBusiness ? "Edit Business" : "Add New Business"}</h3>
              <form onSubmit={handleFormSubmit} className="business-form">
                <div className="form-group">
                  <label>Business Name:</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleFormChange}
                    placeholder="Enter Business Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Enter Address"
                    required
                  />
                </div>

                {!editingBusiness && (
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Enter Email"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Bank Account Number:</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleFormChange}
                    placeholder="Enter Bank Account Number"
                    required
                  />
                </div>

                {!editingBusiness && (
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      placeholder="Enter Password"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Global Category:</label>
                  <select
                    name="globalCategoryId"
                    value={formData.globalCategoryId || ""}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Global Category</option>
                    {globalCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show specific category dropdown only if the global category has specific categories */}
                {hasSpecificCategories && (
                  <div className="form-group">
                    <label>Specific Category:</label>
                    <select
                      name="specificCategoryId"
                      value={formData.specificCategoryId || ""}
                      onChange={handleFormChange}
                      required={hasSpecificCategories}
                    >
                      <option value="">Select Specific Category</option>
                      {specificCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Upload Business Image:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!editingBusiness}
                  />
                </div>

                <div className="form-group">
                  <label>Upload ID Image:</label>
                  <input
                    type="file"
                    name="idImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!editingBusiness}
                  />
                </div>

                <div className="business-modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCloseBusinessModal}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={handleCloseModal}>
            <div
              className="delete-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/b.png"
                alt="Modal Decorative"
                className="modal-top-right-image"
              />
              <h3>Are you sure you want to delete this business?</h3>
              <div className="delete-modal-actions">
                <button
                  className="cancel-button"
                  onClick={handleCloseModal}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="delete-button"
                  onClick={handleConfirmDelete}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageBusiness;
