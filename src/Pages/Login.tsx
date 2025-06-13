import React, { useState, useRef, useEffect } from "react";
import CustomInputField from "../components/InputField";
import CustomButton from "../components/Button";
import { FaGoogle, FaFacebookF, FaApple, FaSpinner } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  forgotPassword,
  confirmEmailByCode,
  resetPassword,
} from "../service/authentication_Service";

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

  // States for forgot password flow
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordResetError, setPasswordResetError] = useState("");
  const [userId, setUserId] = useState("");
  const [resetToken, setResetToken] = useState("");

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
      const userData = await login(email, password);

      // Store token/user data in localStorage for session persistence
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on user role
      const role = userData.role.toLowerCase();
      if (role === "super_admin" || role === "admin") {
        navigate("/dashboard");
      } else if (role === "business") {
        navigate("/BusDashboard");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const error = err as LoginError;
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 401) {
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
    // Reset all forgot password states
    setForgotEmail("");
    setForgotEmailError("");
    setOtpCode("");
    setOtpError("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordResetError("");
    setUserId("");
    setResetToken("");
  };

  const closeModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowModal(false);
      setForgotEmail("");
      setForgotEmailError("");
    }, 300);
  };

  // Step 1: Send forgot password email
  const handleContinueForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError("Please enter a valid email");
      return;
    }

    setShowSpinner(true);
    try {
      await forgotPassword(forgotEmail);
      setModalAnimation("modal-exit");
      setTimeout(() => {
        setShowModal(false);
        setModalAnimation("modal-enter");
        setShowOTPModal(true);
      }, 300);
    } catch (error) {
      setForgotEmailError("Failed to send reset code. Please try again.");
      console.error("Forgot password error:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const closeOTPModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowOTPModal(false);
      setOtpCode("");
      setOtpError("");
    }, 300);
  };

  // Step 2: Verify OTP code
  const handleContinueOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit code");
      return;
    }

    setShowSpinner(true);
    try {
      const response = await confirmEmailByCode(parseInt(otpCode));

      // Store the userId and token from the response for password reset
      if (response && response.userId && response.token) {
        setUserId(response.userId);
        setResetToken(response.token);
      } else {
        // If the response doesn't have userId/token, we'll need to handle this differently
        // For now, we'll continue to the next step and handle the error there if needed
        console.warn("No userId or token received from OTP verification");
      }

      setModalAnimation("modal-exit");
      setTimeout(() => {
        setShowOTPModal(false);
        setModalAnimation("modal-enter");
        setShowNewPasswordModal(true);
      }, 300);
    } catch (error) {
      setOtpError("Invalid or expired code. Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const closeNewPasswordModal = () => {
    setModalAnimation("modal-exit");
    setTimeout(() => {
      setShowNewPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordResetError("");
      setUserId("");
      setResetToken("");
    }, 300);
  };

  // Step 3: Reset password
  const handleResetPassword = async () => {
    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      setPasswordResetError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordResetError("Passwords do not match");
      return;
    }

    setShowSpinner(true);
    try {
      await resetPassword(userId, resetToken, newPassword);

      setModalAnimation("modal-exit");
      setTimeout(() => {
        setShowNewPasswordModal(false);
        // Reset all states
        setForgotEmail("");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
        setUserId("");
        setResetToken("");
        setPasswordResetError("");
        alert(
          "Password reset successful! Please login with your new password."
        );
      }, 300);
    } catch (error) {
      setPasswordResetError("Failed to reset password. Please try again.");
      console.error("Password reset error:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtpCode = otpCode.split("");
      newOtpCode[index] = value;
      setOtpCode(newOtpCode.join(""));

      if (otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      const newOtpCode = otpCode.split("");
      newOtpCode[index] = "";
      setOtpCode(newOtpCode.join(""));

      if (otpRefs.current[index - 1]) {
        otpRefs.current[index - 1].focus();
      }
    }

    // Clear error when user starts typing
    if (otpError) {
      setOtpError("");
    }
  };

  const handleResendCode = async () => {
    try {
      setShowSpinner(true);
      await forgotPassword(forgotEmail);
      alert("New code sent to your email!");
    } catch (error) {
      alert("Failed to resend code. Please try again.");
      console.error("Resend code error:", error);
    } finally {
      setShowSpinner(false);
    }
  };

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

      {/* Step 1: Email Input Modal */}
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

      {/* Step 2: OTP Input Modal */}
      {showOTPModal && (
        <div className="modal-overlay">
          <div
            className={`modal-content ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Enter Verification Code</h2>
            <p className="modal-subtitle">
              A 6-digit code has been sent to {forgotEmail}
            </p>

            <div className="otp-input-container">
              {Array.from({ length: 6 }, (_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="otp-input input-animate"
                  value={otpCode[i] || ""}
                  ref={(ref) => {
                    if (ref) otpRefs.current[i] = ref;
                  }}
                  onChange={(e) => handleOTPChange(e, i)}
                />
              ))}
            </div>

            {otpError && (
              <p
                style={{ color: "red", marginTop: "10px", textAlign: "center" }}
              >
                {otpError}
              </p>
            )}

            <CustomButton
              text="Continue"
              variant="primary"
              className="modal-button button-pulse"
              onClick={handleContinueOTP}
            />

            <button
              className="resend-button hover-effect"
              onClick={handleResendCode}
            >
              Resend code
            </button>

            <button className="modal-close-btn" onClick={closeOTPModal}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Step 3: New Password Modal */}
      {showNewPasswordModal && (
        <div className="modal-overlay">
          <div
            className={`modal-content new-password-modal ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">Create New Password</h2>
            <p className="modal-subtitle">
              Enter your new password to complete the reset process.
            </p>

            <label className="modal-label">New Password</label>
            <div className="modal-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="modal-input input-animate"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordResetError("");
                }}
              />
              <span
                className="modal-eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <label className="modal-label">Confirm New Password</label>
            <div className="modal-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="modal-input input-animate"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordResetError("");
                }}
              />
              <span
                className="modal-eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {passwordResetError && (
              <p
                style={{ color: "red", marginTop: "10px", textAlign: "center" }}
              >
                {passwordResetError}
              </p>
            )}

            <CustomButton
              text="Reset Password"
              variant="primary"
              className="modal-button button-pulse"
              onClick={handleResetPassword}
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
