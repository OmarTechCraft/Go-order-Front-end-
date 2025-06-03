import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCog,
  FaEye,
  FaEnvelope,
  FaBell,
  FaBoxOpen,
  FaImages,
  FaBullhorn,
  FaShoppingCart,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// NEW ICON IMPORTS
import { HiSparkles, HiSquares2X2 } from "react-icons/hi2";

import "./Sidebar_2.css";

export interface Sidebar_2Props {
  /** The name of the logged-in user */
  name?: string;
  /** The email of the logged-in user */
  email?: string;
  /** (Optional) URL of the user's avatar image */
  avatarUrl?: string;
  /** Whether the mobile menu is currently open */
  isMobileMenuOpen?: boolean;
  /** Function to toggle the mobile menu open/closed */
  toggleMobileMenu?: () => void;
}

const Sidebar_2: React.FC<Sidebar_2Props> = ({
  name = "User Name",
  email = "user@example.com",
  avatarUrl,
  isMobileMenuOpen = false,
  toggleMobileMenu,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to handle toggling of the "Orders" submenu
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleOrdersToggle = () => {
    setOrdersOpen((prev) => !prev);
  };

  // State to manage internal mobile menu state if toggleMobileMenu prop isn't provided
  const [mobileOpen, setMobileOpen] = useState(isMobileMenuOpen);
  // State to manage overlay visibility
  const [overlayVisible, setOverlayVisible] = useState(isMobileMenuOpen);

  useEffect(() => {
    // Update internal state when prop changes
    setMobileOpen(isMobileMenuOpen);
    setOverlayVisible(isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // Handle window resize to automatically close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileOpen) {
        handleToggleMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  const handleToggleMobileMenu = (forceState?: boolean) => {
    const newState =
      typeof forceState !== "undefined" ? forceState : !mobileOpen;

    if (toggleMobileMenu) {
      toggleMobileMenu();
    } else {
      setMobileOpen(newState);
    }

    setOverlayVisible(newState);

    // Prevent body scrolling when menu is open
    if (newState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  // Handle logout with confirmation modal
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear all proxy storage data
    localStorage.clear();
    sessionStorage.clear();

    // Close modal
    setShowLogoutModal(false);

    // Navigate to login or home page
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Determine if using internal or external mobile menu state
  const isMenuOpen = toggleMobileMenu ? isMobileMenuOpen : mobileOpen;

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        className="sidebar_2-toggle"
        onClick={() => handleToggleMobileMenu()}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Background overlay for mobile */}
      {overlayVisible && (
        <div
          className={`sidebar_2-overlay ${overlayVisible ? "active" : ""}`}
          onClick={() => handleToggleMobileMenu(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="logout-modal-content">
              <h3>Confirm Logout</h3>
              <p>
                Are you sure you want to logout? All your session data will be
                cleared.
              </p>
              <div className="logout-modal-buttons">
                <button className="logout-cancel-btn" onClick={cancelLogout}>
                  Cancel
                </button>
                <button className="logout-confirm-btn" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`sidebar_2 ${isMenuOpen ? "mobile-open" : ""}`}>
        {/* Top Section: Menu Items */}
        <div className="sidebar_2-top">
          <ul className="sidebar_2-menu">
            {/* Dashboard */}
            <li className={isActive("/BusDashboard") ? "active" : ""}>
              <Link
                to="/BusDashboard"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaHome className="sidebar_2-icon" />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Profile */}
            <li className={isActive("/profile_b") ? "active" : ""}>
              <Link
                to="/profile_b"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaUser className="sidebar_2-icon" />
                <span>Profile</span>
              </Link>
            </li>

            {/* Settings */}
            <li className={isActive("/Bus-settings") ? "active" : ""}>
              <Link
                to="/Bus-settings"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaCog className="sidebar_2-icon" />
                <span>Settings</span>
              </Link>
            </li>

            {/* User review */}
            <li className={isActive("/reviews") ? "active" : ""}>
              <Link
                to="/reviews"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaEye className="sidebar_2-icon" />
                <span>User review</span>
              </Link>
            </li>

            {/* Messages */}
            <li className={isActive("/messages") ? "active" : ""}>
              <Link
                to="/messages"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaEnvelope className="sidebar_2-icon" />
                <span>Messages</span>
              </Link>
            </li>

            {/* Notifications */}
            <li className={isActive("/notifications") ? "active" : ""}>
              <Link
                to="/notifications"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaBell className="sidebar_2-icon" />
                <span>Notifications</span>
              </Link>
            </li>

            {/* Add Category */}
            <li className={isActive("/add-category-business") ? "active" : ""}>
              <Link
                to="/add-category-business"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <HiSparkles className="sidebar_2-icon" />
                <span>Add Category</span>
              </Link>
            </li>

            {/* Add Subcategory */}
            <li
              className={isActive("/add-subcategory-business") ? "active" : ""}
            >
              <Link
                to="/add-subcategory-business"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <HiSquares2X2 className="sidebar_2-icon" />
                <span>Add Subcategory</span>
              </Link>
            </li>

            {/* Add Product */}
            <li className={isActive("/add-product-business_1") ? "active" : ""}>
              <Link
                to="/add-product-business_1"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaBoxOpen className="sidebar_2-icon" />
                <span>Add Product</span>
              </Link>
            </li>

            {/* Image Generator */}
            <li className={isActive("/image-generator") ? "active" : ""}>
              <Link
                to="/image-generator"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaImages className="sidebar_2-icon" />
                <span>Image Generator</span>
              </Link>
            </li>

            {/* Marketing AI */}
            <li className={isActive("/marketing-ai") ? "active" : ""}>
              <Link
                to="/marketing-ai"
                onClick={() =>
                  window.innerWidth <= 768 && handleToggleMobileMenu(false)
                }
              >
                <FaBullhorn className="sidebar_2-icon" />
                <span>Marketing AI</span>
              </Link>
            </li>

            <li className="sidebar_2-orders" onClick={handleOrdersToggle}>
              <div className="sidebar_2-orders-title">
                <FaShoppingCart className="sidebar_2-icon" />
                <span>Orders</span>
                {ordersOpen ? (
                  <FaChevronUp className="sidebar_2-chevron-icon" />
                ) : (
                  <FaChevronDown className="sidebar_2-chevron-icon" />
                )}
              </div>
              {ordersOpen && (
                <ul className="sidebar_2-orders-submenu">
                  <li className={isActive("/orders/all") ? "active" : ""}>
                    <Link to="/orders/all">All Orders</Link>
                  </li>
                  <li className={isActive("/orders/waiting") ? "active" : ""}>
                    <Link to="/orders/waiting">Waiting</Link>
                  </li>
                  <li
                    className={isActive("/orders/in-progress") ? "active" : ""}
                  >
                    <Link to="/orders/in-progress">In Progress</Link>
                  </li>
                  <li className={isActive("/orders/done") ? "active" : ""}>
                    <Link to="/orders/done">Done</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Logout */}
            <li>
              <a href="#" onClick={handleLogoutClick}>
                <FaSignOutAlt className="sidebar_2-icon" />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Section: User Info */}
        <div className="sidebar_2-bottom">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="sidebar_2-avatar"
            />
          )}
          <div className="sidebar_2-user-info">
            <span className="sidebar_2-user-name">{name}</span>
            <span className="sidebar_2-user-email">{email}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar_2;
