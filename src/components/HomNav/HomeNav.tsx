import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeNav.css"; // Ensure your CSS file is correctly linked

const Navbar = () => {
  const navigate = useNavigate();
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

  return (
    <>
      <nav className="navbar">
        <h1
          className="navbar-title"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          GoOrder
        </h1>
        <div className="navbar-buttons">
          <button
            className="login-button"
            onClick={handleAuthButton}
            disabled={loading}
          >
            {loading ? "Loading..." : isLoggedIn ? "Dashboard" : "Login"}
          </button>
          {isLoggedIn && (
            <button
              className="logout-button"
              onClick={handleLogoutClick} // This now directly opens the modal
              disabled={loading}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-content">
              {" "}
              {/* Added this div */}
              <h3>Confirm Logout</h3> {/* Updated title */}
              <p>
                Are you sure you want to logout? All your session data will be
                cleared.
              </p>{" "}
              {/* Updated message */}
              <div className="logout-modal-buttons">
                {" "}
                {/* Renamed this div */}
                <button className="logout-cancel-btn" onClick={cancelLogout}>
                  {" "}
                  {/* Renamed class */}
                  Cancel
                </button>
                <button className="logout-confirm-btn" onClick={confirmLogout}>
                  {" "}
                  {/* Renamed class */}
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
