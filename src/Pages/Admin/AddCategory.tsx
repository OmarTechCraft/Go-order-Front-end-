import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaTrash, FaImage } from "react-icons/fa";
import CustomButton from "../../components/Button";
import CustomInputField from "../../components/InputField";
import "../../styles/add-category.css";
import Navbar from "../../components/navbar/Navbar";
import {
  CategoryService,
  Category,
} from "../../service/Add-Category-sup_service";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion"; // For animations (optional)

const AddCategory: React.FC = () => {
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing open menus, modals, and form inputs
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingName, setEditingName] = useState("");
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // New state and ref for the "Add New Category" modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryFile, setNewCategoryFile] = useState<File | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();

    // Close menu when clicking elsewhere on the page
    const handleOutsideClick = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Function to fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Toggle the three-dot menu for each category card
  const toggleMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Handle category card click
  const handleCategoryClick = (cat: Category) => {
    // Placeholder function for category click handling
    console.log("Category clicked:", cat.name);
  };

  // Delete functions
  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (deleteCategoryId !== null) {
      setLoading(true);
      try {
        await CategoryService.deleteCategory(deleteCategoryId);
        // Refresh categories after deletion
        await fetchCategories();
        toast.success("Category deleted successfully");
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error("Failed to delete category");
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
  };

  // Edit functions - keeping for potential future use
  const saveEditChanges = async () => {
    if (editingCategoryId !== null && editingFile) {
      setLoading(true);
      try {
        await CategoryService.updateCategory(
          editingCategoryId,
          editingName,
          editingFile
        );
        // Refresh categories after update
        await fetchCategories();
        toast.success("Category updated successfully");
      } catch (err) {
        console.error("Error updating category:", err);
        toast.error("Failed to update category");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please select an image file");
    }
    setShowEditModal(false);
    setEditingCategoryId(null);
    setEditingName("");
    setEditingFile(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingCategoryId(null);
    setEditingName("");
    setEditingFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditingFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    hiddenFileInput.current?.click();
  };

  // "Add New Category" modal functions
  const handleAddCategoryClick = () => {
    setShowAddModal(true);
  };

  const handleAddUploadClick = () => {
    addFileInputRef.current?.click();
  };

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewCategoryFile(e.target.files[0]);
    }
  };

  const saveAddCategory = async () => {
    if (!newCategoryName) {
      toast.error("Please enter a category name");
      return;
    }

    if (!newCategoryFile) {
      toast.error("Please select an image file");
      return;
    }

    setLoading(true);
    try {
      await CategoryService.addCategory(newCategoryName, newCategoryFile);
      // Refresh categories after adding new one
      await fetchCategories();
      toast.success("Category added successfully");
      setShowAddModal(false);
      setNewCategoryName("");
      setNewCategoryFile(null);
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const cancelAddCategory = () => {
    setShowAddModal(false);
    setNewCategoryName("");
    setNewCategoryFile(null);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="add-category-page">
        {/* Sidebar */}

        {/* Decorative Background Image with Animation */}
        <div className="add-category-background">
          <img
            src="/Component 1.png"
            alt="Decorative"
            className="fixed-background-image"
          />
        </div>

        {/* Main Content Area */}
        <div className="add-category-content">
          <h1 className="page-title">Add Category</h1>

          {/* Added "Edd" category badge above "Categories" as requested */}

          {/* Loading State */}
          {loading && (
            <div className="loading-indicator">
              <p>Loading categories...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchCategories}>Try Again</button>
            </div>
          )}

          {/* Categories Grid */}
          <div className="categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => handleCategoryClick(cat)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-image"
                  onError={(e) => {
                    // Fallback for broken images
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.png";
                  }}
                />
                <p className="category-label">{cat.name}</p>
                <button
                  className="menu-button"
                  onClick={(e) => toggleMenu(cat.id, e)}
                >
                  &#8942;
                </button>
                {openMenuId === cat.id && (
                  <div
                    className="menu-slide"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Edit button removed as requested */}
                    <button
                      className="menu-option"
                      onClick={(e) => handleDeleteClick(cat.id, e)}
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* "Add Category" Button */}
          <div className="add-category-button-container">
            <CustomButton
              text="Add category"
              className="purple-add-button"
              onClick={handleAddCategoryClick}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="delete-modal-overlay" onClick={cancelDelete}>
              <div
                className="delete-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Are you sure you want to delete this category?</h3>
                <div className="delete-modal-actions">
                  <button className="cancel-button" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button className="delete-button" onClick={confirmDelete}>
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Category Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="edit-modal-overlay" onClick={cancelEdit}>
              <div
                className="edit-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Edit Category</h2>
                <div className="edit-form">
                  <label>Category Name</label>
                  <CustomInputField
                    type="text"
                    placeholder="Enter category name"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <label>Upload Photo</label>
                  <div className="upload-container">
                    <div className="photo-box">
                      {editingFile ? (
                        <img
                          src={URL.createObjectURL(editingFile)}
                          alt="Preview"
                          className="photo-preview"
                        />
                      ) : (
                        <div className="photo-placeholder" />
                      )}
                    </div>
                    <button
                      className="file-upload-button"
                      onClick={handleUploadClick}
                    >
                      <FaUpload size={20} />
                      <span>Choose File</span>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={hiddenFileInput}
                      onChange={handleFileChange}
                      className="upload-input"
                    />
                  </div>
                  <div className="save-changes-container">
                    <CustomButton
                      text={loading ? "Saving..." : "Save Changes"}
                      className="purple-save-button"
                      onClick={saveEditChanges}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Add New Category Modal - Improved */}
        <AnimatePresence>
          {showAddModal && (
            <div className="edit-modal-overlay" onClick={cancelAddCategory}>
              <div
                className="edit-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Add New Category</h2>
                <div className="edit-form">
                  <label>Category Name</label>
                  <CustomInputField
                    type="text"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <label>Upload Photo</label>
                  <div className="upload-container">
                    <div className="photo-box">
                      {newCategoryFile ? (
                        <img
                          src={URL.createObjectURL(newCategoryFile)}
                          alt="Preview"
                          className="photo-preview"
                        />
                      ) : (
                        <div className="photo-placeholder">
                          <FaImage size={24} style={{ opacity: 0.5 }} />
                        </div>
                      )}
                    </div>
                    <button
                      className="file-upload-button"
                      onClick={handleAddUploadClick}
                    >
                      <FaUpload size={20} />
                      <span>Choose Image</span>
                      <small
                        style={{
                          marginTop: "4px",
                          opacity: 0.8,
                          fontSize: "12px",
                        }}
                      >
                        Select a clear image for your category
                      </small>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={addFileInputRef}
                      onChange={handleNewFileChange}
                      className="upload-input"
                    />
                  </div>
                  <div className="save-changes-container">
                    <CustomButton
                      text={loading ? "Saving..." : "Save Category"}
                      className="purple-save-button nowrap"
                      onClick={saveAddCategory}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AddCategory;
