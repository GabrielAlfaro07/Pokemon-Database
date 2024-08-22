import React from "react";
import PreviousButton from "./PreviousButton";
import NextButton from "./NextButton";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="pagination-controls flex justify-center gap-2 mt-4">
      <PreviousButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      />
      <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center">
        Page {currentPage + 1} of {totalPages}
      </span>
      <NextButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      />
    </div>
  );
};

export default PaginationButtons;
