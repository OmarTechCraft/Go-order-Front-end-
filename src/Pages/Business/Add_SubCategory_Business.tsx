import React, { useState, useEffect } from "react";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import Navbar from "../../components/navbar copy/Navbar";
import {
  CategoryService,
  Category,
  SubCategory,
  AddCategoryData,
} from "../../service/Add_SubCategory_Business_service";
import "../../styles/Add_SubCategory_Business.css";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCategoryData) => void;
  parentCategoryId?: number;
  isLoading: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parentCategoryId,
  isLoading,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    onSubmit({
      name: categoryName.trim(),
      parentCategoryId,
      image: selectedImage || undefined,
    });
  };

  const handleClose = () => {
    setCategoryName("");
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setCategoryName("");
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button type="button" className="back-button" onClick={handleClose}>
            ←
          </button>
          <h2>Add Category</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
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
              <label className="upload-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={isLoading}
                />
                <div className="upload-content">
                  <span>📤</span>
                  <span>Add</span>
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

const AddSubCategoryBusiness: React.FC = () => {
  const [categories, setCategories] = useState<(Category | SubCategory)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [pageTitle, setPageTitle] = useState("Categories");
  const [isViewingSubcategories, setIsViewingSubcategories] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setHasError(false);
    setIsViewingSubcategories(false);
    setPageTitle("Categories");
    setSelectedCategoryId(null);

    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const data = await CategoryService.fetchCategories(userId);
      setCategories(data);
    } catch (error) {
      console.log(error);
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

    // Find parent category name
    const parentCategory = categories.find((cat) => {
      if ("id" in cat) {
        return cat.id === parentId;
      } else {
        return cat.categoryId === parentId;
      }
    });

    const parentName = parentCategory
      ? "name" in parentCategory
        ? parentCategory.name
        : parentCategory.categoryName
      : "";

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

  const handleAddCategory = async (data: AddCategoryData) => {
    setIsAddingCategory(true);
    try {
      await CategoryService.addCategory(data);
      setIsModalOpen(false);

      // Show success message
      alert("Category added successfully!");

      // Refresh the current view
      if (isViewingSubcategories && selectedCategoryId) {
        await fetchSubcategories(selectedCategoryId);
      } else {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await CategoryService.deleteCategory(id);

      // Remove the deleted category from the current list
      setCategories((prev) =>
        prev.filter((cat) => {
          const categoryId = "id" in cat ? cat.id : cat.categoryId;
          return categoryId !== id;
        })
      );

      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleCategoryClick = (category: Category | SubCategory) => {
    if (!isDeleteMode && !isViewingSubcategories) {
      const categoryId = "id" in category ? category.id : category.categoryId;
      fetchSubcategories(categoryId);
    }
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

  return (
    <div className="add-category-business-page">
      <Navbar />

      <div className="page-content">
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

            <div className="header-actions">
              {isViewingSubcategories && (
                <button
                  type="button"
                  className={`delete-mode-button ${
                    isDeleteMode ? "active" : ""
                  }`}
                  onClick={() => setIsDeleteMode(!isDeleteMode)}
                >
                  {isDeleteMode ? "✕ Cancel" : "🗑️ Delete"}
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : hasError ? (
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
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={getCategoryId(category)} className="category-card">
                  {isDeleteMode && (
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDeleteCategory(getCategoryId(category))
                      }
                    >
                      ✕
                    </button>
                  )}

                  <div
                    className="category-content"
                    onClick={() =>
                      !isDeleteMode && handleCategoryClick(category)
                    }
                    style={{ cursor: isDeleteMode ? "default" : "pointer" }}
                  >
                    <img
                      src={getCategoryImage(category)}
                      alt={getCategoryName(category)}
                      className="category-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.png";
                      }}
                    />
                    <p className="category-label">
                      {getCategoryName(category)}
                    </p>
                  </div>
                </div>
              ))}

              {isViewingSubcategories && (
                <div
                  className="category-card add-category-card"
                  onClick={() => setIsModalOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="add-category-content">
                    <div className="add-icon">+</div>
                    <p className="category-label">Add New Category</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCategory}
        parentCategoryId={selectedCategoryId || undefined}
        isLoading={isAddingCategory}
      />
    </div>
  );
};

export default AddSubCategoryBusiness;
