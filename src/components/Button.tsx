import React from "react";

interface CustomButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  className,
  onClick,
  variant = "primary",
}) => {
  return (
    <button
      className={`custom-${variant}-button ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
