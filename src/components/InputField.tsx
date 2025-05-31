import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CustomInputFieldProps {
  type: string;
  placeholder: string;
  showEyeIcon?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  type,
  placeholder,
  showEyeIcon,
  value,
  onChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const inputType = isVisible && showEyeIcon ? "text" : type;

  return (
    <div className="custom-input-container">
      <input
        type={inputType}
        placeholder={placeholder}
        className="custom-input-field"
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
