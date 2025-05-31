import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import CustomButton from "../../components/Button";
import "../../styles/manage-delivery-man.css";
import Navbar from "../../components/navbar/Navbar";
import DeliveryManService, {
  DeliveryManResponse,
  CreateDeliveryManDTO,
  UpdateDeliveryManDTO,
} from "../../service/ManageDeliveryMan_service";

// Interface for DeliveryMan data shown in the UI
interface DeliveryManDTO {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleType: string;
  address: string;
  active: boolean;
  image: string;
  idImage: string;
}

const ManageDeliveryMan: React.FC = () => {
  const [deliveryMen, setDeliveryMen] = useState<DeliveryManDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliveryManId, setSelectedDeliveryManId] = useState<
    string | null
  >(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeliveryManModal, setShowDeliveryManModal] = useState(false);
  const [editingDeliveryMan, setEditingDeliveryMan] =
    useState<DeliveryManDTO | null>(null);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Address: "",
    Gender: "Male",
    VehicleType: "",
    Image: null as File | null,
    IdImage: null as File | null,
  });

  // Fetch delivery men on component mount
  useEffect(() => {
    fetchDeliveryMen();
  }, []);

  const fetchDeliveryMen = async () => {
    setLoading(true);
    try {
      const response = await DeliveryManService.getAllDeliveryMen();

      // Transform API response to match our UI structure
      const transformedData = response.map((item: DeliveryManResponse) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        vehicleType: item.vehicleType || "Not specified",
        phoneNumber: item.phoneNumber || "",
        address: item.address || "",
        active: item.active,
        image: item.image || "",
        idImage: item.idImage || "",
      }));

      setDeliveryMen(transformedData);
    } catch (err) {
      console.error("Failed to fetch delivery men:", err);
      setError("Failed to load delivery personnel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingDeliveryMan) {
      setFormData({
        FirstName: editingDeliveryMan.firstName,
        LastName: editingDeliveryMan.lastName,
        Email: "", // Email is not editable
        Password: "", // Password is not editable
        PhoneNumber: editingDeliveryMan.phoneNumber,
        Address: editingDeliveryMan.address,
        Gender: "Male", // Default value as it's not in the response
        VehicleType: editingDeliveryMan.vehicleType,
        Image: null,
        IdImage: null,
      });
    } else {
      setFormData({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        PhoneNumber: "",
        Address: "",
        Gender: "Male",
        VehicleType: "",
        Image: null,
        IdImage: null,
      });
    }
  }, [editingDeliveryMan]);

  const handleDeleteClick = (deliveryManId: string) => {
    setSelectedDeliveryManId(deliveryManId);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedDeliveryManId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeliveryManId) {
      try {
        await DeliveryManService.deleteDeliveryMan(selectedDeliveryManId);
        setDeliveryMen(
          deliveryMen.filter((dm) => dm.id !== selectedDeliveryManId)
        );
        setShowDeleteModal(false);
        setSelectedDeliveryManId(null);
      } catch (error) {
        console.error("Failed to delete delivery man:", error);
        setError("Failed to delete. Please try again.");
      }
    }
  };

  const openAddDeliveryMan = () => {
    setEditingDeliveryMan(null);
    setShowDeliveryManModal(true);
  };

  const openEditDeliveryMan = (deliveryMan: DeliveryManDTO) => {
    setEditingDeliveryMan(deliveryMan);
    setShowDeliveryManModal(true);
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if ((name === "Image" || name === "IdImage") && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDeliveryMan) {
        // Prepare update data
        const updateData: UpdateDeliveryManDTO = {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Address: formData.Address,
          PhoneNumber: formData.PhoneNumber,
          VehicleType: formData.VehicleType,
        };

        if (formData.Image) {
          updateData.Image = formData.Image;
        }

        if (formData.IdImage) {
          updateData.IdImage = formData.IdImage;
        }

        // Update existing delivery man
        await DeliveryManService.updateDeliveryMan(
          editingDeliveryMan.id,
          updateData
        );
      } else {
        // Create new delivery man
        const createData: CreateDeliveryManDTO = {
          Email: formData.Email,
          Password: formData.Password,
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          PhoneNumber: formData.PhoneNumber,
          Address: formData.Address,
          Gender: formData.Gender,
          VehicleType: formData.VehicleType,
        };

        if (formData.Image) {
          createData.Image = formData.Image;
        }

        if (formData.IdImage) {
          createData.IdImage = formData.IdImage;
        }

        await DeliveryManService.createDeliveryMan(createData);
      }

      // Refresh the list
      fetchDeliveryMen();
      setShowDeliveryManModal(false);
    } catch (error) {
      console.error("Error saving delivery man:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeliveryManModal = () => {
    setShowDeliveryManModal(false);
    setError(null);
  };

  if (loading && deliveryMen.length === 0) {
    return <div>Loading delivery personnel...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="manage-delivery-man-page">
        <div className="manage-delivery-man-background">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <img
            src="/Component 1.png"
            alt="Decorative"
            className="bottom-right-image"
          />
        </div>

        <div className="manage-delivery-man-content">
          <div className="manage-delivery-man-header">
            <h2>Manage Delivery Personnel</h2>
            <CustomButton
              text="Add New Delivery"
              className="purple-add-button"
              onClick={openAddDeliveryMan}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="delivery-man-cards-container">
            {deliveryMen.length === 0 ? (
              <div className="no-data-message">No delivery personnel found</div>
            ) : (
              deliveryMen.map((deliveryMan) => (
                <div key={deliveryMan.id} className="delivery-man-card">
                  <h3 className="delivery-man-info-line">
                    Name: {`${deliveryMan.firstName} ${deliveryMan.lastName}`}
                  </h3>
                  <p className="delivery-man-info-line">
                    Phone: {deliveryMan.phoneNumber || "Not provided"}
                  </p>
                  <p className="delivery-man-info-line">
                    Vehicle: {deliveryMan.vehicleType}
                  </p>
                  <p className="delivery-man-info-line">
                    Status: {deliveryMan.active ? "Active" : "Inactive"}
                  </p>
                  <p className="delivery-man-info-line">Role: Delivery</p>
                  <div className="delivery-man-actions">
                    <CustomButton
                      text="EDIT"
                      className="gray-button"
                      onClick={() => openEditDeliveryMan(deliveryMan)}
                    />
                    <CustomButton
                      text="DELETE"
                      className="gray-button"
                      onClick={() => handleDeleteClick(deliveryMan.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delivery Man Modal */}
        {showDeliveryManModal && (
          <div
            className="delivery-man-modal-overlay"
            onClick={handleCloseDeliveryManModal}
          >
            <div
              className="delivery-man-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {editingDeliveryMan
                  ? "Edit Delivery Personnel"
                  : "Add New Delivery Personnel"}
              </h3>

              {error && <div className="modal-error-message">{error}</div>}

              <form onSubmit={handleFormSubmit} className="delivery-man-form">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleFormChange}
                    placeholder="Enter First Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleFormChange}
                    placeholder="Enter Last Name"
                    required
                  />
                </div>

                {!editingDeliveryMan && (
                  <>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleFormChange}
                        placeholder="Enter Email"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Password:</label>
                      <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleFormChange}
                        placeholder="Enter Password"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Gender:</label>
                      <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Vehicle Type:</label>
                  <input
                    type="text"
                    name="VehicleType"
                    value={formData.VehicleType}
                    onChange={handleFormChange}
                    placeholder="Enter Vehicle Type"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={handleFormChange}
                    placeholder="Enter Address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Profile Image:</label>
                  <input
                    type="file"
                    name="Image"
                    onChange={handleFormChange}
                    accept="image/*"
                  />
                </div>

                <div className="form-group">
                  <label>ID Image:</label>
                  <input
                    type="file"
                    name="IdImage"
                    onChange={handleFormChange}
                    accept="image/*"
                  />
                </div>

                <div className="delivery-man-modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCloseDeliveryManModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
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
              <h3>Are you sure you want to delete this delivery person?</h3>
              <div className="delete-modal-actions">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  className="delete-button"
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageDeliveryMan;
