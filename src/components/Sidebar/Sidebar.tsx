import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaUser,
  FaCog,
  FaUserPlus,
  FaBuilding,
  FaMotorcycle,
  FaPlusSquare,
  FaLayerGroup,
  FaSignOutAlt,
  FaCheck,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css";
import { getUserProfile } from "../../service/Profile_service";

// Type definition for user data
interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

// Props for the Sidebar component
interface SidebarProps {
  initialUser?: User;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    icon: <FaChartBar />,
    path: "/dashboard",
  },
  { label: "Profile", icon: <FaUser />, path: "/profile" },
  { label: "Settings", icon: <FaCog />, path: "/settings" },
  { label: "Add Admin", icon: <FaUserPlus />, path: "/add-admin" },
  { label: "Manage Business", icon: <FaBuilding />, path: "/manage-business" },
  {
    label: "Manage Delivery Man",
    icon: <FaMotorcycle />,
    path: "/manage-delivery",
  },
  { label: "Add New Category", icon: <FaPlusSquare />, path: "/add-category" },
  {
    label: "Add Subcategory",
    icon: <FaLayerGroup />,
    path: "/add-subcategory",
  },
  { label: "Accept Register", icon: <FaCheck />, path: "/accept-register" },
  { label: "Logout", icon: <FaSignOutAlt />, path: "/logout" },
];

const Sidebar: React.FC<SidebarProps> = ({
  initialUser,
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState(!initialUser);

  // Check authentication status
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (token || refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        navigate("/login");
        return;
      }
      setAuthChecked(true);
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await getUserProfile();
        setUserData({
          name: `${profileData.firstName} ${profileData.lastName}`,
          email: profileData.email,
          avatarUrl: profileData.image || "/photos/boy1.png",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // If profile fetch fails, might indicate invalid token
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialUser) {
      fetchUserProfile();
    }
  }, [initialUser, authChecked, isAuthenticated, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        toggleMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, toggleMobileMenu]);

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("authExpiration");
    localStorage.removeItem("id");

    setShowLogoutModal(false);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Don't render sidebar if not authenticated
  if (!authChecked || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="sidebar-gradient"></div>
        <div className="sidebar-content">
          <ul className="nav-list">
            {navItems.map((item, index) => {
              const isLogout = item.label === "Logout";
              return (
                <li
                  className="nav-item"
                  key={item.label}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={(e) => {
                      if (window.innerWidth < 1024) {
                        toggleMobileMenu();
                      }
                      if (isLogout) {
                        handleLogoutClick(e);
                      }
                    }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                   
                    <div className="nav-item-hover"></div>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="user-info">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>Loading profile...</span>
              </div>
            ) : userData ? (
              <>
                <div className="user-avatar-container">
                  <img
                    src={userData.avatarUrl || "/photos/boy1.png"}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                  <div className="user-status-indicator"></div>
                </div>
                <div className="user-details">
                  <h4>{userData.name}</h4>
                  <p>{userData.email}</p>
                </div>
              </>
            ) : (
              <div className="error-state">
                <FaExclamationTriangle />
                <span>Could not load profile</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu} />
      )}

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
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to sign out of your account?</p>
            </div>
            <div className="logout-modal-actions">
              <button className="cancel-btn" onClick={cancelLogout}>
                <span>Cancel</span>
              </button>
              <button className="confirm-btn" onClick={confirmLogout}>
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
