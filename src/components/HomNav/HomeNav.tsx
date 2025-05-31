import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeNav.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check for token and user data in localStorage on component mount
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role.toLowerCase()); // Store role in lowercase for consistent comparison
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }

    // Add an event listener for changes to localStorage (e.g., after login/logout)
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      const updatedUser = localStorage.getItem("user");

      if (updatedToken && updatedUser) {
        setIsLoggedIn(true);
        try {
          const userData = JSON.parse(updatedUser);
          setUserRole(userData.role.toLowerCase());
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleAuthButton = () => {
    if (isLoggedIn) {
      if (userRole === "business") {
        navigate("/BusDashboard");
      } else if (userRole === "superadmin" || userRole === "admin") {
        navigate("/dashboard");
      } else {
        // Fallback for unexpected roles, or simply navigate to a general dashboard
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1
        className="navbar-title"
        onClick={handleTitleClick}
        style={{ cursor: "pointer" }}
      >
        GoOrder
      </h1>
      <button className="login-button" onClick={handleAuthButton}>
        {isLoggedIn ? "Dashboard" : "Login"}
      </button>
    </nav>
  );
};

export default Navbar;
