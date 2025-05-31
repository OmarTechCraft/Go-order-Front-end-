import React, { useRef, useState, useEffect } from "react";
import CustomInputField from "../components/InputField";
import CustomButton from "../components/Button";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import "../styles/register.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

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
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animationInProgress, setAnimationInProgress] = useState(false);

  // Refs for file inputs
  const businessImageRef = useRef<HTMLInputElement>(null);
  const idImageRef = useRef<HTMLInputElement>(null);

  // Ref for the animation container
  const animationRef = useRef<HTMLDivElement>(null);

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

  // Handle input focus animation
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Initialize the form elements with a staggered animation
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

    // Add event listeners for focus and blur to handle animations
    const addFocusListeners = () => {
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="password"]'
      );
      inputs.forEach((input) => {
        input.addEventListener("focus", handleInputFocusEvent);
        input.addEventListener("blur", handleInputBlurEvent);
      });
    };

    // Delay to ensure inputs are rendered
    setTimeout(addFocusListeners, 100);

    // Cleanup event listeners
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

  // Handle input changes with animation
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName?: string
  ) => {
    const name = fieldName || e.target.name;
    const value = e.target.value;

    // Add ripple effect when typing
    if (e.target instanceof HTMLInputElement && e.target.type !== "file") {
      const ripple = document.createElement("span");
      ripple.classList.add("input-ripple");
      e.target.parentElement?.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 500);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle business image upload with animation
  const handleBusinessImageUpload = () => {
    if (businessImageRef.current && !animationInProgress) {
      setAnimationInProgress(true);
      const button = document.querySelector(
        ".custom-upload-button"
      ) as HTMLElement;
      button.classList.add("button-pulse");

      setTimeout(() => {
        businessImageRef.current?.click();
        button.classList.remove("button-pulse");
        setAnimationInProgress(false);
      }, 500);
    }
  };

  // Handle ID image upload with animation
  const handleIdImageUpload = () => {
    if (idImageRef.current && !animationInProgress) {
      setAnimationInProgress(true);
      const button = document.querySelectorAll(
        ".custom-upload-button"
      )[1] as HTMLElement;
      button.classList.add("button-pulse");

      setTimeout(() => {
        idImageRef.current?.click();
        button.classList.remove("button-pulse");
        setAnimationInProgress(false);
      }, 500);
    }
  };

  // Handle business image change with animation
  const handleBusinessImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        Image: file,
      });

      // Create preview with fade-in animation
      const preview = URL.createObjectURL(file);
      const imgElement = document.createElement("img");
      imgElement.src = preview;
      imgElement.onload = () => {
        setBusinessImagePreview(preview);
        const thumbnailElement = document.querySelector(
          ".business-thumbnail"
        ) as HTMLElement;
        if (thumbnailElement) {
          thumbnailElement.classList.add("thumbnail-animate");
        }
      };
    }
  };

  // Handle ID image change with animation
  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        IdImage: file,
      });

      // Create preview with fade-in animation
      const preview = URL.createObjectURL(file);
      const imgElement = document.createElement("img");
      imgElement.src = preview;
      imgElement.onload = () => {
        setIdImagePreview(preview);
        const thumbnailElement = document.querySelector(
          ".id-thumbnail"
        ) as HTMLElement;
        if (thumbnailElement) {
          thumbnailElement.classList.add("thumbnail-animate");
        }
      };
    }
  };

  // Handle global category change and reset specific category if needed
  const handleGlobalCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const globalCategoryId = parseInt(e.target.value);

    // Add selection animation
    e.target.classList.add("select-changed");
    setTimeout(() => {
      e.target.classList.remove("select-changed");
    }, 500);

    setFormData({
      ...formData,
      GlobalCategoryId: globalCategoryId,
      // Reset specific category when global category changes
      SpecificCategoryId: null,
    });
  };

  // Handle specific category change
  const handleSpecificCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const specificCategoryId = parseInt(e.target.value);

    // Add selection animation
    e.target.classList.add("select-changed");
    setTimeout(() => {
      e.target.classList.remove("select-changed");
    }, 500);

    setFormData({
      ...formData,
      SpecificCategoryId: specificCategoryId,
    });
  };

  // Form submission handler with enhanced animation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions

    // Add form submit animation
    document.querySelector(".register-form")?.classList.add("form-submitting");

    // Basic validation
    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      shakeErrorMessage();
      return;
    }

    if (!formData.GlobalCategoryId) {
      setError("Please select a business category");
      shakeErrorMessage();
      return;
    }

    if (formData.GlobalCategoryId === 6 && !formData.SpecificCategoryId) {
      setError("Please select a specific restaurant category");
      shakeErrorMessage();
      return;
    }

    if (!formData.Image) {
      setError("Please upload your business image");
      shakeErrorMessage();
      return;
    }

    if (!formData.IdImage) {
      setError("Please upload your ID image");
      shakeErrorMessage();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create form data for multipart/form-data request (for file uploads)
      const requestData = new FormData();
      requestData.append("name", formData.name);
      requestData.append("PhoneNumber", formData.PhoneNumber);
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

      // Show success animation before redirect
      const successAnimation = () => {
        const formElement = document.querySelector(
          ".auth-content"
        ) as HTMLElement;
        if (formElement) {
          formElement.classList.add("success-animation");

          // Create success checkmark
          const successMark = document.createElement("div");
          successMark.className = "success-checkmark";
          successMark.innerHTML = `
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          `;

          formElement.appendChild(successMark);

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      };

      // Send request to register endpoint
      const response = await api.post("/api/Business/Register", requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      if (response.status === 200 || response.status === 201) {
        // Show success animation and then redirect
        successAnimation();
      }
    } catch (err: unknown) {
      // Handle error with animation
      document
        .querySelector(".register-form")
        ?.classList.remove("form-submitting");

      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Registration failed. Please try again."
      );
      shakeErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  // Function to add shake animation to error message
  const shakeErrorMessage = () => {
    const errorElement = document.querySelector(".error-message");
    if (errorElement) {
      errorElement.classList.add("shake-animation");
      setTimeout(() => {
        errorElement.classList.remove("shake-animation");
      }, 500);
    }
  };

  // Determine if specific restaurant categories should be shown
  const showRestaurantCategories = formData.GlobalCategoryId === 6;

  return (
    <>
      <div className="auth-container">
        {/* LEFT SIDE (White background, form) */}
        <div className="auth-left">
          <h1 className="brand-logo animate-logo">GoOrder</h1>
          <div className="auth-content">
            <h2 className="auth-heading animate-heading">
              Be a Partner as a Business
            </h2>

            {error && <div className="error-message">{error}</div>}

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
                    placeholder="Your Business Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, "name")}
                  />
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
                    type="tel"
                    placeholder="+20111111111"
                    value={formData.PhoneNumber}
                    onChange={(e) => handleInputChange(e, "PhoneNumber")}
                  />
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
                    placeholder="username@gmail.com"
                    value={formData.Email}
                    onChange={(e) => handleInputChange(e, "Email")}
                  />
                </div>
                <div className="form-group">
                  <label
                    className={`custom-label ${
                      focusedField === "BankAccountNumber" ? "label-focus" : ""
                    }`}
                  >
                    Bank Account Number
                  </label>
                  <CustomInputField
                    type="text"
                    placeholder="5574 *** ****"
                    value={formData.BankAccountNumber}
                    onChange={(e) => handleInputChange(e, "BankAccountNumber")}
                  />
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
                    placeholder="Your Business Address"
                    value={formData.Address}
                    onChange={(e) => handleInputChange(e, "Address")}
                  />
                </div>
              </div>

              {/* Row 3 */}
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
                    placeholder="********"
                    showEyeIcon
                    value={formData.Password}
                    onChange={(e) => handleInputChange(e, "Password")}
                  />
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
                    placeholder="********"
                    showEyeIcon
                    value={formData.ConfirmPassword}
                    onChange={(e) => handleInputChange(e, "ConfirmPassword")}
                  />
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
                    className="custom-select select-animate"
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
                </div>

                {/* Specific Category for Restaurants */}
                {showRestaurantCategories && (
                  <div className="form-group category-appear">
                    <label className="custom-label">Restaurant Type</label>
                    <select
                      className="custom-select select-animate"
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
                  </div>
                )}
              </div>

              {/* Row 5 - Image Uploads */}
              <div
                className="form-row animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="form-group">
                  <label className="custom-label">Business Image</label>
                  <div className="upload-section">
                    <CustomButton
                      text="Upload Business Image"
                      variant="secondary"
                      className="custom-upload-button"
                      onClick={handleBusinessImageUpload}
                    />
                    <input
                      type="file"
                      ref={businessImageRef}
                      onChange={handleBusinessImageChange}
                      className="file-input"
                      accept="image/*"
                    />
                    {businessImagePreview && (
                      <img
                        src={businessImagePreview}
                        alt="Business Preview"
                        className="thumbnail-preview business-thumbnail"
                      />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="custom-label">ID Image</label>
                  <div className="upload-section">
                    <CustomButton
                      text="Upload ID Image"
                      variant="secondary"
                      className="custom-upload-button"
                      onClick={handleIdImageUpload}
                    />
                    <input
                      type="file"
                      ref={idImageRef}
                      onChange={handleIdImageChange}
                      className="file-input"
                      accept="image/*"
                    />
                    {idImagePreview && (
                      <img
                        src={idImagePreview}
                        alt="ID Preview"
                        className="thumbnail-preview id-thumbnail"
                      />
                    )}
                  </div>
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
              <p
                className="register-text animate-form-element"
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                Already have an account?{" "}
                <Link to="/login" className="register-link">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE (Purple background, illustration) with enhanced animation */}
        <div className="auth-right">
          <div className="animation-container" ref={animationRef}>
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
    </>
  );
};

export default Register;
