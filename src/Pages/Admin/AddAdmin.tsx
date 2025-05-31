import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import CustomButton from "../../components/Button";
import "../../styles/add-admin.css";
import Navbar from "../../components/navbar/Navbar";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  AdminDTO,
  AdminCreateDTO,
} from "../../service/AddAdmin_service";

const AddAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<AdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminDTO | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
    role: "", // still keeping role for UI, but will not send it to backend
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdmins();
        setAdmins(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (editingAdmin) {
      const names = editingAdmin.firstName.split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        phoneNumber: editingAdmin.phoneNumber,
        address: editingAdmin.address || "",
        email: editingAdmin.email || "",
        password: "", // don't show password when editing
        role: "Limited Admin", // default role since AdminDTO doesn't have role property
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        email: "",
        password: "",
        role: "Limited Admin",
      });
    }
  }, [editingAdmin]);

  const handleDeleteClick = (adminId: string) => {
    setSelectedAdminId(adminId);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedAdminId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedAdminId) {
      try {
        await deleteAdmin(selectedAdminId);
        setAdmins(admins.filter((admin) => admin.id !== selectedAdminId));
        setShowDeleteModal(false);
        setSelectedAdminId(null);
      } catch (error) {
        console.error("Failed to delete admin:", error);
      }
    }
  };

  const openAddAdmin = () => {
    setEditingAdmin(null);
    setShowAdminModal(true);
  };

  const openEditAdmin = (admin: AdminDTO) => {
    setEditingAdmin(admin);
    setShowAdminModal(true);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editingAdmin) {
        // Update existing admin
        const formDataForUpdate = new FormData();
        formDataForUpdate.append("FirstName", formData.firstName);
        formDataForUpdate.append("LastName", formData.lastName);
        formDataForUpdate.append("PhoneNumber", formData.phoneNumber);
        formDataForUpdate.append("Address", formData.address);

        const updatedAdmin = await updateAdmin(
          editingAdmin.id,
          formDataForUpdate
        );

        setAdmins(
          admins.map((admin) =>
            admin.id === updatedAdmin.id ? updatedAdmin : admin
          )
        );
      } else {
        // Create new admin
        const newAdmin: AdminCreateDTO = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          email: formData.email,
          password: formData.password,
        };

        const createdAdmin = await createAdmin(newAdmin);
        setAdmins([...admins, createdAdmin]);
      }

      setShowAdminModal(false);
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
  };

  const getFullName = (admin: AdminDTO) => {
    return `${admin.firstName} ${admin.lastName}`.trim();
  };

  if (loading) {
    return <div>Loading admins...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="add-admin-page">
        <div className="add-admin-background">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <img
            src="/Component 1.png"
            alt="Decorative"
            className="bottom-right-image"
          />
        </div>

        <div className="add-admin-content">
          <div className="add-admin-header">
            <h2>Add Admin</h2>
            <CustomButton
              text="Add New Admin"
              className="purple-add-button"
              onClick={openAddAdmin}
            />
          </div>

          <div className="admin-cards-container">
            {admins.map((admin) => (
              <div key={admin.id} className="admin-card">
                <h3 className="admin-info-line">
                  Admin Name: {getFullName(admin)}
                </h3>
                <p className="admin-info-line">Phone: {admin.phoneNumber}</p>
                {admin.address && (
                  <p className="admin-info-line">Address: {admin.address}</p>
                )}
                <div className="admin-actions">
                  <CustomButton
                    text="Edit"
                    className="gray-button"
                    onClick={() => openEditAdmin(admin)}
                  />
                  <CustomButton
                    text="Delete"
                    className="gray-button"
                    onClick={() => handleDeleteClick(admin.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={handleCloseAdminModal}>
            <div
              className="admin-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editingAdmin ? "Edit Admin" : "Add New Admin"}</h3>
              <form onSubmit={handleFormSubmit} className="admin-form">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
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
                  />
                </div>
                {!editingAdmin && (
                  <>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Password:</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="form-group"></div>
                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCloseAdminModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    Save
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
              <h3>Are you sure you want to delete this admin?</h3>
              <div className="delete-modal-actions">
                <button className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="delete-button" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddAdmin;
