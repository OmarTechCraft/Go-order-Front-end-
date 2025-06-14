import React, { useRef, useState, useEffect } from "react";
import CustomInputField from "../../components/InputField";
import CustomButton from "../../components/Button";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import "../../styles/register.css";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import api from "../../api/api"; // Your API client

interface RegisterFormData {
  name: string;
  PhoneNumber: string;
  Address: string;
  Email: string;
  BankAccountNumber: string;
  Password: string;
  ConfirmPassword: string;
  GlobalCategoryId: number;
  SpecificCategoryId: number | null;
  Image: File | null;
  IdImage: File | null;
}

// Define error type for better type safety
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
  status?: number; // Added status for potential HTTP status checks
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null); // State for toast pop-up
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs for file inputs
  const businessImageRef = useRef<HTMLInputElement>(null);
  const idImageRef = useRef<HTMLInputElement>(null);

  // Preview URLs for images
  const [businessImagePreview, setBusinessImagePreview] = useState<string>("");
  const [idImagePreview, setIdImagePreview] = useState<string>("");

  // Form data state
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    PhoneNumber: "",
    Address: "",
    Email: "",
    BankAccountNumber: "",
    Password: "",
    ConfirmPassword: "",
    GlobalCategoryId: 0,
    SpecificCategoryId: null,
    Image: null,
    IdImage: null,
  });

  // State to track validation errors for each field
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string | null;
  }>({});

  // Handle input focus animation
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Initial form element animation and focus/blur listeners
  useEffect(() => {
    const formElements = document.querySelectorAll(
      ".form-group, .form-row, .register-button, .social-section"
    );
    formElements.forEach((element, index) => {
      setTimeout(() => {
        (element as HTMLElement).style.opacity = "1";
        (element as HTMLElement).style.transform = "translateY(0)";
      }, 100 + index * 100);
    });

    const addFocusListeners = () => {
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="password"]'
      );
      inputs.forEach((input) => {
        input.addEventListener("focus", handleInputFocusEvent);
        input.addEventListener("blur", handleInputBlurEvent);
      });
    };

    setTimeout(addFocusListeners, 100);

    return () => {
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="password"]'
      );
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleInputFocusEvent);
        input.removeEventListener("blur", handleInputBlurEvent);
      });
    };
  }, []);

  // Function to show toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, 5000); // Toast disappears after 5 seconds
    return () => clearTimeout(timeout); // Cleanup function for useEffect/etc.
  };

  // --- Validation Functions ---
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Invalid email format.";
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one capital letter.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    return null;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    return password === confirmPassword ? null : "Passwords do not match.";
  };

  const validatePhoneNumber = (phoneNumber: string): string | null => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    if (!cleanedPhoneNumber) {
      return "Phone Number is required.";
    }
    if (!/^\d+$/.test(cleanedPhoneNumber)) {
      return "Phone number must contain only digits.";
    }
    if (!cleanedPhoneNumber.startsWith("01")) {
      return "Phone number must start with '01'.";
    }
    if (cleanedPhoneNumber.length !== 11) {
      return "Phone number must be exactly 11 digits long.";
    }
    return null;
  };

  const validateBankAccountNumber = (accountNumber: string): string | null => {
    if (!accountNumber.trim()) {
      return "Bank Account Number is required.";
    }
    if (!/^[a-zA-Z0-9]+$/.test(accountNumber)) {
      return "Bank account number can only contain letters and numbers.";
    }
    if (accountNumber.length > 29) {
      return "Bank account number cannot exceed 29 characters.";
    }
    return null;
  };

  // Handle input focus event
  const handleInputFocusEvent = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const fieldName =
      target.name || target.placeholder.toLowerCase().replace(/\s+/g, "");
    setFocusedField(fieldName);
  };

  // Handle input blur event
  const handleInputBlurEvent = () => {
    setFocusedField(null);
  };

  // Handle input changes with validation and formatting
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName?: string
  ) => {
    const { name, value } = e.target;
    const field = fieldName || name;
    let newValue = value;

    // Apply specific formatting for BankAccountNumber
    if (field === "BankAccountNumber") {
      newValue = value.toUpperCase().substring(0, 29);
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, "");
    }
    // For phone number, only allow digits
    else if (field === "PhoneNumber") {
      newValue = value.replace(/\D/g, "");
    }

    // Add ripple effect for text/password inputs (excluding file inputs)
    if (e.target instanceof HTMLInputElement && e.target.type !== "file") {
      const ripple = document.createElement("span");
      ripple.classList.add("input-ripple");
      e.target.closest(".form-group")?.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 500);
    }

    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [field]: newValue };

      // Perform validation for the current field
      let fieldError: string | null = null;
      if (field === "Email") {
        fieldError = validateEmail(newFormData.Email);
      } else if (field === "Password") {
        fieldError = validatePassword(newFormData.Password);
      } else if (field === "ConfirmPassword") {
        fieldError = validateConfirmPassword(
          newFormData.Password,
          newFormData.ConfirmPassword
        );
      } else if (field === "PhoneNumber") {
        fieldError = validatePhoneNumber(newFormData.PhoneNumber);
      } else if (field === "BankAccountNumber") {
        fieldError = validateBankAccountNumber(newFormData.BankAccountNumber);
      } else if (
        typeof newFormData[field as keyof RegisterFormData] === "string" &&
        (newFormData[field as keyof RegisterFormData] as string).trim() === ""
      ) {
        fieldError = `${field.replace(/([A-Z])/g, " $1").trim()} is required.`;
      } else {
        fieldError = null;
      }

      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field]: fieldError,
      }));

      return newFormData;
    });
  };

  // File upload handlers
  const handleBusinessImageUpload = () => {
    businessImageRef.current?.click();
  };

  const handleIdImageUpload = () => {
    idImageRef.current?.click();
  };

  const handleBusinessImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, Image: file }));
      const preview = URL.createObjectURL(file);
      setBusinessImagePreview(preview);
      setValidationErrors((prevErrors) => ({ ...prevErrors, Image: null }));
    } else {
      setBusinessImagePreview("");
      setFormData((prev) => ({ ...prev, Image: null }));
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Image: "Please upload your business image.",
      }));
    }
  };

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, IdImage: file }));
      const preview = URL.createObjectURL(file);
      setIdImagePreview(preview);
      setValidationErrors((prevErrors) => ({ ...prevErrors, IdImage: null }));
    } else {
      setIdImagePreview("");
      setFormData((prev) => ({ ...prev, IdImage: null }));
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        IdImage: "Please upload your ID image.",
      }));
    }
  };

  // Category selection handlers
  const handleGlobalCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const globalCategoryId = parseInt(e.target.value);
    e.target.classList.add("select-changed");
    setTimeout(() => {
      e.target.classList.remove("select-changed");
    }, 500);
    setFormData({
      ...formData,
      GlobalCategoryId: globalCategoryId,
      SpecificCategoryId: null,
    });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      GlobalCategoryId: null,
      SpecificCategoryId: null,
    }));
  };

  const handleSpecificCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const specificCategoryId = parseInt(e.target.value);
    e.target.classList.add("select-changed");
    setTimeout(() => {
      e.target.classList.remove("select-changed");
    }, 500);
    setFormData({
      ...formData,
      SpecificCategoryId: specificCategoryId,
    });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      SpecificCategoryId: null,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setValidationErrors({}); // Clear all specific errors before re-validation

    let errorsDuringSubmission: { [key: string]: string | null } = {};

    // Re-run all validations to catch any missed or final checks
    const nameError = formData.name.trim()
      ? null
      : "Business Name is required.";
    const phoneError = validatePhoneNumber(formData.PhoneNumber);
    const addressError = formData.Address.trim()
      ? null
      : "Address is required.";
    const emailError =
      validateEmail(formData.Email) ||
      (formData.Email.trim() ? null : "Email is required.");
    const bankAccountError = validateBankAccountNumber(
      formData.BankAccountNumber
    );
    const passwordError = validatePassword(formData.Password);
    const confirmPasswordError = validateConfirmPassword(
      formData.Password,
      formData.ConfirmPassword
    );
    const globalCategoryError =
      formData.GlobalCategoryId === 0
        ? "Please select a business category."
        : null;
    const specificCategoryError =
      formData.GlobalCategoryId === 6 && formData.SpecificCategoryId === null
        ? "Please select a specific restaurant category."
        : null;
    const imageError = formData.Image
      ? null
      : "Please upload your business image.";
    const idImageError = formData.IdImage
      ? null
      : "Please upload your ID image.";

    if (nameError) errorsDuringSubmission.name = nameError;
    if (phoneError) errorsDuringSubmission.PhoneNumber = phoneError;
    if (addressError) errorsDuringSubmission.Address = addressError;
    if (emailError) errorsDuringSubmission.Email = emailError;
    if (bankAccountError)
      errorsDuringSubmission.BankAccountNumber = bankAccountError;
    if (passwordError) errorsDuringSubmission.Password = passwordError;
    if (confirmPasswordError)
      errorsDuringSubmission.ConfirmPassword = confirmPasswordError;
    if (globalCategoryError)
      errorsDuringSubmission.GlobalCategoryId = globalCategoryError;
    if (specificCategoryError)
      errorsDuringSubmission.SpecificCategoryId = specificCategoryError;
    if (imageError) errorsDuringSubmission.Image = imageError;
    if (idImageError) errorsDuringSubmission.IdImage = idImageError;

    // If any client-side validation errors, update state and stop
    if (Object.values(errorsDuringSubmission).some((err) => err !== null)) {
      setValidationErrors(errorsDuringSubmission); // Set all found errors
      setLoading(false);
      return; // Stop submission
    }

    // If no client-side validation errors, proceed with API submission
    try {
      const requestData = new FormData();
      requestData.append("name", formData.name);
      requestData.append(
        "PhoneNumber",
        formData.PhoneNumber.replace(/\D/g, "")
      );
      requestData.append("Address", formData.Address);
      requestData.append("Email", formData.Email);
      requestData.append("BankAccountNumber", formData.BankAccountNumber);
      requestData.append("Password", formData.Password);
      requestData.append(
        "GlobalCategoryId",
        formData.GlobalCategoryId.toString()
      );
      if (formData.SpecificCategoryId) {
        requestData.append(
          "SpecificCategoryId",
          formData.SpecificCategoryId.toString()
        );
      }
      if (formData.Image) {
        requestData.append("Image", formData.Image);
      }
      if (formData.IdImage) {
        requestData.append("IdImage", formData.IdImage);
      }

      const response = await api.post("/api/Business/Register", requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          "Registration submitted!! .. wait for email response .."
        );
        document
          .querySelector(".auth-content")
          ?.classList.add("registration-success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Registration failed. Please try again.";

      // Check for specific backend error messages for toast
      if (errorMessage.includes("Phone number already taken")) {
        showToast(
          "Registration failed: This phone number is already registered."
        );
        setValidationErrors((prev) => ({
          ...prev,
          PhoneNumber: "This phone number is already registered.",
        }));
      } else if (errorMessage.includes("Email already taken")) {
        showToast("Registration failed: This email is already registered.");
        setValidationErrors((prev) => ({
          ...prev,
          Email: "This email is already registered.",
        }));
      } else {
        // For any other unexpected API error, show a generic toast message
        showToast(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const showRestaurantCategories = formData.GlobalCategoryId === 6;

  return (
    <>
      <div className="auth-container">
        {/* LEFT SIDE (White background, form) */}
        <div className="auth-left">
          {/* GoOrder Title now navigates to home page */}
          <Link to="/" className="brand-logo-link">
            <h1 className="brand-logo animate-logo">GoOrder</h1>
          </Link>
          <div
            className={`auth-content ${
              successMessage ? "registration-success" : ""
            }`}
          >
            <h2 className="auth-heading animate-heading">
              Be a Partner as a Business
            </h2>

            {/* General error message removed completely from here */}

            <form className="auth-form register-form" onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "name" ? "label-focus" : ""
                    }`}
                  >
                    Business Name
                  </label>
                  <CustomInputField
                    type="text"
                    name="name"
                    placeholder="Your Business Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    className={
                      validationErrors.name
                        ? "is-invalid"
                        : formData.name.trim()
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.name && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.name ? "show" : ""
                      }`}
                    >
                      {validationErrors.name}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "PhoneNumber" ? "label-focus" : ""
                    }`}
                  >
                    Phone
                  </label>
                  <CustomInputField
                    type="tel" // Use tel type for better mobile keyboard
                    name="PhoneNumber"
                    placeholder="01XXXXXXXXX" // Example of expected format
                    value={formData.PhoneNumber}
                    onChange={(e) => handleInputChange(e, "PhoneNumber")}
                    className={
                      validationErrors.PhoneNumber
                        ? "is-invalid"
                        : formData.PhoneNumber.trim() &&
                          !validationErrors.PhoneNumber
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.PhoneNumber && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.PhoneNumber ? "show" : ""
                      }`}
                    >
                      {validationErrors.PhoneNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "Email" ? "label-focus" : ""
                    }`}
                  >
                    Email Address
                  </label>
                  <CustomInputField
                    type="email"
                    name="Email"
                    placeholder="username@gmail.com"
                    value={formData.Email}
                    onChange={(e) => handleInputChange(e, "Email")}
                    className={
                      validationErrors.Email
                        ? "is-invalid"
                        : formData.Email.trim() && !validationErrors.Email
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.Email && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.Email ? "show" : ""
                      }`}
                    >
                      {validationErrors.Email}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "BankAccountNumber" ? "label-focus" : ""
                    }`}
                  >
                    Bank Account
                  </label>
                  <CustomInputField
                    type="text" // Keep as text for letters
                    name="BankAccountNumber"
                    placeholder="Account Number (max 29 chars)" // Updated hint
                    value={formData.BankAccountNumber}
                    onChange={(e) => handleInputChange(e, "BankAccountNumber")}
                    className={
                      validationErrors.BankAccountNumber
                        ? "is-invalid"
                        : formData.BankAccountNumber.trim() &&
                          !validationErrors.BankAccountNumber
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.BankAccountNumber && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.BankAccountNumber ? "show" : ""
                      }`}
                    >
                      {validationErrors.BankAccountNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Row */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "Address" ? "label-focus" : ""
                    }`}
                  >
                    Address
                  </label>
                  <CustomInputField
                    type="text"
                    name="Address"
                    placeholder="Your Business Address"
                    value={formData.Address}
                    onChange={(e) => handleInputChange(e, "Address")}
                    className={
                      validationErrors.Address
                        ? "is-invalid"
                        : formData.Address.trim()
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.Address && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.Address ? "show" : ""
                      }`}
                    >
                      {validationErrors.Address}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3 - Passwords */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "Password" ? "label-focus" : ""
                    }`}
                  >
                    Password
                  </label>
                  <CustomInputField
                    type="password"
                    name="Password"
                    placeholder="********"
                    showEyeIcon
                    value={formData.Password}
                    onChange={(e) => handleInputChange(e, "Password")}
                    className={
                      validationErrors.Password
                        ? "is-invalid"
                        : formData.Password && !validationErrors.Password
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.Password && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.Password ? "show" : ""
                      }`}
                    >
                      {validationErrors.Password}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "ConfirmPassword" ? "label-focus" : ""
                    }`}
                  >
                    Confirm Password
                  </label>
                  <CustomInputField
                    type="password"
                    name="ConfirmPassword"
                    placeholder="********"
                    showEyeIcon
                    value={formData.ConfirmPassword}
                    onChange={(e) => handleInputChange(e, "ConfirmPassword")}
                    className={
                      validationErrors.ConfirmPassword
                        ? "is-invalid"
                        : formData.ConfirmPassword &&
                          !validationErrors.ConfirmPassword
                        ? "is-valid"
                        : ""
                    }
                  />
                  {validationErrors.ConfirmPassword && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.ConfirmPassword ? "show" : ""
                      }`}
                    >
                      {validationErrors.ConfirmPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4 - Category Selection */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="form-group">
                  <label className="custom-label">Business Category</label>
                  <select
                    className={`custom-select select-animate ${
                      validationErrors.GlobalCategoryId
                        ? "is-invalid"
                        : formData.GlobalCategoryId !== 0
                        ? "is-valid"
                        : ""
                    }`}
                    name="GlobalCategoryId"
                    value={formData.GlobalCategoryId || ""}
                    onChange={handleGlobalCategoryChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="6">Restaurant</option>
                    <option value="25">Celebrities</option>
                    <option value="26">Market</option>
                    <option value="27">Productive Families</option>
                  </select>
                  {validationErrors.GlobalCategoryId && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.GlobalCategoryId ? "show" : ""
                      }`}
                    >
                      {validationErrors.GlobalCategoryId}
                    </div>
                  )}
                </div>

                {/* Specific Category for Restaurants */}
                {showRestaurantCategories && (
                  <div className="form-group category-appear">
                    <label className="custom-label">Restaurant Type</label>
                    <select
                      className={`custom-select select-animate ${
                        validationErrors.SpecificCategoryId
                          ? "is-invalid"
                          : formData.SpecificCategoryId !== null
                          ? "is-valid"
                          : ""
                      }`}
                      name="SpecificCategoryId"
                      value={formData.SpecificCategoryId || ""}
                      onChange={handleSpecificCategoryChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="4">Burger</option>
                      <option value="5">Dessert</option>
                      <option value="6">Pizza</option>
                    </select>
                    {validationErrors.SpecificCategoryId && (
                      <div
                        className={`error-message-inline ${
                          validationErrors.SpecificCategoryId ? "show" : ""
                        }`}
                      >
                        {validationErrors.SpecificCategoryId}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Row 5 - Image Uploads */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                {/* Business Image Upload */}
                <div className="form-group">
                  <label className="custom-label">Business Image</label>
                  <div className="upload-section">
                    {!businessImagePreview ? (
                      <CustomButton
                        text="Upload Business Image"
                        variant="secondary"
                        className={`custom-upload-button ${
                          validationErrors.Image
                            ? "is-invalid"
                            : formData.Image
                            ? "is-valid"
                            : ""
                        }`}
                        onClick={handleBusinessImageUpload}
                      />
                    ) : (
                      <>
                        <img
                          src={businessImagePreview}
                          alt="Business Preview"
                          className="thumbnail-preview business-thumbnail thumbnail-animate"
                        />
                        <CustomButton
                          text="Change Business Image"
                          variant="secondary"
                          className="change-photo-button"
                          onClick={handleBusinessImageUpload}
                        />
                      </>
                    )}
                    <input
                      type="file"
                      ref={businessImageRef}
                      onChange={handleBusinessImageChange}
                      className="file-input"
                      accept="image/*"
                    />
                  </div>
                  {validationErrors.Image && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.Image ? "show" : ""
                      }`}
                    >
                      {validationErrors.Image}
                    </div>
                  )}
                </div>

                {/* ID Image Upload */}
                <div className="form-group">
                  <label className="custom-label">ID Image</label>
                  <div className="upload-section">
                    {!idImagePreview ? (
                      <CustomButton
                        text="Upload ID Image"
                        variant="secondary"
                        className={`custom-upload-button ${
                          validationErrors.IdImage
                            ? "is-invalid"
                            : formData.IdImage
                            ? "is-valid"
                            : ""
                        }`}
                        onClick={handleIdImageUpload}
                      />
                    ) : (
                      <>
                        <img
                          src={idImagePreview}
                          alt="ID Preview"
                          className="thumbnail-preview id-thumbnail thumbnail-animate"
                        />
                        <CustomButton
                          text="Change ID Image"
                          variant="secondary"
                          className="change-photo-button"
                          onClick={handleIdImageUpload}
                        />
                      </>
                    )}
                    <input
                      type="file"
                      ref={idImageRef}
                      onChange={handleIdImageChange}
                      className="file-input"
                      accept="image/*"
                    />
                  </div>
                  {validationErrors.IdImage && (
                    <div
                      className={`error-message-inline ${
                        validationErrors.IdImage ? "show" : ""
                      }`}
                    >
                      {validationErrors.IdImage}
                    </div>
                  )}
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className={`register-button animate-form-element ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              {/* Social sign-up */}
              <div
                className="social-section animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <p className="social-text">Or sign up with</p>
                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn social-btn-animate"
                  >
                    <FaGoogle className="social-icon" />
                  </button>
                  <button
                    type="button"
                    className="social-btn social-btn-animate"
                  >
                    <FaFacebookF className="social-icon" />
                  </button>
                  <button
                    type="button"
                    className="social-btn social-btn-animate"
                  >
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
            </form>
          </div>
          {/* Conditional rendering for success message */}
          {successMessage && (
            <div className="registration-success-message">
              <div className="success-checkmark">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <p>{successMessage}</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (Purple background, illustration) with enhanced animation */}
        <div className="auth-right">
          <div className="animation-container">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="floating-shape shape-4"></div>
            <div className="floating-shape shape-5"></div>
            <img
              src="/a.png"
              alt="Illustration"
              className="auth-illustration"
            />
          </div>
        </div>
      </div>

      {/* Spinner Overlay with improved animation */}
      {loading && (
        <div className="spinner-overlay">
          <div className="loader">
            <svg className="circular" viewBox="25 25 50 50">
              <circle
                className="path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth="3"
                strokeMiterlimit="10"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Toast Notification Pop-up */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}
    </>
  );
};

export default Register;
