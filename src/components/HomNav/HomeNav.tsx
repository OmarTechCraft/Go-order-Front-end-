import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "./HomeNav.css"; // Ensure your CSS file is correctly linked

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Initialize useTranslation hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for the logout modal

  // Function to update login state and user role
  const updateLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role?.toLowerCase() || null);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear corrupted data and reset state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserRole(null);
        window.dispatchEvent(new Event("storage")); // Dispatch to ensure consistency
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial check on component mount
    updateLoginStatus();

    // Add event listeners for storage changes and custom logout event
    const handleStorageChange = () => {
      updateLoginStatus();
    };

    // Listener for custom event to open the logout modal
    const handleTriggerLogoutModal = () => {
      setShowLogoutModal(true);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    window.addEventListener("triggerLogoutModal", handleTriggerLogoutModal); // Listen for custom event

    // Check auth status periodically (every 5 seconds)
    const authCheckInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          JSON.parse(user);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          updateLoginStatus();
        }
      }
    }, 5000);

    return () => {
      // Clean up event listeners and interval
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
      window.removeEventListener(
        "triggerLogoutModal",
        handleTriggerLogoutModal
      ); // Clean up custom event listener
      clearInterval(authCheckInterval);
    };
  }, [updateLoginStatus]);

  const handleAuthButton = () => {
    if (isLoggedIn) {
      // User is logged in, navigate to appropriate dashboard
      if (userRole === "business") {
        navigate("/BusDashboard");
      } else if (userRole === "superadmin" || userRole === "admin") {
        navigate("/dashboard");
      } else {
        console.warn("Unknown user role:", userRole);
        navigate("/login");
      }
    } else {
      // User is not logged in, navigate to login page
      navigate("/login");
    }
  };

  // Function to open the logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Function to confirm logout
  const confirmLogout = () => {
    try {
      // Clear all storage data safely
      if (typeof Storage !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (error) {
      console.warn("Could not clear storage:", error);
    }

    setIsLoggedIn(false); // Update local state
    setUserRole(null); // Update local state
    setShowLogoutModal(false); // Close the modal

    window.dispatchEvent(new Event("storage")); // Notify other components (like Sidebar)
    navigate("/", { replace: true }); // Navigate to home and replace history
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  // Function to toggle language - REMOVED document.body.style.direction calls
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    // document.body.style.direction is now handled by the Home component's wrapper div
  };

  return (
    <>
      <nav className="navbar">
        <h1
          className="navbar-title"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          {t("GoOrder")}
        </h1>
        <div className="navbar-buttons">
          {/* Language Toggle Button */}
          <button className="language-toggle-button" onClick={toggleLanguage}>
            {i18n.language === "en" ? "العربية" : "English"}
          </button>

          <button
            className="login-button"
            onClick={handleAuthButton}
            disabled={loading}
          >
            {loading ? "Loading..." : isLoggedIn ? t("Dashboard") : t("Login")}
          </button>
          {isLoggedIn && (
            <button
              className="logout-button"
              onClick={handleLogoutClick} // This now directly opens the modal
              disabled={loading}
            >
              {t("Logout")}
            </button>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-header">
              <div className="logout-icon">
                <FaSignOutAlt />
              </div>
              <button className="close-modal" onClick={cancelLogout}>
                <FaTimes />
              </button>
            </div>
            <div className="logout-modal-body">
              <h3>{t("Confirm Logout")}</h3>
              <p>{t("Are you sure you want to sign out of your account?")}</p>
            </div>
            <div className="logout-modal-actions">
              <button className="cancel-btn" onClick={cancelLogout}>
                <span>{t("Cancel")}</span>
              </button>
              <button className="confirm-btn" onClick={confirmLogout}>
                <FaSignOutAlt />
                <span>{t("Sign Out")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;