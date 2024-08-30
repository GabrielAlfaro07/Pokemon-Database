import React from "react";

interface NextButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-gray-600 text-white rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-500 disabled:bg-gray-400"
      style={{ width: "100px", height: "40px" }} // Fixed size for the button
    >
      Next
    </button>
  );
};

export default NextButton;
