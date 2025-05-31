import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import CustomInputField from "../../components/InputField";
import CustomButton from "../../components/Button";
import {
  getUserProfile,
  updateUserProfile,
} from "../../service/Profile_service";
import "../../styles/Profile.css";

// Define interfaces for better type safety
interface ProfileData {
  firstName?: string;
  lastName?: string;
  address?: string;
  role?: string;
  phoneNumber?: string;
  email: string;
  image?: string;
}

const Profile: React.FC = () => {
  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("/photos/boy1.png");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSizeConfirmation, setShowSizeConfirmation] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const profileData: ProfileData = await getUserProfile();

        // Update form state with fetched data
        setFirstName(profileData.firstName || "");
        setLastName(profileData.lastName || "");
        setAddress(profileData.address || "");
        setRole(profileData.role || "");
        setPhoneNumber(profileData.phoneNumber || "");
        setEmail(profileData.email || "");

        // Set preview image if available from API
        if (profileData.image) {
          setPreviewImage(profileData.image);
        }

        setIsLoading(false);
      } catch (err: unknown) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile image change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Show confirmation dialog before changing the image
      setNewImage(file);
      setShowSizeConfirmation(true);
    }
  };

  // Handle image confirmation
  const handleConfirmImageChange = () => {
    if (newImage) {
      setProfileImage(newImage);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(newImage);

      // Close confirmation dialog
      setShowSizeConfirmation(false);
      setNewImage(null);
    }
  };

  // Handle image rejection
  const handleRejectImageChange = () => {
    setShowSizeConfirmation(false);
    setNewImage(null);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await updateUserProfile({
        firstName,
        lastName,
        phoneNumber,
        address,
        image: profileImage || undefined,
      });

      setSuccessMessage("Profile updated successfully!");
      setIsLoading(false);
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Toggle mobile menu function
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="profile-page">
      {/* Sidebar pinned on the left */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Main content area */}
      <div className="profile-content">
        {/* Navbar at the top of content */}
        <Navbar />

        {/* Top bar with color (#E8DCED) */}
        <div className="profile-top-bar">
          <div className="profile-image-container">
            <img
              src={previewImage}
              alt="User Avatar"
              className="profile-top-avatar"
            />
            <label
              htmlFor="profile-image-upload"
              className="image-upload-label"
            >
              Change Photo
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Main section for heading, form, etc. */}
        <div className="profile-main">
          <h2 className="profile-title">Profile Data</h2>

          {/* Display error message if any */}
          {error && <div className="error-message">{error}</div>}

          {/* Display success message if any */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="profile-form">
            {/* Row 1 */}
            <div className="profile-field">
              <label>First Name</label>
              <CustomInputField
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                {...(isLoading ? { disabled: true } : {})}
              />
            </div>
            <div className="profile-field">
              <label>Address</label>
              <CustomInputField
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                {...(isLoading ? { disabled: true } : {})}
              />
            </div>

            {/* Row 2 */}
            <div className="profile-field">
              <label>Last Name</label>
              <CustomInputField
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                {...(isLoading ? { disabled: true } : {})}
              />
            </div>
            <div className="profile-field">
              <label>Role</label>
              <CustomInputField
                type="text"
                placeholder="Your role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Row 3 */}
            <div className="profile-field">
              <label>Phone Number</label>
              <CustomInputField
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                {...(isLoading ? { disabled: true } : {})}
              />
            </div>

            {/* Row 4 */}
            <div className="profile-field">
              <label>Email</label>
              <CustomInputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Changes button */}
        <div className="profile-actions">
          <CustomButton
            text={isLoading ? "Saving..." : "Save Changes"}
            variant="primary"
            onClick={handleSaveChanges}
            {...(isLoading ? { disabled: true } : {})}
          />
        </div>
      </div>

      {/* Confirmation popup for image size change */}
      {showSizeConfirmation && (
        <div className="confirmation-popup-overlay">
          <div className="confirmation-popup">
            <h3>Confirm Image Change</h3>
            <p>Are you sure you want to update your profile picture?</p>
            <div className="confirmation-actions">
              <button
                className="confirm-button"
                onClick={handleConfirmImageChange}
              >
                Yes, Update
              </button>
              <button
                className="cancel-button"
                onClick={handleRejectImageChange}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
