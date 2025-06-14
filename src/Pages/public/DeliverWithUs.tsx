// DeliverWithUs.tsx
import React, { useRef, useState } from "react";
import CustomInputField from "../../components/InputField";
import CustomButton from "../../components/Button";
import { FaGoogle, FaFacebookF, FaApple, FaSpinner } from "react-icons/fa";
import "../../styles/deliverWithUs.css";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/api";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  address: string;
  vehicleType: string;
  gender: string;
}

const DeliverWithUs: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
    vehicleType: "",
    gender: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  const validateForm = (): boolean => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      address,
      gender,
    } = formData;

    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (!address.trim()) {
      setError("Address is required");
      return false;
    }
    if (!gender.trim()) {
      setError("Gender is required");
      return false;
    }
    if (!selectedFile) {
      setError("ID photo is required");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    // Prevent multiple submissions
    if (showSpinner) return;

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setShowSpinner(true);

    try {
      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();

      // Add the ID image file
      if (selectedFile) {
        formDataToSend.append("IdImage", selectedFile);
      }

      // Construct URL with query parameters
      const queryParams = new URLSearchParams({
        Email: formData.email,
        Password: formData.password,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        PhoneNumber: formData.phoneNumber,
        Address: formData.address,
        Gender: formData.gender,
        ...(formData.vehicleType && { VehicleType: formData.vehicleType }),
      });

      const response = await axiosInstance.post(
        `/api/Delivery/Register?${queryParams.toString()}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Registration successful! Welcome to our delivery team.");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          address: "",
          vehicleType: "",
          gender: "",
        });
        setPreviewUrl("");
        setSelectedFile(null);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        {/* LEFT SIDE (White background, form) */}
        <div className="auth-left">
          <h1 className="brand-logo">GoOrder</h1>
          <div className="auth-content">
            <h2 className="auth-heading">Join us as a delivery partner</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="auth-form">
              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="custom-label">First Name</label>
                  <CustomInputField
                    type="text"
                    placeholder="Your First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="custom-label">Last Name</label>
                  <CustomInputField
                    type="text"
                    placeholder="Your Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="custom-label">Phone</label>
                  <CustomInputField
                    type="tel"
                    placeholder="+20111111111"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="custom-label">Email Address</label>
                  <CustomInputField
                    type="email"
                    placeholder="username@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="custom-label">Address</label>
                  <CustomInputField
                    type="text"
                    placeholder="Your Address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="custom-label">Gender</label>
                  <select
                    className="custom-select"
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="custom-label">Password</label>
                  <CustomInputField
                    type="password"
                    placeholder="********"
                    showEyeIcon
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="custom-label">Confirm Password</label>
                  <CustomInputField
                    type="password"
                    placeholder="********"
                    showEyeIcon
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="custom-label">
                    Vehicle Type (Optional)
                  </label>
                  <select
                    className="custom-select"
                    value={formData.vehicleType}
                    onChange={(e) =>
                      handleInputChange("vehicleType", e.target.value)
                    }
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Car">Car</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="custom-label">Upload ID Photo</label>
                  <div className="upload-section">
                    <CustomButton
                      text="Upload"
                      variant="secondary"
                      className="custom-upload-button"
                      onClick={handleFileButtonClick}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="file-input"
                      accept="image/*"
                    />
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="thumbnail-preview"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <CustomButton
                text={showSpinner ? "Registering..." : "Register"}
                variant="primary"
                className="register-button"
                onClick={handleRegister}
              />

              {/* Social sign-up */}
              <div className="social-section">
                <p className="social-text">Or sign up with</p>
                <div className="social-buttons">
                  <button className="social-btn">
                    <FaGoogle className="social-icon" />
                  </button>
                  <button className="social-btn">
                    <FaFacebookF className="social-icon" />
                  </button>
                  <button className="social-btn">
                    <FaApple className="social-icon" />
                  </button>
                </div>
              </div>

              {/* Sign In link */}
              <p className="register-text">
                Already have an account?{" "}
                <Link to="/login" className="register-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Purple background, illustration) */}
        <div className="auth-right">
          <img src="/a.png" alt="Illustration" className="auth-illustration" />
        </div>
      </div>

      {/* Spinner Overlay */}
      {showSpinner && (
        <div className="spinner-overlay">
          <FaSpinner className="spinner-icon" />
        </div>
      )}
    </>
  );
};

export default DeliverWithUs;
