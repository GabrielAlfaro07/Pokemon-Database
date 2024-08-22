import React from "react";

interface PreviousButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const PreviousButton: React.FC<PreviousButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-gray-600 text-white rounded-full flex items-center justify-center"
      style={{ width: "100px", height: "40px" }} // Fixed size for the button
    >
      Previous
    </button>
  );
};

export default PreviousButton;
