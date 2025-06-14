import React, { useState, useEffect, useRef } from "react";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import Navbar from "../../components/navbar copy/Navbar";
import { FaEllipsisV, FaPlus } from "react-icons/fa"; // Import FaPlus for the Add button
import {
  CategoryService,
  Category,
  SubCategory,
  CategoryFormData,
} from "../../service/Add_SubCategory_Business_service";
import "../../styles/Add_SubCategory_Business.css";

// --- CategoryFormModal Component ---
interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData, id?: number) => void;
  isLoading: boolean;
  editingItem: Category | SubCategory | null;
  parentCategoryId?: number | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingItem,
  parentCategoryId,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editingItem) {
        setCategoryName(
          "name" in editingItem ? editingItem.name : editingItem.categoryName
        );
        setImagePreview(
          "image" in editingItem ? editingItem.image : editingItem.categoryImage
        );
        setSelectedFile(null); // Clear selected file, user will re-upload if needed
      } else {
        setCategoryName("");
        setSelectedFile(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, editingItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      // If no file is selected, but it's an edit, keep the old image preview
      if (!editingItem) {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);

    const data: CategoryFormData = {
      name: categoryName.trim(),
      image: selectedFile || undefined,
    };

    if (parentCategoryId !== null && parentCategoryId !== undefined) {
      data.parentCategoryId = parentCategoryId;
    }

    try {
      if (editingItem) {
        const id =
          "id" in editingItem ? editingItem.id : editingItem.categoryId;
        await onSubmit(data, id);
      } else {
        await onSubmit(data);
      }
      handleClose(); // Close on successful submission
    } catch (err) {
      // Error handling is managed by parent component's onSubmit prop
      console.error("Submission error:", err);
    }
  };

  const handleClose = () => {
    setCategoryName("");
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button type="button" className="back-button" onClick={handleClose}>
            ←
          </button>
          <h2>{editingItem ? "Edit Category" : "Add New Category"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Upload Photo</label>
            <div className="image-upload-section">
              <div className="image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <div className="image-placeholder">📷</div>
                )}
              </div>
              <label
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={isLoading}
                  ref={fileInputRef}
                />
                <div className="upload-content">
                  <span>📤</span>
                  <span>Add/Change</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- DeleteConfirmationModal Component ---
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="delete-modal-title">Confirm Deletion</h2>
        <p className="delete-modal-message">
          Are you sure you want to delete "{itemName}"? This action cannot be
          undone.
        </p>

        <div className="delete-modal-actions">
          <button
            className="delete-modal-cancel-button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="delete-modal-confirm-button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- AddSubCategoryBusiness Main Component ---
const AddSubCategoryBusiness: React.FC = () => {
  const [categories, setCategories] = useState<(Category | SubCategory)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [pageTitle, setPageTitle] = useState("Categories");
  const [isViewingSubcategories, setIsViewingSubcategories] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | SubCategory | null>(
    null
  );
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // State for three dots menu

  // Business ID from localStorage
  const businessId = localStorage.getItem("id");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Effect to close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the clicked element is not part of any dropdown menu
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".menu-button")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    if (!businessId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setIsViewingSubcategories(false);
    setPageTitle("Categories");
    setSelectedCategoryId(null);
    setOpenMenuId(null); // Close any open menu

    try {
      const data = await CategoryService.fetchCategories(businessId);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubcategories = async (parentId: number) => {
    setIsLoading(true);
    setHasError(false);
    setIsViewingSubcategories(true);
    setSelectedCategoryId(parentId);
    setOpenMenuId(null); // Close any open menu

    // Find parent category name for the title
    const parentCategory = categories.find(
      (cat) => getCategoryId(cat) === parentId
    );
    const parentName = parentCategory ? getCategoryName(parentCategory) : "";
    setPageTitle(parentName ? `${parentName} Subcategories` : "Subcategories");

    try {
      const data = await CategoryService.fetchSubcategories(parentId);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrEditCategorySubmit = async (
    data: CategoryFormData,
    id?: number
  ) => {
    setIsSavingCategory(true);
    try {
      if (id) {
        // Editing an existing category/subcategory
        await CategoryService.updateCategory(id, data);
        alert("Category updated successfully!");
      } else {
        // Adding a new category/subcategory
        await CategoryService.addCategory(data);
        alert("Category added successfully!");
      }
      setIsFormModalOpen(false);
      setEditingItem(null); // Reset editing item

      // Refresh the current view
      if (isViewingSubcategories && selectedCategoryId) {
        await fetchSubcategories(selectedCategoryId);
      } else {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category. Please try again.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const confirmDeleteItem = (item: Category | SubCategory) => {
    const id = getCategoryId(item);
    const name = getCategoryName(item);
    setItemToDelete({ id, name });
    setIsDeleteConfirmModalOpen(true);
    setOpenMenuId(null); // Close three dots menu
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    setIsLoading(true); // Show general loading
    try {
      await CategoryService.deleteCategory(itemToDelete.id);
      setIsDeleteConfirmModalOpen(false);
      setItemToDelete(null);
      alert("Category deleted successfully!");

      // Refresh the current list after deletion
      if (isViewingSubcategories && selectedCategoryId) {
        await fetchSubcategories(selectedCategoryId);
      } else {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: Category | SubCategory) => {
    if (!isViewingSubcategories) {
      const categoryId = getCategoryId(category);
      fetchSubcategories(categoryId);
    }
  };

  const handleEditClick = (item: Category | SubCategory) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
    setOpenMenuId(null); // Close three dots menu
  };

  const getCategoryImage = (category: Category | SubCategory): string => {
    return "image" in category ? category.image : category.categoryImage;
  };

  const getCategoryName = (category: Category | SubCategory): string => {
    return "name" in category ? category.name : category.categoryName;
  };

  const getCategoryId = (category: Category | SubCategory): number => {
    return "id" in category ? category.id : category.categoryId;
  };

  const handleRetry = () => {
    if (isViewingSubcategories && selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    } else {
      fetchCategories();
    }
  };

  // Toggle three dots menu
  const toggleMenu = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation(); // Prevent document click from closing it immediately
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  return (
    <div className="add-category-business-page">
      <Navbar />

      <div
        className={`page-content ${
          isFormModalOpen || isDeleteConfirmModalOpen ? "blurred" : ""
        }`}
      >
        <Sidebar_2 />

        <div className="add-category-business-content">
          <div className="add-category-business-header">
            <div className="header-left">
              {isViewingSubcategories && (
                <button
                  type="button"
                  className="back-button"
                  onClick={fetchCategories}
                >
                  ←
                </button>
              )}
              <h1 className="page-title">{pageTitle}</h1>
            </div>

            {isViewingSubcategories && (
              <div className="header-actions">
                <button
                  type="button"
                  className="add-subcategory-button"
                  onClick={() => {
                    setEditingItem(null); // Ensure add mode
                    setIsFormModalOpen(true);
                  }}
                  disabled={isSavingCategory || isLoading}
                >
                  <FaPlus className="plus-icon" />
                  Add Subcategory
                </button>
              </div>
            )}
          </div>

          {isLoading &&
            !isSavingCategory && ( // Show main loader only when not saving/deleting via modal
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            )}

          {hasError && !isLoading && (
            <div className="error-container">
              <p className="error-message">
                Failed to load categories. Please try again.
              </p>
              <button
                type="button"
                className="retry-button"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !hasError && categories.length === 0 && (
            <div className="no-categories-message">
              <p>
                No {isViewingSubcategories ? "subcategories" : "categories"}{" "}
                found.
              </p>
              {!isViewingSubcategories && (
                <p>Click "Add Category" to create your first category.</p>
              )}
              {isViewingSubcategories && (
                <p>Click "Add Subcategory" to create your first subcategory.</p>
              )}
            </div>
          )}

          {!isLoading && !hasError && categories.length > 0 && (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={getCategoryId(category)} className="category-card">
                  {isViewingSubcategories && ( // Only show three dots for subcategories
                    <div className="category-menu">
                      <button
                        className="menu-button"
                        onClick={(e) => toggleMenu(e, getCategoryId(category))}
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === getCategoryId(category) && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleEditClick(category)}>
                            Modify
                          </button>
                          <button onClick={() => confirmDeleteItem(category)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className="category-content"
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      cursor: isViewingSubcategories ? "default" : "pointer",
                    }}
                  >
                    <img
                      src={getCategoryImage(category)}
                      alt={getCategoryName(category)}
                      className="category-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.png"; // Fallback image
                      }}
                    />
                    <p className="category-label">
                      {getCategoryName(category)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleAddOrEditCategorySubmit}
        isLoading={isSavingCategory}
        editingItem={editingItem}
        parentCategoryId={isViewingSubcategories ? selectedCategoryId : null}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        itemName={itemToDelete?.name || ""}
        isLoading={isLoading} // Use global loading for delete confirmation as well
      />
    </div>
  );
};

export default AddSubCategoryBusiness;
