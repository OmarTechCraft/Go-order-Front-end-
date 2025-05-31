import React, { useState, useRef, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import CustomButton from "../../components/Button";
import CustomInputField from "../../components/InputField";
import "../../styles/add-subcategory.css";
import Navbar from "../../components/navbar/Navbar";
import {
  fetchGlobalCategories,
  fetchSpecificCategories,
  addSpecificCategory,
  deleteSpecificCategory,
} from "../../service/sup_service";

// Interface for Global Category from API
interface GlobalCategory {
  id: number;
  name: string;
  image: string;
  subCategories: SpecificCategory[];
}

// Interface for Specific Category from API
interface SpecificCategory {
  id: number;
  name: string;
  image: string;
  parentCategoryId: number;
}

const AddSubcategory: React.FC = () => {
  // States for categories
  const [globalCategories, setGlobalCategories] = useState<GlobalCategory[]>(
    []
  );
  const [specificCategories, setSpecificCategories] = useState<
    SpecificCategory[]
  >([]);
  const [selectedGlobalCategory, setSelectedGlobalCategory] =
    useState<GlobalCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // State for managing open menus, modals, and form inputs
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteSubcategoryId, setDeleteSubcategoryId] = useState<number | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // "Add New Subcategory" modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryFile, setNewSubcategoryFile] = useState<File | null>(
    null
  );
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch global categories on component mount
  useEffect(() => {
    const loadGlobalCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchGlobalCategories();
        setGlobalCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch global categories:", error);
        setLoading(false);
      }
    };

    loadGlobalCategories();
  }, []);

  // Handle global category selection
  const handleGlobalCategorySelect = async (category: GlobalCategory) => {
    setSelectedGlobalCategory(category);
    setLoading(true);

    try {
      const data = await fetchSpecificCategories(category.id);
      setSpecificCategories(data);
    } catch (error) {
      console.error(
        `Failed to fetch specific categories for ${category.name}:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle the three-dot menu for each subcategory card
  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Delete functions
  const handleDeleteClick = (id: number) => {
    setDeleteSubcategoryId(id);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (deleteSubcategoryId !== null) {
      try {
        setLoading(true);
        await deleteSpecificCategory(deleteSubcategoryId);

        // Update local state after successful deletion
        setSpecificCategories((prev) =>
          prev.filter((sub) => sub.id !== deleteSubcategoryId)
        );
      } catch (error) {
        console.error("Failed to delete subcategory:", error);
      } finally {
        setLoading(false);
        setShowDeleteModal(false);
        setDeleteSubcategoryId(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteSubcategoryId(null);
  };

  // "Add New Subcategory" modal functions
  const handleAddSubcategoryClick = () => {
    setShowAddModal(true);
  };

  const handleAddUploadClick = () => {
    addFileInputRef.current?.click();
  };

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewSubcategoryFile(e.target.files[0]);
    }
  };

  const saveAddSubcategory = async () => {
    if (!newSubcategoryName || !selectedGlobalCategory || !newSubcategoryFile)
      return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Image", newSubcategoryFile);

      const newSpecificCategory = await addSpecificCategory(
        newSubcategoryName,
        selectedGlobalCategory.id,
        formData
      );

      // Update local state with the new subcategory
      setSpecificCategories((prev) => [...prev, newSpecificCategory]);

      // Reset form
      setShowAddModal(false);
      setNewSubcategoryName("");
      setNewSubcategoryFile(null);
    } catch (error) {
      console.error("Failed to add new subcategory:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAddSubcategory = () => {
    setShowAddModal(false);
    setNewSubcategoryName("");
    setNewSubcategoryFile(null);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="add-subcategory-page">
        {/* Decorative Background Image */}
        <div className="add-subcategory-background">
          <img
            src="/Component 1.png"
            alt="Decorative"
            className="fixed-background-image"
          />
        </div>

        {/* Main Content Area */}
        <div className="add-subcategory-content">
          <h1 className="page-title">Add Subcategory</h1>

          {/* Global Categories Section */}
          <div className="global-categories-section">
            <div className="subcategories-title-badge">
              <span>Global Categories</span>
            </div>

            {loading && <div className="loading-spinner">Loading...</div>}

            <div className="global-categories-grid">
              {globalCategories.map((category) => (
                <div
                  key={category.id}
                  className={`global-category-card ${
                    selectedGlobalCategory?.id === category.id ? "selected" : ""
                  }`}
                  onClick={() => handleGlobalCategorySelect(category)}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="subcategory-image"
                  />
                  <p className="subcategory-label">{category.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Categories Section - Only shown when a global category is selected */}
          {selectedGlobalCategory && (
            <div className="specific-categories-section">
              <div className="subcategories-title-badge">
                <span>Subcategories for {selectedGlobalCategory.name}</span>
              </div>

              <div className="subcategories-grid">
                {specificCategories.map((sub) => (
                  <div key={sub.id} className="subcategory-card">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="subcategory-image"
                    />
                    <p className="subcategory-label">{sub.name}</p>
                    <button
                      className="menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(sub.id);
                      }}
                    >
                      &#8942;
                    </button>
                    {openMenuId === sub.id && (
                      <div
                        className="menu-slide"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="menu-option"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(sub.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* "Add Subcategory" Button - Only visible when specific categories are loaded */}
              <div className="add-subcategory-button-container">
                <CustomButton
                  text="Add subcategory"
                  className="purple-add-button"
                  onClick={handleAddSubcategoryClick}
                />
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={cancelDelete}>
            <div
              className="delete-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Are you sure you want to delete this subcategory?</h3>
              <div className="delete-modal-actions">
                <button className="cancel-button" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="delete-button" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Subcategory Modal */}
        {showAddModal && (
          <div className="edit-modal-overlay" onClick={cancelAddSubcategory}>
            <div
              className="edit-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add New Subcategory</h2>
              <div className="edit-form">
                <label>Subcategory Name</label>
                <CustomInputField
                  type="text"
                  placeholder="Enter subcategory name"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                />
                <label>Upload Photo</label>
                <div className="upload-container">
                  <div className="photo-box">
                    {newSubcategoryFile ? (
                      <img
                        src={URL.createObjectURL(newSubcategoryFile)}
                        alt="Preview"
                        className="photo-preview"
                      />
                    ) : (
                      <div className="photo-placeholder" />
                    )}
                  </div>
                  <button
                    className="file-upload-button"
                    onClick={handleAddUploadClick}
                  >
                    <FaUpload size={20} style={{ marginRight: "8px" }} />
                    Choose File
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={addFileInputRef}
                    onChange={handleNewFileChange}
                    className="upload-input"
                  />
                </div>
                <div
                  className="save-changes-container"
                  style={{ justifyContent: "center" }}
                >
                  <CustomButton
                    text={loading ? "Saving..." : "Save Subcategory"}
                    className="purple-save-button"
                    onClick={saveAddSubcategory}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddSubcategory;
