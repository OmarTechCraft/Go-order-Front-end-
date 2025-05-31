import React, { useState, useEffect } from "react";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import "../../styles/Profile_B.css";
import Navbar from "../../components/navbar copy/Navbar";
import {
  getBusinessProfile,
  updateBusinessProfile,
} from "../../service/Profile_B_service";

const Profile_B: React.FC = () => {
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [businessImage, setBusinessImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingData(true);
        setError(null);
        const profile = await getBusinessProfile();

        // Handle profile data and check for 'undefined' strings
        setBusinessName(profile.businessName || "");
        setPhoneNumber(
          profile.phoneNumber === "undefined" ? "" : profile.phoneNumber || ""
        );
        setAddress(
          profile.address === "undefined" ? "" : profile.address || ""
        );
        setBankAccount(
          profile.bankAccountNumber === "undefined"
            ? ""
            : profile.bankAccountNumber || ""
        );
        setBusinessImage(profile.image || "");
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error loading profile:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadProfile();
  }, []);

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log("Selected file:", e.target.files[0]);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const profileData = {
        BusinessName: businessName.trim(),
        Address: address.trim(),
        PhoneNumber: phoneNumber.trim(),
        BankAccountNumber: bankAccount.trim(),
        Image: selectedFile || undefined,
      };

      await updateBusinessProfile(profileData);
      setSuccess("Profile updated successfully!");
      setSelectedFile(null); // Clear selected file after successful upload

      // Reload the profile data to get the updated information
      const updatedProfile = await getBusinessProfile();
      setBusinessName(updatedProfile.businessName || "");
      setPhoneNumber(
        updatedProfile.phoneNumber === "undefined"
          ? ""
          : updatedProfile.phoneNumber || ""
      );
      setAddress(
        updatedProfile.address === "undefined"
          ? ""
          : updatedProfile.address || ""
      );
      setBankAccount(
        updatedProfile.bankAccountNumber === "undefined"
          ? ""
          : updatedProfile.bankAccountNumber || ""
      );
      setBusinessImage(updatedProfile.image || "");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to update profile";
      setError(errorMessage);
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="profile_b-page">
        <Sidebar_2
          name="Yaqeen"
          email="yaq24@gmail.com"
          avatarUrl="/images/avatar.png"
        />
        <div className="profile_b-content">
          <Navbar />
          <div
            className="profile_b-main"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <div>Loading profile data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile_b-page">
      <Sidebar_2
        name="Yaqeen"
        email="yaq24@gmail.com"
        avatarUrl="/images/avatar.png"
      />

      <div className="profile_b-content">
        <Navbar />
        <div className="profile_b-topbar">
          <div className="profile_b-avatar-container">
            {businessImage ? (
              <img
                src={businessImage}
                alt="Business Avatar"
                className="profile_b-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/business_placeholder.jpg";
                }}
              />
            ) : (
              <div className="profile_b-avatar-placeholder">
                <span>📋</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile_b-main">
          <h2 className="profile_b-title">Business Profile Data</h2>

          {error && (
            <div
              className="error-message"
              style={{
                color: "red",
                marginBottom: "16px",
                padding: "10px",
                backgroundColor: "#ffe6e6",
                border: "1px solid #ff4444",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="success-message"
              style={{
                color: "green",
                marginBottom: "16px",
                padding: "10px",
                backgroundColor: "#e6ffe6",
                border: "1px solid #44ff44",
                borderRadius: "4px",
              }}
            >
              {success}
            </div>
          )}

          <div className="profile_b-form">
            {/* First column fields */}
            <div className="profile_b-field">
              <label>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={loading}
                placeholder="Enter business name"
              />
            </div>
            <div className="profile_b-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                placeholder="Enter phone number"
              />
            </div>
            <div className="profile_b-field">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
                placeholder="Enter address"
              />
            </div>

            {/* Second column fields */}
            <div className="profile_b-field">
              <label>Upload Image</label>
              <input
                type="file"
                id="profile_b-upload-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
                disabled={loading}
              />
              <button
                className="profile_b-upload-btn"
                onClick={() => {
                  document.getElementById("profile_b-upload-input")?.click();
                }}
                disabled={loading}
                type="button"
              >
                {selectedFile ? selectedFile.name : "Choose Image File"}
              </button>
              {selectedFile && (
                <small
                  style={{ display: "block", marginTop: "5px", color: "#666" }}
                >
                  Selected: {selectedFile.name}
                </small>
              )}
            </div>
            <div className="profile_b-field">
              <label>Bank Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                disabled={loading}
                placeholder="Enter bank account number"
              />
            </div>
          </div>

          <div className="profile_b-actions">
            <button
              className="profile_b-save-btn"
              onClick={handleSaveChanges}
              disabled={loading || loadingData}
              type="button"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile_B;
