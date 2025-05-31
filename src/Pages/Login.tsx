import React, { useState, useRef, useEffect } from "react";
import CustomInputField from "../components/InputField";
import CustomButton from "../components/Button";
import { FaGoogle, FaFacebookF, FaApple, FaSpinner } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service/authentication_Service";

interface LoginError {
  response?: {
    status: number;
  };
}

const MyLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [modalAnimation, setModalAnimation] = useState("");

  const otpRefs = useRef<HTMLInputElement[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  // Animation effect when component mounts
  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add("form-enter");
    }
  }, []);

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setShowSpinner(true);

    try {
      // Fixed: use the userData directly from the login response
      const userData = await login(email, password);

      // Store token/user data in localStorage for session persistence
      // The token is already stored in the login function, but we can ensure it here too
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on user role
      const role = userData.role.toLowerCase();
      if (role === "super_admin" || role === "admin") {
        navigate("/dashboard");
      } else if (role === "business") {
        navigate("/BusDashboard");
      } else {
        // Default fallback if role is not one of the expected values
        navigate("/");
      }
    } catch (err: unknown) {
      // Handle specific error cases
      const error = err as LoginError;
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 401) {
          // Specific auth errors
          setLoginError("Invalid email or password");
        } else if (status === 404) {
          setLoginError("User not found");
        } else {
          setLoginError("An error occurred during login");
        }
      } else {
        setLoginError("Network error. Please try again later.");
      }
      console.error(err);
    } finally {
      setShowSpinner(false);
    }
  };

  const openModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setModalAnimation("modal-enter");
    setShowModal(true);
  };

  const closeModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowModal(false);
      setForgotEmail("");
      setForgotEmailError("");
    }, 300);
  };

  const handleContinueForgotPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError("Please enter a valid email");
      return;
    }
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowModal(false);
      setModalAnimation("modal-enter");
      setShowOTPModal(true);
    }, 300);
  };

  const closeOTPModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowOTPModal(false);
    }, 300);
  };

  const handleContinueOTP = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowOTPModal(false);
      setModalAnimation("modal-enter");
      setShowNewPasswordModal(true);
    }, 300);
  };

  const closeNewPasswordModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowNewPasswordModal(false);
    }, 300);
  };

  const handleVerifyAccount = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowNewPasswordModal(false);
      setShowSpinner(true);
      setTimeout(() => {
        setShowSpinner(false);
      }, 1280);
    }, 300);
  };

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      if (otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      if (otpRefs.current[index - 1]) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  // Toggle password visibility for main login form
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        className={`auth-container login-page ${
          showModal || showOTPModal || showNewPasswordModal ? "blur" : ""
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
                onClick={openModal}
              >
                Forgot password?
              </a>

              <CustomButton
                text="SIGN in"
                variant="primary"
                className="sign-in-button button-pulse"
                onClick={handleLogin}
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

      {showModal && (
        <div className="modal-overlay">
          <div
            className={`modal-content ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Forgot password?</h2>
            <p className="modal-subtitle">
              Enter your email address and we'll send you a confirmation code to
              reset your password.
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
            />
            {forgotEmailError && (
              <p style={{ color: "red", marginTop: "5px" }}>
                {forgotEmailError}
              </p>
            )}

            <CustomButton
              text="Continue"
              variant="primary"
              className="modal-button button-pulse"
              onClick={handleContinueForgotPassword}
            />

            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}

      {showOTPModal && (
        <div className="modal-overlay">
          <div
            className={`modal-content ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Enter OTP</h2>
            <p className="modal-subtitle">
              A 6-Digit code has been sent to your Email
            </p>

            <div className="otp-input-container">
              {Array.from({ length: 6 }, (_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="otp-input input-animate"
                  ref={(ref) => {
                    if (ref) otpRefs.current[i] = ref;
                  }}
                  onChange={(e) => handleOTPChange(e, i)}
                />
              ))}
            </div>

            <CustomButton
              text="Continue"
              variant="primary"
              className="modal-button button-pulse"
              onClick={handleContinueOTP}
            />

            <button className="resend-button hover-effect">Resend code</button>

            <button className="modal-close-btn" onClick={closeOTPModal}>
              ×
            </button>
          </div>
        </div>
      )}

      {showNewPasswordModal && (
        <div className="modal-overlay">
          <div
            className={`modal-content new-password-modal ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Create a new password</h2>

            <label className="modal-label">Password</label>
            <div className="modal-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="modal-input input-animate"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="modal-eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <label className="modal-label">Confirm Password</label>
            <div className="modal-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="modal-input input-animate"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="modal-eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <CustomButton
              text="Verify Account"
              variant="primary"
              className="modal-button button-pulse"
              onClick={handleVerifyAccount}
            />

            <button className="modal-close-btn" onClick={closeNewPasswordModal}>
              ×
            </button>
          </div>
        </div>
      )}

      {showSpinner && (
        <div className="spinner-overlay">
          <FaSpinner className="spinner-icon" />
        </div>
      )}
    </>
  );
};

export default MyLogin;
