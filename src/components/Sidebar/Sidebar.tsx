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
  FaAngleDown,
  FaCheck,
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
    rightIcon: <FaAngleDown />,
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
    label: "Add  Subcategory",
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
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialUser) {
      fetchUserProfile();
    }
  }, [initialUser]);

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
    // Clear any other auth-related items you might have
    localStorage.removeItem("userRole");
    localStorage.removeItem("authExpiration");

    setShowLogoutModal(false);
    navigate("/home"); // Navigate to home page after confirming logout
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="sidebar-content">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isLogout = item.label === "Logout";
              return (
                <li className="nav-item" key={item.label}>
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
                    {item.rightIcon && (
                      <span className="nav-right-icon">{item.rightIcon}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="user-info">
            {isLoading ? (
              <div className="loading-state">Loading profile...</div>
            ) : userData ? (
              <>
                <img
                  src={userData.avatarUrl || "/photos/boy1.png"}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <div className="user-details">
                  <h4>{userData.name}</h4>
                  <p>{userData.email}</p>
                </div>
              </>
            ) : (
              <div className="error-state">Could not load profile</div>
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
            <h3>Are you sure you want to logout?</h3>
            <div className="logout-modal-actions">
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
