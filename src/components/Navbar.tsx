import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Replace with your login route
  };

  const handleTitleClick = () => {
    navigate("/"); // Homepage route
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title" onClick={handleTitleClick} style={{ cursor: "pointer" }}>
        GoOrder
      </h1>
      <button className="login-button" onClick={handleLoginClick}>
        Login
      </button>
    </nav>
  );
};

export default Navbar;
