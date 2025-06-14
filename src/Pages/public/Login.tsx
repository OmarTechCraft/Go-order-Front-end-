import React, { useState, useRef, useEffect } from "react";
import CustomInputField from "../../components/InputField";
import CustomButton from "../../components/Button"; // This import will now correctly type CustomButton
import { FaGoogle, FaFacebookF, FaApple, FaSpinner } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/login.css"; // Ensure this CSS file is updated if needed
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  forgotPassword,
  // Removed confirmEmailByCode, resetPassword as they are now handled by the /password-reset page
} from "../../service/authentication_Service";

interface LoginError {
  response?: {
    status: number;
    data?: {
      // Added data to the error response interface
      message?: string;
    };
  };
}

const MyLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showModal, setShowModal] = useState(false); // Controls the "Forgot Password" email input modal
  const [showSpinner, setShowSpinner] = useState(false); // For general loading indications

  const [showPassword, setShowPassword] = useState(false); // For login password visibility

  const [forgotEmail, setForgotEmail] = useState(""); // Email for forgot password flow
  const [forgotEmailError, setForgotEmailError] = useState(""); // Error for forgot password email input
  const [modalAnimation, setModalAnimation] = useState(""); // For modal entry/exit animations
  const [emailSentMessage, setEmailSentMessage] = useState<string | null>(null); // Message after sending forgot password email

  const formRef = useRef<HTMLDivElement>(null);

  // Animation effect when component mounts
  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add("form-enter");
    }
  }, []);

  // Validation for the main login form
  const validateLoginForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");
    setLoginError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  // Handles the main login process
  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setShowSpinner(true);

    try {
      const userData = await login(email, password);

      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("id", userData.id); // Assuming id is always available for storing

      const role = userData.role?.toLowerCase(); // Use optional chaining for safety
      if (role === "super_admin" || role === "admin") {
        navigate("/dashboard");
      } else if (role === "business") {
        navigate("/BusDashboard");
      } else {
        navigate("/"); // Default redirect for other roles
      }
    } catch (err: unknown) {
      const error = err as LoginError;
      if (error.response) {
        const status = error.response.status;
        // Check if there's a specific error message from the backend
        const errorMessage =
          error.response.data?.message || "An error occurred during login.";
        if (status === 400 || status === 401) {
          setLoginError(errorMessage);
        } else if (status === 404) {
          setLoginError("User not found.");
        } else {
          setLoginError("An unexpected error occurred. Please try again.");
        }
      } else {
        setLoginError("Network error. Please try again later.");
      }
      console.error("Login failed:", err);
    } finally {
      setShowSpinner(false);
    }
  };

  // Opens the "Forgot Password" email input modal
  const openModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setModalAnimation("modal-enter");
    setShowModal(true);
    // Reset states for forgot password flow
    setForgotEmail("");
    setForgotEmailError("");
    setEmailSentMessage(null); // Ensure no previous success message is shown
  };

  // Closes the "Forgot Password" email input modal
  const closeModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowModal(false);
      setForgotEmail("");
      setForgotEmailError("");
      setEmailSentMessage(null); // Clear the message when modal is fully closed
    }, 300); // Match CSS animation duration
  };

  // Handles sending the "Forgot Password" email
  const handleSendForgotPasswordEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail)) {
      setForgotEmailError("Please enter a valid email address.");
      return;
    }
    setForgotEmailError(""); // Clear previous error

    setShowSpinner(true);
    try {
      await forgotPassword(forgotEmail);
      // On success, display the message to check email
      setEmailSentMessage(
        "A password reset link has been sent to your email. Please check your inbox (and spam folder) to continue the password reset process."
      );
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: string | { message?: string } };
      };
      let errorMessage = "Failed to send reset email. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setForgotEmailError(errorMessage);
      setEmailSentMessage(null); // Ensure success message is not shown
      console.error("Forgot password email send error:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  // Toggles visibility of the login password field
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        className={`auth-container login-page ${
          showModal ? "blur" : "" // Only blur if the email modal is open
        }`}
      >
        <div className="auth-left">
          <h1
            className="brand-logo animate-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            GoOrder
          </h1>

          <div className="auth-content" ref={formRef}>
            <h2 className="auth-heading">Login to your account</h2>
            <p className="auth-subtitle">Please sign in to your account</p>

            <div className="auth-form">
              <div style={{ marginBottom: "13px" }}>
                <label className="custom-label">Email Address</label>
                <CustomInputField
                  type="email"
                  placeholder="username@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                    setLoginError("");
                  }}
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </div>

              <label className="custom-label">Password</label>
              <div className="custom-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="custom-input-field input-animate"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                    setLoginError("");
                  }}
                />
                <span
                  className="custom-eye-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              {loginError && <p className="error-message">{loginError}</p>}

              <a
                href="#"
                className="custom-forgot-link hover-effect"
                onClick={openModal} // Open the email input modal
              >
                Forgot password?
              </a>

              <CustomButton
                text="SIGN in"
                variant="primary"
                className="sign-in-button button-pulse"
                onClick={handleLogin}
                disabled={showSpinner} // This prop will now be accepted
              />

              <div className="social-section">
                <p className="social-text">Or sign in with</p>
                <div className="social-buttons">
                  <button className="social-btn button-hover">
                    <FaGoogle className="social-icon" />
                  </button>
                  <button className="social-btn button-hover">
                    <FaFacebookF className="social-icon" />
                  </button>
                  <button className="social-btn button-hover">
                    <FaApple className="social-icon" />
                  </button>
                </div>
              </div>

              <p className="register-text">
                Don't have an account?{" "}
                <Link to="/register" className="register-link hover-effect">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <img
            src="/a.png"
            alt="Illustration"
            className="auth-illustration animate-illustration"
          />
        </div>
      </div>

      {/* Forgot Password Email Input Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className={`modal-content ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Conditional rendering based on whether email has been sent */}
            {!emailSentMessage ? (
              <>
                <h2 className="modal-title">Forgot password?</h2>
                <p className="modal-subtitle">
                  Enter your email address to receive a password reset link.
                </p>

                <label className="modal-label">Email Address</label>
                <input
                  type="email"
                  placeholder="username@gmail.com"
                  className="modal-input input-animate"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotEmailError("");
                  }}
                  disabled={showSpinner}
                />
                {forgotEmailError && (
                  <p className="error-message">{forgotEmailError}</p>
                )}

                <CustomButton
                  text={showSpinner ? "Sending..." : "Send Reset Link"}
                  variant="primary"
                  className="modal-button button-pulse"
                  onClick={handleSendForgotPasswordEmail}
                  disabled={showSpinner} // This prop will now be accepted
                />
              </>
            ) : (
              // Display message after email is sent
              <>
                <h2 className="modal-title success-email-sent">Email Sent!</h2>
                <p className="modal-subtitle email-sent-message">
                  {emailSentMessage}
                </p>
                <CustomButton
                  text="Close"
                  variant="primary"
                  className="modal-button button-pulse"
                  onClick={closeModal}
                />
              </>
            )}

            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Global Spinner Overlay - useful for any async operation */}
      {showSpinner && (
        <div className="spinner-overlay">
          <FaSpinner className="spinner-icon" />
        </div>
      )}
    </>
  );
};

export default MyLogin;
