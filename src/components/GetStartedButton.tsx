import React from "react";
import { useNavigate } from "react-router-dom";
import "./GetStartedButton.css";

const GetStartedButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register"); // Change this path to match your actual route
  };

  return (
    <button className="get-started" onClick={handleClick}>
      Get Started
    </button>
  );
};

export default GetStartedButton;
