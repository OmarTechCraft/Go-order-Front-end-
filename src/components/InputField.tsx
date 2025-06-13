import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Define the props interface for CustomInputField
interface CustomInputFieldProps {
  type: string;
  placeholder: string;
  showEyeIcon?: boolean; // Optional prop to show/hide password toggle
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // <--- ADDED: Optional CSS class for additional styling
  name?: string; // <--- ADDED: The 'name' attribute for the input element
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  type,
  placeholder,
  showEyeIcon,
  value,
  onChange,
  className, // <--- Destructure className prop
  name,      // <--- Destructure name prop
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  // Determine the actual input type based on showEyeIcon and visibility state
  const inputType = isVisible && showEyeIcon ? "text" : type;

  return (
    <div className="custom-input-container">
      <input
        type={inputType}
        name={name} // <--- Passed the 'name' prop to the native <input>
        placeholder={placeholder}
        // Combine the default class with any additional classes passed via props
        className={custom-input-field ${className || ""}}
        value={value}
        onChange={onChange}
      />
      {showEyeIcon && (
        <div className="custom-eye-icon" onClick={toggleVisibility}>
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}
    </div>
  );
};

export default CustomInputField;
