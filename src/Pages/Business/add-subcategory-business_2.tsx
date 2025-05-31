import React, { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2"; // Adjust the import path as needed
import "../../styles/add-subcategory-business_2.css"; // Adjust the import path as needed
import Navbar from "../../components/navbar copy/Navbar";

const AddSubcategoryBusiness_2: React.FC = () => {
  // Define the page status: "market" displays images and the file upload option,
  // "drinks" hides the file upload option in the pop-up.
  const pageStatus = "market"; // Change to "drinks" to hide the file upload option

  // Local state to toggle the pop-up (modal)
  const [showPopup, setShowPopup] = useState(false);
  // Local state for storing the selected image URL for preview
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Reference to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers for opening/closing the modal
  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // Trigger the hidden file input when the "Add" button is clicked
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection and update the preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  // Example subcategory data to match the screenshot
  const subcategories = [
    {
      label: "Dresses",
      image: "/images/dresses.png",
    },
    {
      label: "Shoes",
      image: "/images/shoes.png",
    },
    {
      label: "T-Shirts",
      image: "/images/tshirts.png",
    },
    {
      label: "Trousers",
      image: "/images/trousers.png",
    },
    {
      label: "Bags",
      image: "/images/bags.png",
    },
    {
      label: "Skirts",
      image: "/images/skirts.png",
    },
  ];

  return (
    <div className="add-subcategory-business-page">
      <Navbar />

      {/* Wrap main content with a container that will be blurred if the popup is active */}
      <div className={`page-content${showPopup ? " blurred" : ""}`}>
        {/* Sidebar */}
        <Sidebar_2
          name="Yaqeen"
          email="yaq24@gmail.com"
          avatarUrl="/avatar.jpg"
        />

        {/* Main content area */}
        <div className="add-subcategory-business-content">
          {/* Header: Page title and Add Subcategory button */}
          <div className="add-subcategory-business-header">
            <h1 className="page-title">Add Subcategory</h1>
            <button
              className="add-subcategory-button"
              onClick={handleOpenPopup}
            >
              <FaPlus className="plus-icon" />
              Add SubCategory
            </button>
          </div>

          {/* Subheading */}
          <h2 className="subcategories-heading">Fresh Fruit:</h2>

          {/* Subcategories grid */}
          <div className="subcategories-grid">
            {subcategories.map((item, index) => (
              <div className="subcategory-card" key={index}>
                {pageStatus === "market" && (
                  <img
                    src={item.image}
                    alt={item.label}
                    className="subcategory-image"
                  />
                )}
                <p className="subcategory-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Modal (Pop-up) */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={stopPropagation}>
            <h2 className="popup-title">Add New Subcategory</h2>

            {/* Form Fields */}
            <div className="form-group">
              <label htmlFor="subcategoryName" className="input-label">
                Subcategory Name
              </label>
              <input
                id="subcategoryName"
                type="text"
                className="text-input"
                placeholder="Enter subcategory name"
              />
            </div>

            {/* Conditional Upload Photo section */}
            {pageStatus === "market" && (
              <div className="form-group">
                <label className="input-label">Upload Photo</label>
                <div className="upload-section">
                  {/* Upload placeholder displays the image preview at the designated size */}
                  <div className="upload-photo-placeholder">
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="uploaded-image"
                      />
                    )}
                  </div>
                  {/* "Add" button triggers file selection */}
                  <div className="upload-add-box" onClick={handleUploadClick}>
                    <FaPlus className="upload-add-icon" />
                    <span>Add</span>
                  </div>
                </div>
              </div>
            )}

            {/* Save button - centered */}
            <div className="popup-actions">
              <button className="save-button" onClick={handleClosePopup}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSubcategoryBusiness_2;
