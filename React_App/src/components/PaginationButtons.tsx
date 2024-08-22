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
  // Create an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="pagination-controls flex justify-center gap-2 mt-4 flex-wrap">
      <PreviousButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      />
      <div className="flex gap-2">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-2 rounded-full ${
              pageNumber === currentPage
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
      <NextButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      />
    </div>
  );
};

export default PaginationButtons;
