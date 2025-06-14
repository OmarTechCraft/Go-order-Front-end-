import React from "react";

interface CustomButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean; // <--- ADDED THIS LINE: Makes the 'disabled' prop optional and boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  className,
  onClick,
  variant = "primary",
  disabled, // <--- ADDED THIS LINE: Destructure the disabled prop
}) => {
  return (
    <button
      className={`custom-${variant}-button ${className}`}
      onClick={onClick}
      disabled={disabled} // <--- ADDED THIS LINE: Apply the disabled prop to the native button
    >
      {text}
    </button>
  );
};

export default CustomButton;
