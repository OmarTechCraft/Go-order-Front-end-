import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/api"; // Adjust path as per your project structure
import "../../styles/PasswordReset.css"; // Link to the new CSS file

const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Extract userId and token from URL query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("userId");
    const tok = queryParams.get("token");

    if (id && tok) {
      setUserId(id);
      setToken(tok);
      setError(null); // Clear any previous errors if params are found
    } else {
      setError(
        "Missing User ID or Token in URL. Please use a valid password reset link."
      );
    }
  }, []);

  // Handle form submission for password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // 1. Client-side validation
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Both password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (newPassword.length < 6) {
      // Example: enforce a minimum password length
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!userId || !token) {
      setError("Cannot reset password: User ID or Token is missing.");
      return;
    }

    setIsLoading(true); // Indicate loading state

    try {
      // 2. URL-encode the token before sending
      const encodedToken = encodeURIComponent(token);

      // Send data to API in JSON format with URL-encoded token
      const response = await axiosInstance.post(
        "/api/Auth/PasswordReset",
        {
          userId: userId,
          token: encodedToken,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json", // Keep JSON content type
          },
        }
      );

      // Assuming a 200 OK response from the API means success
      if (response.status === 200) {
        setSuccessMessage(
          "Password successfully changed! You'll be redirected to registration."
        );
        setNewPassword(""); // Clear form fields
        setConfirmPassword("");

        // 3. Redirect to /register after a short delay
        setSuccessMessage("complete the Login Process"); // Redirect after 3 seconds
      } else {
        // Handle unexpected success responses if API behaves differently
        setError("An unexpected issue occurred. Please try again.");
      }
    } catch (apiError: any) {
      // 4. Handle API errors
      console.error("Password reset API error:", apiError);
      if (apiError.response && apiError.response.data) {
        // Try to get a specific error message from the API response
        if (typeof apiError.response.data === "string") {
          setError(apiError.response.data);
        } else if (apiError.response.data.message) {
          setError(apiError.response.data.message);
        } else {
          setError(
            "Failed to reset password. Please verify your link or try again."
          );
        }
      } else {
        setError(
          "Network error or server unavailable. Please try again later."
        );
      }
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="password-reset-container">
      {/* Success Message Overlay */}
      {successMessage && (
        <div className="success-overlay">
          <div className="success-popup">
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Password Reset Form Card */}
      <div className="password-reset-card">
        <h2 className="password-reset-title">Reset Your Password</h2>
        <p className="password-reset-subtitle">
          Enter and confirm your new secure password.
        </p>

        <form onSubmit={handleSubmit} className="password-reset-form">
          {error && <div className="error-message">{error}</div>}

          {/* New Password Input */}
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={
                isLoading || successMessage !== null || !userId || !token
              }
              required
            />
          </div>

          {/* Confirm New Password-Input */}
          <div className="form-group">
            <label htmlFor="confirm-password">COnfirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={
                isLoading || successMessage !== null || !userId || !token
              }
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || successMessage !== null || !userId || !token}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
