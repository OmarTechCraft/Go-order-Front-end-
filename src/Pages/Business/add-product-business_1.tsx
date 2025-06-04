import React, { useState, useEffect } from "react";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import Navbar from "../../components/navbar copy/Navbar";

import "../../styles/add-product-business_1.css";
import productService, {
  Category,
  SubCategory,
  Product,
  Variant,
  NewProduct,
} from "../../service/add-product-service";

const AddProductBusiness_1: React.FC = () => {
  // Define states
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<
    "categories" | "subcategories" | "products"
  >("categories");

  // New product form state
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    categoryId: 0,
    price: 0,
    stock: 0,
    variants: [],
    images: [],
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch categories");
      setLoading(false);
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch subcategories for a specific parent category
  const fetchSubCategories = async (parentId: number) => {
    try {
      setLoading(true);
      const subCategoriesData = await productService.getSubCategories(parentId);
      setSubCategories(subCategoriesData);
      setSelectedCategoryId(parentId);
      setSelectedSubCategoryId(null); // Reset subcategory ID when viewing subcategories
      setLoading(false);

      // Check if there are subcategories
      if (subCategoriesData.length > 0) {
        setViewMode("subcategories");
      } else {
        // If no subcategories, fetch products directly
        fetchProducts(parentId);
      }
    } catch (err) {
      setError("Failed to fetch subcategories");
      setLoading(false);
      console.error("Error fetching subcategories:", err);
    }
  };

  // Fetch products for a specific category
  const fetchProducts = async (categoryId: number) => {
    try {
      setLoading(true);
      const productsData = await productService.getProducts(categoryId);
      setProducts(productsData);
      setLoading(false);
      setViewMode("products");
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
      console.error("Error fetching products:", err);
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    if (selectedCategoryId === categoryId && viewMode !== "categories") {
      // If clicking the same category again, go back to all categories
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setSelectedCategoryName("");
      setSubCategories([]);
      setViewMode("categories");
    } else {
      // Save the category name for better UI context
      setSelectedCategoryName(categoryName);

      // Fetch subcategories for the selected category
      // The logic to show products or subcategories is handled in fetchSubCategories
      fetchSubCategories(categoryId);
    }
  };

  // Handle subcategory click
  const handleSubcategoryClick = (
    subCategoryId: number,
    subCategoryName: string
  ) => {
    setSelectedCategoryName(subCategoryName);
    setSelectedSubCategoryId(subCategoryId); // Store the selected subcategory ID
    fetchProducts(subCategoryId);
  };

  // State for edit product form
  const [showEditProductForm, setShowEditProductForm] =
    useState<boolean>(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<{
    id: number;
    name: string;
    categoryId: number;
    price: number;
    stock: number;
  } | null>(null);

  // Open edit product form
  const openEditProductForm = (product: Product) => {
    setCurrentEditProduct({
      id: product.id,
      name: product.name,
      categoryId:
        product.category?.id ||
        selectedSubCategoryId ||
        (selectedCategoryId as number),
      price: product.price,
      stock: product.stock,
    });
    setShowEditProductForm(true);
  };

  // Handle input change for edit product form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!currentEditProduct) return;

    setCurrentEditProduct({
      ...currentEditProduct,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  // Submit edit product
  const handleSubmitEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditProduct) return;

    try {
      setLoading(true);

      // Call the service method to update the product
      await productService.updateProduct(currentEditProduct.id, {
        name: currentEditProduct.name,
        categoryId: currentEditProduct.categoryId,
        price: currentEditProduct.price,
        stock: currentEditProduct.stock,
      });

      // Close form and refresh products
      setShowEditProductForm(false);
      setCurrentEditProduct(null);

      // Refresh products in the current view - use the correct ID
      const currentCategoryId = selectedSubCategoryId || selectedCategoryId;
      if (currentCategoryId) {
        fetchProducts(currentCategoryId);
      }

      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);

      let errorMessage = "Failed to update product. Please try again.";

      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response: { status: number; data: unknown };
        };
        console.error("Response error:", {
          status: errorResponse.response.status,
          data: errorResponse.response.data,
        });

        if (typeof errorResponse.response.data === "string") {
          errorMessage = `Error ${errorResponse.response.status}: ${errorResponse.response.data}`;
        } else if (typeof errorResponse.response.data === "object") {
          const errorData = JSON.stringify(errorResponse.response.data);
          errorMessage = `Error ${errorResponse.response.status}: ${errorData}`;
        }
      }

      setError(errorMessage);
      console.error("Full error object:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);

      // Call the service method to delete the product
      await productService.deleteProduct(productId);

      // Refresh products in the current view - use the correct ID
      const currentCategoryId = selectedSubCategoryId || selectedCategoryId;
      if (currentCategoryId) {
        fetchProducts(currentCategoryId);
      }

      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);

      let errorMessage = "Failed to delete product. Please try again.";

      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response: { status: number; data: unknown };
        };
        console.error("Response error:", {
          status: errorResponse.response.status,
          data: errorResponse.response.data,
        });

        if (typeof errorResponse.response.data === "string") {
          errorMessage = `Error ${errorResponse.response.status}: ${errorResponse.response.data}`;
        } else if (typeof errorResponse.response.data === "object") {
          const errorData = JSON.stringify(errorResponse.response.data);
          errorMessage = `Error ${errorResponse.response.status}: ${errorData}`;
        }
      }

      setError(errorMessage);
      console.error("Full error object:", err);
    }
  };

  // Open add product form
  const openAddProductForm = (id: number) => {
    setNewProduct({
      ...newProduct,
      categoryId: id,
    });
    setShowAddProductForm(true);
  };

  // Handle input change for the new product form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  // Add a new variant to the product
  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now(), // Use timestamp for unique ID
      price: 0,
      image: "",
      stock: 0,
      color: "",
      size: "",
      weight: "",
    };
    setNewProduct({
      ...newProduct,
      variants: [...newProduct.variants, newVariant],
    });
  };

  // Handle variant input change
  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number | File
  ) => {
    const updatedVariants = [...newProduct.variants];
    if (field === "price" || field === "stock") {
      updatedVariants[index][field] = parseFloat(value as string);
    } else if (field === "id") {
      updatedVariants[index][field] = Number(value);
    } else if (field === "image") {
      if (value instanceof File) {
        // Handle File type for image field
        updatedVariants[index][field] = value as File & string;
      } else {
        updatedVariants[index][field] = value as string;
      }
    } else {
      updatedVariants[index][field as "color" | "size" | "weight"] =
        value as string;
    }

    setNewProduct({
      ...newProduct,
      variants: updatedVariants,
    });
  };

  // Handle file input change for product images
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (index !== undefined) {
      // For variant image
      handleVariantChange(index, "image", file);
    } else {
      // For product images
      const updatedImages = [...newProduct.images];
      updatedImages.push(file);
      setNewProduct({
        ...newProduct,
        images: updatedImages,
      });
    }
  };

  // Remove an image from product images
  const removeImage = (index: number) => {
    const updatedImages = [...newProduct.images];
    updatedImages.splice(index, 1);
    setNewProduct({
      ...newProduct,
      images: updatedImages,
    });
  };

  // Submit new product - Using the service
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Call the service method to add the product
      await productService.addProduct(newProduct);

      // Reset form and close it
      setNewProduct({
        name: "",
        categoryId: 0,
        price: 0,
        stock: 0,
        variants: [],
        images: [],
      });
      setShowAddProductForm(false);
      setLoading(false);

      // Refresh products in the current view - use the correct ID
      const currentCategoryId = selectedSubCategoryId || selectedCategoryId;
      if (currentCategoryId) {
        fetchProducts(currentCategoryId);
      }
    } catch (err: unknown) {
      setLoading(false);

      let errorMessage =
        "Failed to add product. Please check your inputs and try again.";

      if (err && typeof err === "object") {
        if ("response" in err) {
          const errorResponse = err as {
            response: { status: number; data: unknown };
          };
          console.error("Response error:", {
            status: errorResponse.response.status,
            data: errorResponse.response.data,
          });

          if (typeof errorResponse.response.data === "string") {
            errorMessage = `Error ${errorResponse.response.status}: ${errorResponse.response.data}`;
          } else if (typeof errorResponse.response.data === "object") {
            const errorData = JSON.stringify(errorResponse.response.data);
            errorMessage = `Error ${errorResponse.response.status}: ${errorData}`;
          }
        } else if ("request" in err) {
          errorMessage =
            "No response received from server. Please check your internet connection.";
        } else if (
          "message" in err &&
          typeof (err as { message: string }).message === "string"
        ) {
          errorMessage = `Error: ${(err as { message: string }).message}`;
        }
      }

      setError(errorMessage);
      console.error("Full error object:", err);
    }
  };

  // Remove a variant
  const removeVariant = (index: number) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants.splice(index, 1);
    setNewProduct({
      ...newProduct,
      variants: updatedVariants,
    });
  };

  // Go back to categories from current view
  const backToCategories = () => {
    setViewMode("categories");
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedCategoryName("");
    setProducts([]);
    setSubCategories([]);
  };

  // Go back to subcategories from products view
  const backToSubcategories = () => {
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
    } else {
      backToCategories();
    }
  };

  // Render products list
  const renderProducts = () => {
    return (
      <>
        <div className="subcategory-header">
          <h2 className="categories-heading">
            Products {selectedCategoryName ? `- ${selectedCategoryName}` : ""}
          </h2>
          <div>
            {viewMode === "products" && selectedSubCategoryId && (
              <button className="back-button" onClick={backToSubcategories}>
                Back to Subcategories
              </button>
            )}
            {viewMode === "products" && (
              <button className="back-button" onClick={backToCategories}>
                Back to Categories
              </button>
            )}
            <button
              className="add-product-button"
              onClick={() =>
                openAddProductForm(selectedSubCategoryId || selectedCategoryId!)
              }
            >
              Add New Product
            </button>
          </div>
        </div>

        <div className="categories-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="category-card">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : "/placeholder.png"
                  }
                  alt={product.name}
                  className="category-image"
                />
                <p className="category-label">{product.name}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <p className="product-rating">Rating: {product.rating}/5</p>
                {product.variants && product.variants.length > 0 && (
                  <span className="has-variants">
                    {product.variants.length} variants
                  </span>
                )}
                <div className="product-actions">
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditProductForm(product);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </>
    );
  };

  // Render subcategories
  const renderSubcategories = () => {
    return (
      <>
        <div className="subcategory-header">
          <h2 className="categories-heading">
            Subcategories of {selectedCategoryName}
          </h2>
          <div>
            <button className="back-button" onClick={backToCategories}>
              Back to Categories
            </button>
            <button
              className="add-product-button"
              onClick={() => openAddProductForm(selectedCategoryId!)}
            >
              Add Product to Category
            </button>
          </div>
        </div>

        <div className="categories-grid">
          {subCategories.length > 0 ? (
            subCategories.map((subCategory) => (
              <div
                key={subCategory.categoryId}
                className="category-card"
                onClick={() =>
                  handleSubcategoryClick(
                    subCategory.categoryId,
                    subCategory.categoryName
                  )
                }
              >
                <img
                  src={subCategory.categoryImage || "/placeholder.png"}
                  alt={subCategory.categoryName}
                  className="category-image"
                />
                <p className="category-label">{subCategory.categoryName}</p>
                <button className="view-button">View Products</button>
              </div>
            ))
          ) : (
            <p>
              No subcategories found. You can add a product directly to this
              category.
            </p>
          )}
        </div>
      </>
    );
  };

  // Render categories
  const renderCategories = () => {
    return (
      <>
        <h2 className="categories-heading">Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id, category.name)}
            >
              <img
                src={category.image || "/placeholder.png"}
                alt={category.name}
                className="category-image"
              />
              <p className="category-label">{category.name}</p>
              {category.subCategories && category.subCategories.length > 0 && (
                <span className="has-subcategories">Has subcategories</span>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  // Render content based on current view mode
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    switch (viewMode) {
      case "products":
        return renderProducts();
      case "subcategories":
        return renderSubcategories();
      case "categories":
      default:
        return renderCategories();
    }
  };

  return (
    <div className="add-category-business-page">
      <Navbar />

      {/* Main content container */}
      <div className="page-content">
        {/* Sidebar */}
        <Sidebar_2 />

        {/* Main content area */}
        <div className="add-category-business-content">
          {/* Header */}
          <div className="add-category-business-header">
            <h1 className="page-title">
              {viewMode === "products"
                ? "View Products"
                : viewMode === "subcategories"
                ? "Select Subcategory"
                : "Select Category"}
            </h1>
          </div>

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* Main Content */}
          {renderContent()}

          {/* Add Product Form Modal */}
          {showAddProductForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Add New Product</h2>
                  <button
                    className="close-button"
                    onClick={() => setShowAddProductForm(false)}
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmitProduct}>
                  <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>

                  {/* Product Images */}
                  <div className="form-section">
                    <h3>Product Images</h3>
                    <div className="file-upload-container">
                      <label
                        htmlFor="product-image"
                        className="file-upload-label"
                      >
                        <span>Upload Product Image</span>
                      </label>
                      <input
                        type="file"
                        id="product-image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                    </div>

                    {newProduct.images.length > 0 && (
                      <div className="image-preview-container">
                        {newProduct.images.map((image, index) => (
                          <div key={`image-${index}`} className="image-preview">
                            <div className="image-preview-content">
                              {image instanceof File ? (
                                <div className="file-name">
                                  {image.name}
                                  <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => removeImage(index)}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ) : (
                                <div className="url-name">
                                  {typeof image === "string" ? image : ""}
                                  <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => removeImage(index)}
                                  >
                                    &times;
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Variants */}
                  <div className="form-section">
                    <h3>Variants</h3>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="add-button"
                    >
                      Add Variant
                    </button>

                    {newProduct.variants.map((variant, vIndex) => (
                      <div key={`variant-${vIndex}`} className="variant-item">
                        <div className="variant-header">
                          <h4>Variant #{vIndex + 1}</h4>
                          <button
                            type="button"
                            className="remove-variant"
                            onClick={() => removeVariant(vIndex)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="form-group">
                          <label htmlFor={`variant-price-${vIndex}`}>
                            Price
                          </label>
                          <input
                            type="number"
                            id={`variant-price-${vIndex}`}
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "price",
                                e.target.value
                              )
                            }
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`variant-stock-${vIndex}`}>
                            Stock
                          </label>
                          <input
                            type="number"
                            id={`variant-stock-${vIndex}`}
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "stock",
                                e.target.value
                              )
                            }
                            min="0"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`variant-color-${vIndex}`}>
                            Color
                          </label>
                          <input
                            type="text"
                            id={`variant-color-${vIndex}`}
                            value={variant.color}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "color",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`variant-size-${vIndex}`}>Size</label>
                          <input
                            type="text"
                            id={`variant-size-${vIndex}`}
                            value={variant.size}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "size",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`variant-weight-${vIndex}`}>
                            Weight
                          </label>
                          <input
                            type="text"
                            id={`variant-weight-${vIndex}`}
                            value={variant.weight}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "weight",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`variant-image-${vIndex}`}>
                            Variant Image
                          </label>
                          <input
                            type="file"
                            id={`variant-image-${vIndex}`}
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, vIndex)}
                            className="file-input"
                            required
                          />
                          {variant.image instanceof File && (
                            <div className="file-name">
                              {variant.image.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Product"}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setShowAddProductForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Form Modal */}
          {showEditProductForm && currentEditProduct && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Edit Product</h2>
                  <button
                    className="close-button"
                    onClick={() => setShowEditProductForm(false)}
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmitEditProduct}>
                  <div className="form-group">
                    <label htmlFor="edit-name">Product Name</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={currentEditProduct.name}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-price">Price</label>
                    <input
                      type="number"
                      id="edit-price"
                      name="price"
                      value={currentEditProduct.price}
                      onChange={handleEditInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-stock">Stock</label>
                    <input
                      type="number"
                      id="edit-stock"
                      name="stock"
                      value={currentEditProduct.stock}
                      onChange={handleEditInputChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Product"}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setShowEditProductForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductBusiness_1;
